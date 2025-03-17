package SpringBootRestctrlPagos.controllers.metales;

import SpringBootRestctrlPagos.controllers.dto.metales.*;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.services.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("tools/ctrlPagos/metalesApp/compra/inventario")
@CrossOrigin(origins = {"http://localhost:4200"})
public class InventarioController {
    @Autowired
    private IDetalleCompraService detalleCompraService;
    @Autowired
    private IInventarioService inventarioService;

    @GetMapping("/find/{id}/{metalId}")
    public ResponseEntity<?> findById(@PathVariable Long id, @PathVariable String metalId) {
        try {
            Optional<Inventario> inventarioOptional = inventarioService.findByIdAndChildren(id, metalId);
            if (inventarioOptional.isPresent()) {
                Inventario inventario = inventarioOptional.get();
                InventarioDTO inventarioDTO = inventarioToInventarioDTO(inventario);
                return ResponseEntity.ok(inventarioDTO);
            }
        } catch (Exception e) {
            System.out.println(e);
            throw new RuntimeException(e);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findByIdMetal/{metalId}")
    public ResponseEntity<?> findByIdMetal( @PathVariable String metalId) {
        Optional<Inventario> inventarioOptional = inventarioService.findByIdMetal(metalId);
        if (inventarioOptional.isPresent()) {
            Inventario inventario = inventarioOptional.get();
            InventarioDTO inventarioDTO = inventarioToInventarioDTO(inventario);
            return ResponseEntity.ok(inventarioDTO);
        }
        return ResponseEntity.ok(null);
    }

    @GetMapping("/findAll")
    public ResponseEntity<?> findAll(@RequestParam String username) {
        List<Inventario> inventarioList = inventarioService.findAllAndChildren(username);
        return ResponseEntity.ok(inventarioList);
    }

    @GetMapping("/findAllPaginado/{cantidad}/{pagina}")
    public ResponseEntity<?> findAllPagination(@PathVariable("cantidad") Long cantidad,
                                               @PathVariable("pagina") int pagina,
                                               @RequestParam String filter,
                                               @RequestParam String username) {
        ListadoPaginador<Inventario> listadoPaginador =
                inventarioService.findAllWithPagination(cantidad, pagina, filter, username);
        List<InventarioDTO> inventarioDTOList = listadoPaginador.getElementos()
                .stream()
                .map(inventario -> inventarioToInventarioDTO(inventario))
                .collect(Collectors.toList());

        ListadoPaginador<InventarioDTO> inventarioDTOListadoPaginador = new ListadoPaginador<>();
        inventarioDTOListadoPaginador.setCantidadTotal(listadoPaginador.getCantidadTotal());
        inventarioDTOListadoPaginador.setElementos(inventarioDTOList);

        return ResponseEntity.ok(inventarioDTOListadoPaginador);
    }

    @GetMapping("/nextIdInventario")
    public ResponseEntity<?> nextIdInventario(@RequestParam String username) {
        Long idInventario = inventarioService.nextInventarioId(username);
        return ResponseEntity.ok(idInventario);
    }

    @PostMapping("/save")
    public ResponseEntity<?> create(@RequestBody InventarioDTO inventarioDTO) throws URISyntaxException {
        inventarioService.saveOrUpdate(inventarioDtoToInventario(inventarioDTO));

        return ResponseEntity.created(new URI("api/v1/compra/detalle-compra/save")).build();
    }


    @PutMapping("/update/{id}/{metalId}")
    public ResponseEntity<?> update(@PathVariable Long id, @PathVariable String metalId,
                                    @RequestBody InventarioDTO inventarioDTO) throws URISyntaxException {
        System.out.println("entra en update");
        try {
            InventarioId inventarioId = new InventarioId(id, metalId);
            Optional<Inventario> inventarioOptional = inventarioService.findById(inventarioId);
            if (inventarioOptional.isPresent()) {
                Inventario inventario = inventarioOptional.get();
                inventario.setStock(inventarioDTO.getStock());
                inventario.setImporteTotal(inventarioDTO.getImporteTotal());
                inventario.setFechaUltAct(inventarioDTO.getFechaUltAct());
                inventarioService.saveOrUpdate(inventario);
                Response response = new Response("200", "Registro actualizado con exito");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            System.out.println(e);
            throw new RuntimeException(e);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}/{metalId}")
    public ResponseEntity<?> delete(@PathVariable Long id, @PathVariable String metalId) {
        Response response = new Response();
        if (id != null && metalId != null) {
            InventarioId inventarioId = new InventarioId(id,metalId);
            inventarioService.deleteById(inventarioId);
            response.setIdMessage("200");
            response.setMessage("Registro eliminado");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().build();
    }


    private InventarioDTO inventarioToInventarioDTO(Inventario inventario) {
        return InventarioDTO.builder()
                .inventarioId(inventario.getInventarioId())
                .metal(inventario.getMetal())
                .stock(inventario.getStock())
                .fechaIni(inventario.getFechaIni())
                .fechaUltAct(inventario.getFechaUltAct())
                .importeTotal(inventario.getImporteTotal())
                .usuario(inventario.getUsuario())
                .build();
    }

    private Inventario inventarioDtoToInventario(InventarioDTO inventarioDTO) {
        return Inventario.builder()
                .inventarioId(inventarioDTO.getInventarioId())
                .metal(inventarioDTO.getMetal())
                .stock(inventarioDTO.getStock())
                .fechaIni(inventarioDTO.getFechaIni())
                .fechaUltAct(inventarioDTO.getFechaUltAct())
                .importeTotal(inventarioDTO.getImporteTotal())
                .usuario(inventarioDTO.getUsuario())
                .build();
    }


}
