package SpringBootRestctrlPagos.controllers.prestamos;

import SpringBootRestctrlPagos.controllers.dto.ingresos.IngresoDTO;
import SpringBootRestctrlPagos.controllers.dto.ingresos.IngresoDTOC1;
import SpringBootRestctrlPagos.controllers.dto.prestamos.DetallePrestamoDTO;
import SpringBootRestctrlPagos.controllers.dto.prestamos.PrestamoDTO;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Cuenta;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Sobre;
import SpringBootRestctrlPagos.models.entities.ingresos.Ingreso;
import SpringBootRestctrlPagos.models.entities.prestamos.DetallePrestamo;
import SpringBootRestctrlPagos.models.entities.prestamos.Prestamo;
import SpringBootRestctrlPagos.services.IUserService;
import SpringBootRestctrlPagos.services.ingresos.IIngresoService;
import SpringBootRestctrlPagos.services.prestamos.IPrestamoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tools/ctrlPagos/prestamos/prestamos")
@CrossOrigin(origins = {"http://localhost:4200"})
public class PrestamoController {
    @Autowired
    private IPrestamoService prestamoService;
    @Autowired
    private IUserService userService;

    @GetMapping("/find/{id}")
    public ResponseEntity<?> findPAndChildrenById(@PathVariable Long id) {
        Optional<Prestamo> optionalPrestamo = prestamoService.findPAndChildrenById(id);
        if (optionalPrestamo.isPresent()) {
            Prestamo prestamo = optionalPrestamo.get();
            return ResponseEntity.ok(prestamoToPrestamoDTO(prestamo));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAllPaginadoByUsername/{cantidad}/{pagina}/{state}")
    public ResponseEntity<?> findAllPagination(@PathVariable("cantidad") Long cantidad,
                                               @PathVariable("pagina") int pagina,
                                               @PathVariable("state") String state,
                                               @RequestParam String filter,
                                               @RequestParam String username) {
        ListadoPaginador<Prestamo> listadoPaginador =
                prestamoService.findAllWithPaginationByUsername(cantidad, pagina, filter, username, state);

        return ResponseEntity.ok(listadoPaginador);
    }


    @GetMapping("/findAllPaidAndChildrenByUser")
    public ResponseEntity<?> findAllPaidAndChildrenByUser(@RequestParam String username) {
        List<PrestamoDTO> prestamoDTOList = prestamoService.findAllPaidAndChildrenByUser(username)
                .stream()
                .map(prestamo -> prestamoToPrestamoDTO(prestamo))
                .toList();
        return ResponseEntity.ok(prestamoDTOList);
    }

    @GetMapping("/findAllNotPaidAndChildrenByUser")
    public ResponseEntity<?> findAllNotPaidAndChildrenByUser(@RequestParam String username) {
        List<PrestamoDTO> prestamoDTOList = prestamoService.findAllNotPaidAndChildrenByUser(username)
                .stream()
                .map(prestamo -> prestamoToPrestamoDTO(prestamo))
                .toList();
        return ResponseEntity.ok(prestamoDTOList);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody PrestamoDTO prestamoDTO) throws URISyntaxException {
        System.out.println("entra al prestamo");
        Prestamo prestamo = prestamoDTOToPrestamo(prestamoDTO);
        Optional<Usuario> optionalUser = userService.findByUsername(prestamo.getUsuario().getUsername());
        if (optionalUser.isPresent()) {
            Usuario user = optionalUser.get();
            prestamo.setUsuario(user);
            prestamoService.saveOrUpdate(prestamo);

            return ResponseEntity.ok(Response.builder()
                    .idMessage("201")
                    .message("Registro creado con éxito").build());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody PrestamoDTO prestamoDTO) throws URISyntaxException {
        System.out.println("entra en update id " + id);
        Optional<Prestamo> optionalPrestamo = prestamoService.findPAndChildrenById(id);
        if (optionalPrestamo.isPresent()) {
            System.out.println("encuentra");
            Prestamo oldPrestamo = optionalPrestamo.get();
            Optional<Usuario> optionalUser = userService.findByUsername(prestamoDTO.getUsuario().getUsername());
            if (optionalUser.isPresent()) {
                try {
                    Usuario user = optionalUser.get();
                    oldPrestamo.setUsuario(user);
                    oldPrestamo.setFechaCreacion(prestamoDTO.getFechaCreacion());
                    oldPrestamo.setMonto(prestamoDTO.getMonto());
                    oldPrestamo.setInteres(prestamoDTO.getInteres());
                    oldPrestamo.setCuotas(prestamoDTO.getCuotas());
                    oldPrestamo.setCuentaOrigen(prestamoDTO.getCuentaOrigen());
                    oldPrestamo.setCuentaBeneficiario(prestamoDTO.getCuentaBeneficiario());
                    oldPrestamo.setSaldoRest(prestamoDTO.getSaldoRest());
                    oldPrestamo.setTotAPagar(prestamoDTO.getTotAPagar());
                    oldPrestamo.setTotPag(prestamoDTO.getTotPag());
                    oldPrestamo.setEstado(prestamoDTO.isEstado());
                    prestamoService.saveOrUpdate(oldPrestamo);
                    System.out.println("despues del update");
                    return ResponseEntity.ok(Response.builder()
                            .idMessage("202")
                            .message("Registro modificado con éxito").build());

                } catch (Exception e) {
                    System.out.println(e);
                    throw new RuntimeException(e);
                }
            }


        }
        System.out.println("da error");
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/procesarPrestamo/{idPrestamo}")
    public ResponseEntity<?> efectuarPago(@PathVariable Long idPrestamo,
                                          @RequestBody PrestamoDTO prestamoDTO) throws URISyntaxException {
        System.out.println("entra al procesar");
        try {
            Optional<Prestamo> optP = prestamoService.findPAndChildrenById(idPrestamo);
            if (optP.isPresent()) {
                Prestamo oldP = optP.get();

                oldP.setProcesarPrestamo(true);
                prestamoService.saveOrUpdate(oldP);

                return ResponseEntity.ok(Response.builder()
                        .idMessage("202")
                        .message("Registro modificado con éxito").build());
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e);

        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (id != null) {
            prestamoService.deleteById(id);
            return ResponseEntity.ok(Response.builder()
                    .idMessage("203")
                    .message("Registro eliminado con éxito").build());
        }
        return ResponseEntity.badRequest().build();
    }


    private PrestamoDTO prestamoToPrestamoDTO(Prestamo prestamo) {
        return PrestamoDTO.builder()
                .id(prestamo.getId())
                .detallePrestamo(prestamo.getDetallePrestamo())
                .titulo(prestamo.getTitulo())
                .fechaCreacion(prestamo.getFechaCreacion())
                .monto(prestamo.getMonto())
                .interes(prestamo.getInteres())
                .cuotas(prestamo.getCuotas())
                .totAPagar(prestamo.getTotAPagar())
                .cuentaOrigen(prestamo.getCuentaOrigen())
                .cuentaBeneficiario(prestamo.getCuentaBeneficiario())
                .saldoRest(prestamo.getSaldoRest())
                .totPag(prestamo.getTotPag())
                .estado(prestamo.isEstado())
                .procesarPrestamo(prestamo.isProcesarPrestamo())
                .fechaTotPagado(prestamo.getFechaTotPagado())
                .usuario(Usuario.builder()
                        .id(prestamo.getUsuario().getId())
                        .username(prestamo.getUsuario().getUsername())
                        .role(prestamo.getUsuario().getRole())
                        .password("")
                        .build())
                .build();
    }

    private Prestamo prestamoDTOToPrestamo(PrestamoDTO prestamoDTO) {
        return Prestamo.builder()
                .id(prestamoDTO.getId())
                .detallePrestamo(prestamoDTO.getDetallePrestamo())
                .titulo(prestamoDTO.getTitulo())
                .fechaCreacion(prestamoDTO.getFechaCreacion())
                .monto(prestamoDTO.getMonto())
                .interes(prestamoDTO.getInteres())
                .cuotas(prestamoDTO.getCuotas())
                .totAPagar(prestamoDTO.getTotAPagar())
                .cuentaOrigen(prestamoDTO.getCuentaOrigen())
                .cuentaBeneficiario(prestamoDTO.getCuentaBeneficiario())
                .totPag(prestamoDTO.getTotPag())
                .saldoRest(prestamoDTO.getSaldoRest())
                .estado(prestamoDTO.isEstado())
                .procesarPrestamo(prestamoDTO.isProcesarPrestamo())
                .fechaTotPagado(prestamoDTO.getFechaTotPagado())
                .usuario(Usuario.builder()
                        .id(prestamoDTO.getUsuario().getId())
                        .username(prestamoDTO.getUsuario().getUsername())
                        .role(prestamoDTO.getUsuario().getRole())
                        .password("")
                        .build())
                .build();
    }
}
