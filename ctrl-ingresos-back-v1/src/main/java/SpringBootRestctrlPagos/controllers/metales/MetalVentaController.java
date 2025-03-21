package SpringBootRestctrlPagos.controllers.metales;

import SpringBootRestctrlPagos.controllers.dto.metales.*;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.services.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("tools/ctrlPagos/metalesApp/metal/metal-venta")
public class MetalVentaController {
    @Autowired
    private IMetalVentaService metalVentaService;

    @GetMapping("/find/{id}/{idMetalCompra}")
    public ResponseEntity<?> findById(@PathVariable Long id, @PathVariable String idMetalCompra) {
        MetalVentaId metalVentaId = new MetalVentaId(id,idMetalCompra);
        Optional<MetalVenta> metalVentaOptional = metalVentaService.findById(metalVentaId);
        if (metalVentaOptional.isPresent()) {
            MetalVenta metalVenta = metalVentaOptional.get();
            MetalVentaDTO metalVentaDTO = metalVentaToMetalVentaDTO(metalVenta);
            return ResponseEntity.ok(metalVentaDTO);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAll/{idMetalCompra}")
    public ResponseEntity<?> findAll(@PathVariable("idMetalCompra") String idMetalCompra) {
        List<MetalVenta> metalVentaList = metalVentaService.findAllByIdMetalCompra(idMetalCompra);
        System.out.println("size " + metalVentaList.size());
        List<MetalVentaDTO> metalVentaDTOList = metalVentaList
                .stream()
                .map(metalVenta -> metalVentaToMetalVentaDTO(metalVenta))
                .collect(Collectors.toList());
        return ResponseEntity.ok(metalVentaDTOList);
    }

    @GetMapping("/nextMetalVentaIdByIdMetalCompra/{idMetalCompra}")
    public ResponseEntity<?> nextMetalVentaIdByIdMetalCompra(@PathVariable("idMetalCompra") String idMetalCompra) {
        Long id = metalVentaService.nextMetalVentaIdByIdMetalCompra(idMetalCompra);
        MetalVentaId metalVentaId = new MetalVentaId(id, idMetalCompra);
        return ResponseEntity.ok(metalVentaId);
    }

    @PostMapping("/save")
    public ResponseEntity<?> create(@RequestBody MetalVentaDTO metalVentaDTO) throws URISyntaxException {
        metalVentaService.saveOrUpdate(metalVentaDTOToMetalVenta(metalVentaDTO));
        Response response = new Response("201", "Registro creado con éxito");
        return ResponseEntity.ok(response);
        // return ResponseEntity.created(new URI("api/v1/compra/metal-compra/save")).build();
    }


    @PutMapping("/update/{id}/{idMetalCompra}")
    public ResponseEntity<?> update(@PathVariable Long id, @PathVariable String idMetalCompra,
                                    @RequestBody MetalVentaDTO metalVentaDTO) throws URISyntaxException {
        MetalVentaId metalVentaId = new MetalVentaId(id,idMetalCompra);
        Optional<MetalVenta> optionalMetalVenta = metalVentaService.findById(metalVentaId);
        if(optionalMetalVenta.isPresent()){
            MetalVenta metalVenta = optionalMetalVenta.get();
            metalVenta.setMetalVentaId(metalVentaDTO.getMetalVentaId());
            metalVenta.setEditadoPor(metalVentaDTO.getEditadoPor());
            metalVenta.setModificadoEl(metalVentaDTO.getModificadoEl());
            metalVenta.setDescripcion(metalVentaDTO.getDescripcion());
            Response response = new Response();

            metalVentaService.saveOrUpdate(metalVenta);
            response.setIdMessage("200");
            response.setMessage("Registro actualizado con éxito.");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}/{idMetalCompra}")
    public ResponseEntity<?> delete(@PathVariable Long id,
                                    @PathVariable("idMetalCompra") String idMetalCompra) {
        Response response = new Response();
        if (id != null) {
            MetalVentaId metalVentaId = new MetalVentaId(id,idMetalCompra);
            metalVentaService.deleteById(metalVentaId);
            response.setIdMessage("200");
            response.setMessage("Registro eliminado");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().build();
    }

    private MetalVentaDTO metalVentaToMetalVentaDTO(MetalVenta metalVenta) {
        return MetalVentaDTO.builder()
                .metalVentaId(metalVenta.getMetalVentaId())
                .descripcion(metalVenta.getDescripcion())
                .metalCompra(metalVenta.getMetalCompra())
                .editadoPor(metalVenta.getEditadoPor())
                .modificadoEl(metalVenta.getModificadoEl())
                .build();
    }

    private MetalVenta metalVentaDTOToMetalVenta(MetalVentaDTO metalVentaDTO) {
        return MetalVenta.builder()
                .metalVentaId(metalVentaDTO.getMetalVentaId())
                .descripcion(metalVentaDTO.getDescripcion())
                .metalCompra(metalVentaDTO.getMetalCompra())
                .editadoPor(metalVentaDTO.getEditadoPor())
                .modificadoEl(metalVentaDTO.getModificadoEl())
                .build();
    }



}
