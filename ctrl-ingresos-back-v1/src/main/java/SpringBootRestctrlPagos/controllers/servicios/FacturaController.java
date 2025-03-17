package SpringBootRestctrlPagos.controllers.servicios;

import SpringBootRestctrlPagos.controllers.dto.servicios.FacturaDTO;
import SpringBootRestctrlPagos.controllers.dto.servicios.FacturaDTO1;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.servicios.Factura;
import SpringBootRestctrlPagos.models.entities.servicios.Servicio;
import SpringBootRestctrlPagos.services.IUserService;
import SpringBootRestctrlPagos.services.servicios.IFacturaService;
import SpringBootRestctrlPagos.services.servicios.IServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tools/ctrlPagos/servicios/factura")
public class FacturaController {

    @Autowired
    private IFacturaService facturaService;
    @Autowired
    private IUserService userService;
    @Autowired
    private IServicioService sService;

    @GetMapping("/findAll")
    public ResponseEntity<?> findAllByUser(@RequestParam String username) {
        List<FacturaDTO1> facturaDtoList =
                facturaService.findAllByUser(username)
                        .stream()
                        .map(factura -> facturaToFacturaDTO1(factura))
                        .toList();
        return ResponseEntity.ok(facturaDtoList);
    }


    @GetMapping("/findAllPagination/{cantidad}/{pagina}/{state}")
    public ResponseEntity<?> findAllPagination(@PathVariable("cantidad") Long cantidad
            , @PathVariable("pagina") int pagina
            , @PathVariable("state") String state
            , @RequestParam String username) {
        ListadoPaginador<Factura> listadoPaginador = facturaService.findAllWithPagination(cantidad, pagina, state, username);
        List<FacturaDTO> facturaDTOList = listadoPaginador.getElementos()
                .stream()
                .map(factura -> facturaToFacturaDTO(factura))
                .toList();
        ListadoPaginador<FacturaDTO> facturaDTOListPag = new ListadoPaginador<>();
        facturaDTOListPag.setCantidadTotal(listadoPaginador.getCantidadTotal());
        facturaDTOListPag.setElementos(facturaDTOList);
        return ResponseEntity.ok(facturaDTOListPag);
    }

    @GetMapping("/findAllPaginationByService/{cantidad}/{pagina}/{state}/{idService}")
    public ResponseEntity<?> findAllPagination(@PathVariable("cantidad") Long cantidad
            , @PathVariable("pagina") int pagina
            , @PathVariable("state") String state
            , @PathVariable("state") Long idService
            , @RequestParam String username) {
        ListadoPaginador<Factura> listadoPaginador = facturaService.findAllWithPaginationByServicio(cantidad, pagina, state, username, idService);
        List<FacturaDTO> facturaDTOList = listadoPaginador.getElementos()
                .stream()
                .map(factura -> facturaToFacturaDTO(factura))
                .toList();
        ListadoPaginador<FacturaDTO> facturaDTOListPag = new ListadoPaginador<>();
        facturaDTOListPag.setCantidadTotal(listadoPaginador.getCantidadTotal());
        facturaDTOListPag.setElementos(facturaDTOList);
        return ResponseEntity.ok(facturaDTOListPag);
    }

    @GetMapping("/findAllConsultaFacturaWithPaginador/{cantidad}/{pagina}")
    public ResponseEntity<?> findAllConsultaFacturaWithPaginador(@PathVariable("cantidad") Long cantidad,
                                                                 @PathVariable("pagina") int pagina,
                                                                 @RequestParam(required = false) String startDate,
                                                                 @RequestParam(required = false) String endDate,
                                                                 @RequestParam(required = false) String idServicio,
                                                                 @RequestParam boolean state,
                                                                 @RequestParam String username) {
        ListadoPaginador<Factura> listadoPaginador =
                facturaService.findAllConsultaFacturaWithPaginador(cantidad,
                        pagina,
                        startDate,
                        endDate,
                        idServicio,
                        state,
                        username);

        return ResponseEntity.ok(listadoPaginador);
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        Optional<Factura> optionalFactura = facturaService.findFAndChildrenById(id);
        if (optionalFactura.isPresent()) {
            Factura factura = optionalFactura.get();
            return ResponseEntity.ok(facturaToFacturaDTO(factura));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findByServiceAndUsername/{idService}")
    public ResponseEntity<?> findByServiceAndUsername(@PathVariable Long idService, @RequestParam String username) {
        List<Factura> listFactura = facturaService.findAllAndChildrenNotPaidByUserAndService(username, idService);
        if (!listFactura.isEmpty()) {
            if (listFactura.size() == 1) {
                Factura factura = listFactura.get(0);
                return ResponseEntity.ok(facturaToFacturaDTO(factura));
            }
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findFAndChildrenPaidByUserAndService/{idService}")
    public ResponseEntity<?> findFAndChildrenPaidByUserAndService(@PathVariable Long idService, @RequestParam String username) {
        Optional<Factura> facturaOptional = facturaService.findFAndChildrenPaidByUserAndService(username, idService);
        if (facturaOptional.isPresent()){
            return ResponseEntity.ok(facturaToFacturaDTO(facturaOptional.get()));
        }
        return ResponseEntity.notFound().build();
    }


    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody FacturaDTO facturaDTO) throws URISyntaxException {
        Optional<Usuario> optionalUser =
                userService.findByUsername(facturaDTO.getUsuario().getUsername());

        if (optionalUser.isPresent()) {
            Usuario user = optionalUser.get();
            facturaDTO.setUsuario(user);
            Optional<Servicio> optServicio = sService.findIdAndChildren(facturaDTO.getServicio().getId());
            if (optServicio.isPresent()) {
                Servicio servicio = optServicio.get();
                facturaDTO.setSaldoRest(servicio.getValor());
                facturaDTO.setTotPag(0D);
                facturaService.saveOrUpdate(facturaDTOToFactura(facturaDTO));
                return ResponseEntity.ok(Response.builder()
                        .idMessage("201")
                        .message("Registro creado con éxito.")
                        .build());
            }
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody FacturaDTO facturaDTO) throws URISyntaxException {

        Optional<Factura> optionalFactura = facturaService.findFAndChildrenById(id);
        if (optionalFactura.isPresent()) {
            Factura factura = optionalFactura.get();
            factura.setFecha(factura.getFecha());
            factura.setServicio(factura.getServicio());
            factura.setSaldoRest(factura.getSaldoRest());
            factura.setTotPag(factura.getTotPag());
            factura.setEstado(factura.isEstado());
            facturaService.saveOrUpdate(factura);
            return ResponseEntity.ok(Response.builder()
                    .idMessage("201")
                    .message("Registro actualizado con éxito.")
                    .build());
        }


        return ResponseEntity.notFound().build();

    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id
    ) throws URISyntaxException {
        if (id != null) {
            facturaService.deleteById(id);
            return ResponseEntity.ok(Response.builder()
                    .idMessage("201")
                    .message("Registro borrado con éxito.")
                    .build());
        }
        return ResponseEntity.badRequest().build();
    }


    private FacturaDTO facturaToFacturaDTO(Factura factura) {
        return FacturaDTO.builder()
                .id(factura.getId())
                .fecha(factura.getFecha())
                .detallesFactura(factura.getDetallesFactura())
                .servicio(factura.getServicio())
                .saldoRest(factura.getSaldoRest())
                .totPag(factura.getTotPag())
                .estado(factura.isEstado())
                .fechaPagoTotVto(factura.getFechaPagoTotVto())
                .usuario(Usuario.builder()
                        .id(factura.getUsuario().getId())
                        .username(factura.getUsuario().getUsername())
                        .role(factura.getUsuario().getRole())
                        .build())
                .build();
    }

    private FacturaDTO1 facturaToFacturaDTO1(Factura factura) {
        return FacturaDTO1.builder()
                .id(factura.getId())
                .fecha(factura.getFecha())
                .servicio(factura.getServicio())
                .saldoRest(factura.getSaldoRest())
                .totPag(factura.getTotPag())
                .estado(factura.isEstado())
                .fechaPagoTotVto(factura.getFechaPagoTotVto())
                .usuario(Usuario.builder()
                        .id(factura.getUsuario().getId())
                        .username(factura.getUsuario().getUsername())
                        .role(factura.getUsuario().getRole())
                        .build())
                .build();

    }

    private Factura facturaDTOToFactura(FacturaDTO facturaDTO) {

        return Factura.builder()
                .id(facturaDTO.getId())
                .fecha(facturaDTO.getFecha())
                .detallesFactura(facturaDTO.getDetallesFactura())
                .servicio(facturaDTO.getServicio())
                .saldoRest(facturaDTO.getSaldoRest())
                .totPag(facturaDTO.getTotPag())
                .estado(facturaDTO.isEstado())
                .fechaPagoTotVto(facturaDTO.getFechaPagoTotVto())
                .usuario(Usuario.builder()
                        .id(facturaDTO.getUsuario().getId())
                        .username(facturaDTO.getUsuario().getUsername())
                        .role(facturaDTO.getUsuario().getRole())
                        .build())
                .build();
    }
}

