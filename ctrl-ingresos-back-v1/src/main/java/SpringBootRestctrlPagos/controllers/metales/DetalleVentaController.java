package SpringBootRestctrlPagos.controllers.metales;

import SpringBootRestctrlPagos.controllers.dto.metales.*;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.ListadoPaginador;
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
@RequestMapping("tools/ctrlPagos/metalesApp/venta/detalle-venta")
public class DetalleVentaController {
    @Autowired
    private IDetalleVentaService detalleVentaService;

    @GetMapping("/find/{id}/{idVenta}")
    public ResponseEntity<?> findById(@PathVariable Long id,@PathVariable Long idVenta ) {
        Optional<DetalleVenta> detalleVentaOptional = detalleVentaService.findByIdAndChildren(id,idVenta);
        if (detalleVentaOptional.isPresent()) {
            DetalleVenta detalleVenta = detalleVentaOptional.get();
            DetalleVentaDTO detalleVentaDTO = detalleVentaToDetalleVentaDTO(detalleVenta);
            return ResponseEntity.ok(detalleVentaDTO);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAll/{idVenta}")
    public ResponseEntity<?> findAll(@PathVariable("idVenta") Long idVenta) {
        List<DetalleVenta> detalleVentaList =  detalleVentaService.findAllAndChildren(idVenta);
        List<DetalleVentaDTO> detalleVentaDTOList = detalleVentaList
                .stream()
                .map(detalleVenta -> detalleVentaToDetalleVentaDTO(detalleVenta))
                .collect(Collectors.toList());
        return ResponseEntity.ok(detalleVentaDTOList);
    }
    @GetMapping("/findAllPaginado/{idVenta}/{cantidad}/{pagina}")
    public ResponseEntity<?> findAllPagination(@PathVariable("idVenta") Long idVenta,
                                               @PathVariable("cantidad") Long cantidad,
                                               @PathVariable("pagina") int pagina,
                                               @RequestParam(required = false) String filter) {
        ListadoPaginador<DetalleVenta> listadoPaginador =
                detalleVentaService.findAllWithPagination(idVenta,cantidad, pagina, filter);
        List<DetalleVentaDTO> detalleVentaDTOList = listadoPaginador.getElementos()
                .stream()
                .map(detalleVenta -> detalleVentaToDetalleVentaDTO(detalleVenta))
                .collect(Collectors.toList());

        ListadoPaginador<DetalleVentaDTO> detalleVentaDTOListadoPaginador = new ListadoPaginador<>();
        detalleVentaDTOListadoPaginador.setCantidadTotal(listadoPaginador.getCantidadTotal());
        detalleVentaDTOListadoPaginador.setElementos(detalleVentaDTOList);

        return ResponseEntity.ok(detalleVentaDTOListadoPaginador);
    }

    @GetMapping("/nextIdDetalleByIdVenta/{idVenta}")
    public ResponseEntity<?> nextIdDetalleByIdVenta(@PathVariable("idVenta") Long idVenta) {
        Long idDetalle = detalleVentaService.nextIdDetalleByIdVenta(idVenta);
        DetalleVentaId detalleVentaId = new DetalleVentaId(idDetalle, idVenta);
        return ResponseEntity.ok(detalleVentaId);
    }

    @PostMapping("/save")
    public ResponseEntity<?> create(@RequestBody DetalleVentaDTO detalleVentaDTO) throws URISyntaxException {
        detalleVentaService.saveOrUpdate(detalleVentaDTOToDetalleVenta(detalleVentaDTO));
        Response response = new Response("201", "Registro creado con exito");
        return ResponseEntity.ok(response);
       // return ResponseEntity.created(new URI("api/v1/compra/detalle-compra/save")).build();
    }


    @PutMapping("/update/{id}/{idVenta}")
    public ResponseEntity<?> update(@PathVariable Long id, @PathVariable Long idVenta,
                                    @RequestBody DetalleVentaDTO DetalleVentaDTO) throws URISyntaxException {
      /*  Optional<DetalleCompra> detalleCompraOptional = detalleCompraService.findPorId(id, idCompra);
        if(detalleCompraOptional.isPresent()){
            DetalleCompra detalleCompra = detalleCompraOptional.get();
            detalleCompra.setMetal(DetalleCompraDTO.getMetal());
            detalleCompra.setPeso(DetalleCompraDTO.getPeso());
            detalleCompra.setPrecioCompra(DetalleCompraDTO.getPrecioCompra());
            detalleCompra.setImporte(DetalleCompraDTO.getImporte());
            detalleCompraService.saveOrUpdate(detalleCompra);
            Response response = new Response("200", "Registro actualizado con exito");
            return ResponseEntity.ok(response);*/
       // }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}/{idVenta}")
    public ResponseEntity<?> delete(@PathVariable Long id, @PathVariable Long idVenta) {
        Response response = new Response();
        if (id != null) {
            DetalleVentaId detalleId = new DetalleVentaId(id,idVenta);
            detalleVentaService.deleteById(detalleId);
            response.setIdMessage("200");
            response.setMessage("Registro eliminado");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().build();
    }
    private DetalleVentaDTO detalleVentaToDetalleVentaDTO(DetalleVenta detalleVenta) {
        return DetalleVentaDTO.builder()
                .detalleId(detalleVenta.getDetalleId())
                .metal(detalleVenta.getMetal())
                .metalAsociadoVenta(detalleVenta.getMetalAsociadoVenta())
                .pesoVendido(detalleVenta.getPesoVendido())
                .precioPromedio(detalleVenta.getPrecioPromedio())
                .gananciaUnitaria(detalleVenta.getGananciaUnitaria())
                .venta(detalleVenta.getVenta())
                .build();
    }
    private DetalleVenta detalleVentaDTOToDetalleVenta(DetalleVentaDTO detalleVentaDTO) {
        return DetalleVenta.builder()
                .detalleId(detalleVentaDTO.getDetalleId())
                .metal(detalleVentaDTO.getMetal())
                .metalAsociadoVenta(detalleVentaDTO.getMetalAsociadoVenta())
                .pesoVendido(detalleVentaDTO.getPesoVendido())
                .precioPromedio(detalleVentaDTO.getPrecioPromedio())
                .gananciaUnitaria(detalleVentaDTO.getGananciaUnitaria())
                .venta(detalleVentaDTO.getVenta())
                .build();
    }

}
