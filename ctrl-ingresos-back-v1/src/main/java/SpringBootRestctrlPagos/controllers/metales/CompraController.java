package SpringBootRestctrlPagos.controllers.metales;

import SpringBootRestctrlPagos.controllers.dto.metales.*;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.ingresos.Ingreso;
import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.services.IUserService;
import SpringBootRestctrlPagos.services.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tools/ctrlPagos/metalesApp/compra")
@CrossOrigin(origins = {"http://localhost:4200"})
public class CompraController {
    @Autowired
    private ICompraService compraService;

    @Autowired
    private IVentaService ventaService;

    @Autowired
    private IUserService userService;
    @Autowired
    private IDetalleCompraService detalleCompraService;

    @GetMapping("/find/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        Optional<Compra> compraOptional = compraService.findByIdAndChildren(id);
        if (compraOptional.isPresent()) {
            Compra compra = compraOptional.get();
            CompraDTO compraDTO = compraToCompraDTO(compra);
            return ResponseEntity.ok(compraDTO);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findMaxId")
    public ResponseEntity<?> findMaxId(@RequestParam String username) {
        Long maxId = compraService.findMaxId(username);
        if (maxId != null) {
            return ResponseEntity.ok(maxId);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAll")
    public ResponseEntity<?> findAll() {
        List<CompraDTO> compraList = compraService.findAllAndChildren()
                .stream()
                .map(compra -> compraToCompraDTO(compra))
                .toList();

        return ResponseEntity.ok(compraList);
    }

    @GetMapping("/findAllNotIdVenta")
    public ResponseEntity<?> findAllAndChildrenNotIdVenta(@RequestParam String username) {
        List<CompraDTO> compraList = compraService.findAllAndChildrenNotIdVenta(username)
                .stream()
                .map(compra -> compraToCompraDTO(compra))
                .toList();

        return ResponseEntity.ok(compraList);
    }

    @GetMapping("/findAllWithIdVenta")
    public ResponseEntity<?> findAllWithIdVenta(@RequestParam String username) {
        List<CompraDTO> compraList = compraService.findAllAndChildrenWithVenta(username)
                .stream()
                .map(compra -> compraToCompraDTO(compra))
                .toList();

        return ResponseEntity.ok(compraList);
    }

    @GetMapping("/findAllPagination/{cantidad}/{pagina}")
    public ResponseEntity<?> findAllPagination(@PathVariable("cantidad") Long cantidad
            , @PathVariable("pagina") int pagina
            , @RequestParam String username) {
        ListadoPaginador<Compra> listadoPaginador = compraService.findAllWithPagination(cantidad, pagina, username);
        List<CompraDTO> compraDTOList = listadoPaginador.getElementos()
                .stream()
                .map(compra -> compraToCompraDTO(compra))
                .toList();

        ListadoPaginador<CompraDTO> compraDTOListadoPaginador = new ListadoPaginador<>();
        compraDTOListadoPaginador.setCantidadTotal(listadoPaginador.getCantidadTotal());
        compraDTOListadoPaginador.setElementos(compraDTOList);
        return ResponseEntity.ok(compraDTOListadoPaginador);
    }

    @GetMapping("/findAllWithVentaPagination/{cantidad}/{pagina}")
    public ResponseEntity<?> findAllWithVentaPagination(@PathVariable("cantidad") Long cantidad,
                                                        @PathVariable("pagina") int pagina,
                                                        @RequestParam String startBuyFilter,
                                                        @RequestParam String endBuyFilter,
                                                        @RequestParam String startSaleFilter,
                                                        @RequestParam String endSaleFilter,
                                                        @RequestParam String descriptionSaleFilter,
                                                        @RequestParam String username) {
        ListadoPaginador<Compra> listadoPaginador = compraService.findAllWithVentaPagination(cantidad, pagina, startBuyFilter, endBuyFilter, startSaleFilter, endSaleFilter, descriptionSaleFilter, username);
        List<ConsultaCompraDTO> compraDTOList = listadoPaginador.getElementos()
                .stream()
                .map(compra -> compraToConsultaCompraDTO(compra))
                .toList();
        ListadoPaginador<ConsultaCompraDTO> compraDTOListadoPaginador = new ListadoPaginador<>();
        compraDTOListadoPaginador.setCantidadTotal(listadoPaginador.getCantidadTotal());
        compraDTOListadoPaginador.setElementos(compraDTOList);
        return ResponseEntity.ok(compraDTOListadoPaginador);
    }

    @GetMapping("/findAllWithVenta/{cantidad}/{pagina}")
    public ResponseEntity<?> findAllWithVenta(@PathVariable("cantidad") Long cantidad,
                                                        @PathVariable("pagina") int pagina,
                                                        @RequestParam String startBuyFilter,
                                                        @RequestParam String endBuyFilter,
                                                        @RequestParam String startSaleFilter,
                                                        @RequestParam String endSaleFilter,
                                                        @RequestParam String descriptionSaleFilter,
                                                        @RequestParam String username) {
        List<Compra> listado = compraService.findAllWithVenta(cantidad, pagina, startBuyFilter, endBuyFilter, startSaleFilter, endSaleFilter, descriptionSaleFilter, username);
        List<ConsultaCompraDTO> compraDTOList = listado
                .stream()
                .map(compra -> compraToConsultaCompraDTO(compra))
                .toList();
        return ResponseEntity.ok(compraDTOList);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody CompraDTO compraDTO) throws URISyntaxException {
        try {
            Compra compra = compraDTOToCompra(compraDTO);
            Optional<Usuario> optionalUser = userService.findByUsername(compra.getUsuario().getUsername());
            if (optionalUser.isPresent()) {
                Usuario user = optionalUser.get();
                compra.setUsuario(user);

                compraService.saveOrUpdate(compra);
                Response response = new Response();
                response.setIdMessage("202");
                response.setMessage("Registro modificado con éxito.");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            System.out.println(e);
            throw new RuntimeException(e);

        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody CompraDTO compraDTO) throws URISyntaxException {
        Optional<Compra> optionalCompra = compraService.findById(id);
        if (optionalCompra.isPresent()) {
            Compra compra = optionalCompra.get();
            compra.setTotalComprado(compraDTO.getTotalComprado());
            compra.setFechaCompra(compraDTO.getFechaCompra());
            compra.setCierre(compraDTO.isCierre());
            compra.setFicticio(compraDTO.isFicticio());
            compra.setComentario(compraDTO.getComentario());
            compra.setVenta(compraDTO.getVenta());
            compra.setEditadoPor(compraDTO.getEditadoPor());
            compra.setModificadoEl(new Date());
            compraService.saveOrUpdate(compra);
            Response response = new Response();
            response.setIdMessage("202");
            response.setMessage("Registro modificado con éxito.");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Response response = new Response();
        if (id != null) {
            compraService.deleteById(id);
            response.setIdMessage("200");
            response.setMessage("Registro eliminado");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().build();
    }

    private CompraDTO compraToCompraDTO(Compra compra) {
        return CompraDTO.builder()
                .id(compra.getId())
                .fechaCompra(compra.getFechaCompra())
                .detalleCompra(compra.getDetalleCompra())
                .totalComprado(compra.getTotalComprado())
                .cierre(compra.isCierre())
                .ficticio(compra.isFicticio())
                .comentario(compra.getComentario())
                .venta(compra.getVenta())
                .editadoPor(compra.getEditadoPor())
                .modificadoEl(compra.getModificadoEl())
                .usuario(compra.getUsuario())
                .build();
    }

    private ConsultaCompraDTO compraToConsultaCompraDTO(Compra compra) {
        return ConsultaCompraDTO.builder()
                .id(compra.getId())
                .fechaCompra(compra.getFechaCompra())
                .detalleCompra(compra.getDetalleCompra())
                .totalComprado(compra.getTotalComprado())
                .cierre(compra.isCierre())
                .ficticio(compra.isFicticio())
                .comentario(compra.getComentario())
                .venta(compra.getVenta())
                .editadoPor(compra.getEditadoPor())
                .modificadoEl(compra.getModificadoEl())
                .usuario(compra.getUsuario())
                .build();
    }

    private Compra compraDTOToCompra(CompraDTO compraDTO) {
        return Compra.builder()
                .id(compraDTO.getId())
                .fechaCompra(compraDTO.getFechaCompra())
                .detalleCompra(compraDTO.getDetalleCompra())
                .totalComprado(compraDTO.getTotalComprado())
                .cierre(compraDTO.isCierre())
                .ficticio(compraDTO.isFicticio())
                .comentario(compraDTO.getComentario())
                .venta(compraDTO.getVenta())
                .editadoPor(compraDTO.getEditadoPor())
                .modificadoEl(compraDTO.getModificadoEl())
                .usuario(compraDTO.getUsuario())
                .build();
    }


}
