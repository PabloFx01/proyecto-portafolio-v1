package SpringBootRestctrlPagos.controllers.metales;

import SpringBootRestctrlPagos.controllers.dto.metales.*;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.FechaCompraAsociada;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.services.IUserService;
import SpringBootRestctrlPagos.services.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tools/ctrlPagos/metalesApp/venta")
@CrossOrigin(origins = {"http://localhost:4200"})
public class VentaController {
    @Autowired
    private IVentaService ventaService;
    @Autowired
    private ICalculosService calculosService;
    @Autowired
    private IUserService userService;

    @GetMapping("/find/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        Optional<Venta> ventaOptional = ventaService.findByIdAndChildren(id);
        if (ventaOptional.isPresent()) {
            Venta venta = ventaOptional.get();
            VentaDTO ventaDTO = ventaToVentaDTO(venta);
            return ResponseEntity.ok(ventaDTO);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findMaxId")
    public ResponseEntity<?> findMaxId() {
        Long maxId = ventaService.findMaxId();
        if (maxId != null) {
            return ResponseEntity.ok(maxId);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAll")
    public ResponseEntity<?> findAll(@RequestParam String username) {
        List<VentaDTO> ventaList = ventaService.findAllAndChildren(username)
                .stream()
                .map(venta -> ventaToVentaDTO(venta))
                .toList();
        return ResponseEntity.ok(ventaList);
    }

    @GetMapping("/findAllPaginado/{cantidad}/{pagina}")
    public ResponseEntity<?> findAllPagination(@PathVariable("cantidad") Long cantidad,
                                               @PathVariable("pagina") int pagina,
                                               @RequestParam String filter,
                                               @RequestParam String username) {
        ListadoPaginador<Venta> listadoPaginador =
                ventaService.findAllWithPagination(cantidad, pagina, filter, username);

        return ResponseEntity.ok(listadoPaginador);
    }

    @GetMapping("/asociarComprasDiariasByIdVenta/{id}")
    public ResponseEntity<?> asociarComprasDiariasByIdVenta(@PathVariable Long id) {
        if (id != null) {
            ventaService.asociarComprasDiariasByIdVenta(id);

            Response response = new Response();
            response.setIdMessage("200");
            response.setMessage("Registro creado con éxito");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findFechasCompraAsociadasByIdVenta/{id}")
    public ResponseEntity<?> findFechasCompraAsociadasByIdVenta(@PathVariable Long id) {
        FechaCompraAsociada fechas = ventaService.findFechasCompraAsociadasByIdVenta(id);
        if (fechas != null) {
            return ResponseEntity.ok(fechas);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody VentaDTO ventaDTO) throws URISyntaxException {
        Venta venta = ventaDTOToVenta(ventaDTO);
        Optional<Usuario> optionalUser = userService.findByUsername(venta.getUsuario().getUsername());
        if (optionalUser.isPresent()) {
            Usuario user = optionalUser.get();
            venta.setUsuario(user);

            ventaService.saveOrUpdate(venta);
            Response response = new Response();
            response.setIdMessage("200");
            response.setMessage("Registro creado con éxito");
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody VentaDTO ventaDTO) throws URISyntaxException {
        Optional<Venta> ventaOptional = ventaService.findByIdAndChildren(id);
        if (ventaOptional.isPresent()) {
            Response response = new Response();
            Venta venta = ventaOptional.get();

            venta.setDescripcion(ventaDTO.getDescripcion());
            venta.setFechaVenta(ventaDTO.getFechaVenta());
            venta.setVentaIndividual(ventaDTO.isVentaIndividual());
            if (ventaDTO.getTicket() != null) {
                if (ventaDTO.getTicket().getId() == 0) {
                    venta.setTicket(null);
                } else {
                    venta.setTicket(ventaDTO.getTicket());
                }
            }
            if (ventaDTO.getGananciaTotal() != null) venta.setGananciaTotal(ventaDTO.getGananciaTotal());

            ventaService.saveOrUpdate(venta);
            response.setIdMessage("200");
            response.setMessage("Registro actualizado");
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Response response = new Response();
        if (id != null) {
            ventaService.deleteById(id);
            response.setIdMessage("200");
            response.setMessage("Registro eliminado");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().build();
    }


    private VentaDTO ventaToVentaDTO(Venta venta) {
        return VentaDTO.builder()
                .id(venta.getId())
                .fechaVenta(venta.getFechaVenta())
                .descripcion(venta.getDescripcion())
                .isVentaIndividual(venta.isVentaIndividual())
                .detalleVenta(venta.getDetalleVenta())
                .ticket(venta.getTicket())
                .gananciaTotal(venta.getGananciaTotal())
                .editadoPor(venta.getEditadoPor())
                .modificadoEl(venta.getModificadoEl())
                .usuario(venta.getUsuario())
                .build();
    }

    private Venta ventaDTOToVenta(VentaDTO ventaDTO) {
        return Venta.builder()
                .id(ventaDTO.getId())
                .descripcion(ventaDTO.getDescripcion())
                .fechaVenta(ventaDTO.getFechaVenta())
                .isVentaIndividual(ventaDTO.isVentaIndividual())
                .detalleVenta(ventaDTO.getDetalleVenta())
                .ticket(ventaDTO.getTicket())
                .gananciaTotal(ventaDTO.getGananciaTotal())
                .editadoPor(ventaDTO.getEditadoPor())
                .modificadoEl(ventaDTO.getModificadoEl())
                .usuario(ventaDTO.getUsuario())
                .build();
    }


}
