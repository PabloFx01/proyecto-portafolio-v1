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
@RequestMapping("tools/ctrlPagos/metalesApp/venta/ticket/detalle-ticket")
@CrossOrigin(origins = {"http://localhost:4200"})
public class DetalleTicketController {
    @Autowired
    private IDetalleTicketService detalleTicketService;

    @GetMapping("/find/{id}/{idTicket}")
    public ResponseEntity<?> findById(@PathVariable Long id,@PathVariable Long idTicket ) {
        Optional<DetalleTicket> detalleTicketOptional = detalleTicketService.findByIdAndChildren(id,idTicket);
        if (detalleTicketOptional.isPresent()) {
            DetalleTicket detalleTicket = detalleTicketOptional.get();
            DetalleTicketDTO detalleTicketDTO = detalleTicketToDetalleTicketDTO(detalleTicket);
            return ResponseEntity.ok(detalleTicketDTO);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAll/{idTicket}")
    public ResponseEntity<?> findAll(@PathVariable("idTicket") Long idTicket) {
        List<DetalleTicket> detalleTicketList =  detalleTicketService.findAllAndChildren(idTicket);
        List<DetalleTicketDTO> detalleTicketDTOList = detalleTicketList
                .stream()
                .map(detalleTicket -> detalleTicketToDetalleTicketDTO(detalleTicket))
                .collect(Collectors.toList());
        return ResponseEntity.ok(detalleTicketDTOList);
    }
    @GetMapping("/findAllPaginado/{idTicket}/{cantidad}/{pagina}")
    public ResponseEntity<?> findAllPagination(@PathVariable("idTicket") Long idTicket,
                                               @PathVariable("cantidad") Long cantidad,
                                               @PathVariable("pagina") int pagina,
                                               @RequestParam(required = false) String filter) {
        ListadoPaginador<DetalleTicket> listadoPaginador =
                detalleTicketService.findAllWithPagination(idTicket,cantidad, pagina, filter);
        List<DetalleTicketDTO> detalleTicketDTOList = listadoPaginador.getElementos()
                .stream()
                .map(detalleTicket -> detalleTicketToDetalleTicketDTO(detalleTicket))
                .collect(Collectors.toList());

        ListadoPaginador<DetalleTicketDTO> detalleTicketDTOListadoPaginador = new ListadoPaginador<>();
        detalleTicketDTOListadoPaginador.setCantidadTotal(listadoPaginador.getCantidadTotal());
        detalleTicketDTOListadoPaginador.setElementos(detalleTicketDTOList);

        return ResponseEntity.ok(detalleTicketDTOListadoPaginador);
    }

    @GetMapping("/nextIdDetalleByIdTicket/{idTicket}")
    public ResponseEntity<?> nextIdDetalleByIdTicket(@PathVariable("idTicket") Long idTicket) {
        Long idDetalle = detalleTicketService.nextIdDetalleByIdTicket(idTicket);
        DetalleTicketId detalleTicketId = new DetalleTicketId(idDetalle, idTicket);
        return ResponseEntity.ok(detalleTicketId);
    }

    @PostMapping("/save")
    public ResponseEntity<?> create(@RequestBody DetalleTicketDTO detalleTicketDTO) throws URISyntaxException {
        detalleTicketService.saveOrUpdate(detalleTicketDTOToDetalleTicket(detalleTicketDTO));
        Response response = new Response("201", "Registro creado con exito");
        return ResponseEntity.ok(response);
       // return ResponseEntity.created(new URI("api/v1/compra/detalle-compra/save")).build();
    }


    @PutMapping("/update/{id}/{idTicket}")
    public ResponseEntity<?> update(@PathVariable Long id, @PathVariable Long idTicket,
                                    @RequestBody DetalleTicketDTO DetalleTicketDTO) throws URISyntaxException {
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

    @DeleteMapping("/delete/{id}/{idTicket}")
    public ResponseEntity<?> delete(@PathVariable Long id, @PathVariable Long idTicket) {
        Response response = new Response();
        if (id != null) {
            DetalleTicketId detalleId = new DetalleTicketId(id,idTicket);
            detalleTicketService.deleteById(detalleId);
            response.setIdMessage("200");
            response.setMessage("Registro eliminado");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().build();
    }

    private DetalleTicketDTO detalleTicketToDetalleTicketDTO(DetalleTicket detalleTicket) {
        return DetalleTicketDTO.builder()
                .detalleId(detalleTicket.getDetalleId())
                .metal(detalleTicket.getMetal())
                .metalAsociadoTicket(detalleTicket.getMetalAsociadoTicket())
                .pesoVendido(detalleTicket.getPesoVendido())
                .precioVenta(detalleTicket.getPrecioVenta())
                .importe((detalleTicket.getImporte()))
                .ticket(detalleTicket.getTicket())
                .build();
    }

    private DetalleTicket detalleTicketDTOToDetalleTicket(DetalleTicketDTO detalleTicketDTO) {
        return DetalleTicket.builder()
                .detalleId(detalleTicketDTO.getDetalleId())
                .metal(detalleTicketDTO.getMetal())
                .metalAsociadoTicket(detalleTicketDTO.getMetalAsociadoTicket())
                .pesoVendido(detalleTicketDTO.getPesoVendido())
                .precioVenta(detalleTicketDTO.getPrecioVenta())
                .importe((detalleTicketDTO.getImporte()))
                .ticket(detalleTicketDTO.getTicket())
                .build();
    }

}
