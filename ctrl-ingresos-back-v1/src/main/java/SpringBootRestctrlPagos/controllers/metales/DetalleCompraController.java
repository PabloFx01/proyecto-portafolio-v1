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
@RequestMapping("tools/ctrlPagos/metalesApp/compra/detalle-compra")
public class DetalleCompraController {
    @Autowired
    private IDetalleCompraService detalleCompraService;
    @Autowired
    private ICalculosService calculosService;

    @GetMapping("/find/{id}/{idCompra}")
    public ResponseEntity<?> findById(@PathVariable Long id,@PathVariable Long idCompra ) {
        Optional<DetalleCompra> detalleCompraOptional = detalleCompraService.findByIdAndChildren(id,idCompra);
        if (detalleCompraOptional.isPresent()) {
            DetalleCompra detalleCompra = detalleCompraOptional.get();
            DetalleCompraDTO detalleCompraDTO = detalleCompraToDetalleCompraDTO(detalleCompra);
            return ResponseEntity.ok(detalleCompraDTO);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAll/{idCompra}")
    public ResponseEntity<?> findAll(@PathVariable("idCompra") Long idCompra) {
        System.out.println("entra en findall");
        try {
            List<DetalleCompra> compraList =  detalleCompraService.findAll(idCompra);
            List<DetalleCompraDTO> detalleCompraDTOList = compraList
                    .stream()
                    .map(detalleCompra -> detalleCompraToDetalleCompraDTO(detalleCompra))
                    .collect(Collectors.toList());
            System.out.println("sale");
            return ResponseEntity.ok(detalleCompraDTOList);
        } catch (Exception e) {
            System.out.println(e);
            throw new RuntimeException(e);
        }
    }
    @GetMapping("/findAllPaginado/{idCompra}/{cantidad}/{pagina}")
    public ResponseEntity<?> findAllPagination(@PathVariable("idCompra") Long idCompra,
                                               @PathVariable("cantidad") Long cantidad,
                                               @PathVariable("pagina") int pagina,
                                               @RequestParam(required = false) String filter) {
        ListadoPaginador<DetalleCompra> listadoPaginador =
                detalleCompraService.findAllWithPagination(idCompra,cantidad, pagina, filter);
        List<DetalleCompraDTO> detalleCompraDTOList = listadoPaginador.getElementos()
                .stream()
                .map(detalleCompra -> detalleCompraToDetalleCompraDTO(detalleCompra))
                .collect(Collectors.toList());

        ListadoPaginador<DetalleCompraDTO> detalleCompraDTOListadoPaginador = new ListadoPaginador<>();
        detalleCompraDTOListadoPaginador.setCantidadTotal(listadoPaginador.getCantidadTotal());
        detalleCompraDTOListadoPaginador.setElementos(detalleCompraDTOList);

        return ResponseEntity.ok(detalleCompraDTOListadoPaginador);
    }

    @GetMapping("/nextIdDetalleByIdCompra/{idCompra}")
    public ResponseEntity<?> nextIdDetalleByIdCompra(@PathVariable("idCompra") Long idCompra) {
        Long idDetalle = detalleCompraService.nextIdDetalleByIdCompra(idCompra);
        DetalleCompraId detalleCompraId = new DetalleCompraId(idDetalle, idCompra);
        return ResponseEntity.ok(detalleCompraId);
    }

    @PostMapping("/save")
    public ResponseEntity<?> create(@RequestBody DetalleCompraDTO detalleCompraDTO) throws URISyntaxException {
        detalleCompraService.saveOrUpdate(detalleCompraDTOToDetalleCompra(detalleCompraDTO));
        Response response = new Response("201", "Registro creado con exito");
        return ResponseEntity.ok(response);
       // return ResponseEntity.created(new URI("api/v1/compra/detalle-compra/save")).build();
    }


    @PutMapping("/update/{id}/{idCompra}")
    public ResponseEntity<?> update(@PathVariable Long id, @PathVariable Long idCompra,
                                    @RequestBody DetalleCompraDTO DetalleCompraDTO) throws URISyntaxException {
        Optional<DetalleCompra> detalleCompraOptional = detalleCompraService.findPorId(id, idCompra);
        if(detalleCompraOptional.isPresent()){
            DetalleCompra detalleCompra = detalleCompraOptional.get();
            detalleCompra.setMetal(DetalleCompraDTO.getMetal());
            detalleCompra.setPeso(DetalleCompraDTO.getPeso());
            detalleCompra.setPrecioCompra(DetalleCompraDTO.getPrecioCompra());
            detalleCompra.setImporte(DetalleCompraDTO.getImporte());
            detalleCompraService.saveOrUpdate(detalleCompra);
            Response response = new Response("200", "Registro actualizado con exito");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}/{idCompra}")
    public ResponseEntity<?> delete(@PathVariable Long id, @PathVariable Long idCompra) {
        Response response = new Response();
        if (id != null) {
            DetalleCompraId detalleId = new DetalleCompraId(id,idCompra);
            detalleCompraService.deleteById(detalleId);
            response.setIdMessage("200");
            response.setMessage("Registro eliminado");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().build();
    }

    private DetalleCompraDTO detalleCompraToDetalleCompraDTO(DetalleCompra detalleCompra) {
        return DetalleCompraDTO.builder()
                .detalleId(detalleCompra.getDetalleId())
                .metal(detalleCompra.getMetal())
                .peso(detalleCompra.getPeso())
                .precioCompra(detalleCompra.getPrecioCompra())
                .importe(detalleCompra.getImporte())
                .compra(detalleCompra.getCompra())
                .build();
    }

    private DetalleCompra detalleCompraDTOToDetalleCompra(DetalleCompraDTO detalleCompraDTO) {
        return DetalleCompra.builder()
                .detalleId(detalleCompraDTO.getDetalleId())
                .metal(detalleCompraDTO.getMetal())
                .peso(detalleCompraDTO.getPeso())
                .precioCompra(detalleCompraDTO.getPrecioCompra())
                .importe(detalleCompraDTO.getImporte())
                .compra(detalleCompraDTO.getCompra())
                .build();
    }


}
