package SpringBootRestctrlPagos.controllers.prestamos;

import SpringBootRestctrlPagos.controllers.dto.prestamos.DetallePrestamoDTO;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.entities.prestamos.DetallePrestamo;
import SpringBootRestctrlPagos.models.entities.prestamos.DetallePrestamoId;
import SpringBootRestctrlPagos.models.entities.prestamos.Prestamo;
import SpringBootRestctrlPagos.models.entities.servicios.DetalleFactura;
import SpringBootRestctrlPagos.models.entities.servicios.DetalleFacturaId;
import SpringBootRestctrlPagos.models.entities.servicios.Factura;
import SpringBootRestctrlPagos.services.IUserService;
import SpringBootRestctrlPagos.services.prestamos.IDetallePrestamoService;
import SpringBootRestctrlPagos.services.prestamos.IPrestamoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tools/ctrlPagos/prestamos/prestamos/detalles")
@CrossOrigin(origins = {"http://localhost:4200"})
public class DetallePrestamoController {
    @Autowired
    private IDetallePrestamoService dPrestamoService;
    @Autowired
    private IPrestamoService prestamoService;
    @Autowired
    private IUserService userService;

    @GetMapping("/findDPByIdAndIdPrestamo/{id}/{idPrestamo}")
    public ResponseEntity<?> findDIAndChildrenByIdAndIdPrestamo(@PathVariable Long id, @PathVariable Long idPrestamo) {
        Optional<DetallePrestamo> optionalDPrestamo = dPrestamoService.findDIByIdAndIdPrestamo(id, idPrestamo);
        if (optionalDPrestamo.isPresent()) {
            DetallePrestamo dPrestamo = optionalDPrestamo.get();
            return ResponseEntity.ok(detallePrestamoToPrestamoDTO(dPrestamo));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAllByIdPrestamo/{IdPrestamo}")
    public ResponseEntity<?> findAllByIdPrestamo(@PathVariable Long idPrestamo) {
        List<DetallePrestamoDTO> dPrestamoList = dPrestamoService.findAllByIdPrestamo(idPrestamo)
                .stream()
                .map(dPrestamo -> detallePrestamoToPrestamoDTO(dPrestamo))
                .toList();
        return ResponseEntity.ok(dPrestamoList);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody DetallePrestamoDTO dPrestamoDTO) throws URISyntaxException {
        DetallePrestamo dPrestamo = detallePrestamoDTOToDPrestamo(dPrestamoDTO);
        Long idPrestamo = dPrestamo.getDetallePrestamoId().getIdPrestamo();
        Prestamo prestamo = prestamoService.findPAndChildrenById(idPrestamo).get();
        Long nextIdDetalle = dPrestamoService.findNextIdByIdPrestamo(idPrestamo);
        Double saldoRest = prestamo.getSaldoRest();
        Double totPag = prestamo.getTotPag();
        Double pago = dPrestamo.getMontoPago();
        Double nTotPag = totPag + pago;
        Double nSaldoRest = saldoRest - pago;
        dPrestamo.setDetallePrestamoId
                (DetallePrestamoId.builder()
                        .idPrestamo(idPrestamo)
                        .id(nextIdDetalle).build());
        dPrestamoService.saveOrUpdate(dPrestamo);
        prestamo.setSaldoRest(nSaldoRest);
        prestamo.setTotPag(nTotPag);
        if (prestamo.getSaldoRest() == 0) {
            prestamo.setEstado(true);
            prestamo.setFechaTotPagado(new Date());
        }
        prestamoService.saveOrUpdate(prestamo);

        return ResponseEntity.ok(Response.builder()
                .idMessage("201")
                .message("Registro creado con éxito").build());

    }

    @PutMapping("/update/{id}/{idPrestamo}")
    public ResponseEntity<?> updateMontos(@PathVariable Long id,
                                          @PathVariable Long idPrestamo,
                                          @RequestBody DetallePrestamoDTO dPrestamoDTO) throws URISyntaxException {
        try {
            Optional<DetallePrestamo> optDP = dPrestamoService.findDIByIdAndIdPrestamo(id, idPrestamo);
            if (optDP.isPresent()) {
                DetallePrestamo oldDP = optDP.get();

                Prestamo prestamo = prestamoService.findPAndChildrenById(idPrestamo).get();
                Double saldoRest = prestamo.getSaldoRest();
                Double totPag = prestamo.getTotPag();
                Double oldPago = oldDP.getMontoPago();
                Double newPago = dPrestamoDTO.getMontoPago();
                Double difPagos = oldPago - newPago;
                Double nTotPag = 0D;
                Double nSaldoRest = 0D;
                if (difPagos < 0) {
                    //es negativo, en prestamo:
                    //saldoRest se resta
                    //totPag se suma
                    //difPagos se pasa a positivo
                    Double nDifPagos = difPagos * -1;
                    nSaldoRest = saldoRest - nDifPagos;
                    nTotPag = totPag + nDifPagos;
                } else if (difPagos > 0) {
                    //es positivo, en prestamo:
                    //saldoRest se suma
                    //totPag se resta
                    nSaldoRest = saldoRest + difPagos;
                    nTotPag = totPag - difPagos;
                }

                prestamo.setSaldoRest(nSaldoRest);
                prestamo.setTotPag(nTotPag);


                oldDP.setFechaPago(dPrestamoDTO.getFechaPago());
                oldDP.setMontoPago(dPrestamoDTO.getMontoPago());
                dPrestamoService.saveOrUpdate(oldDP);
                prestamoService.saveOrUpdate(prestamo);

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


    @PutMapping("/efectuarPago/{id}/{idPrestamo}")
    public ResponseEntity<?> efectuarPago(@PathVariable Long id,
                                          @PathVariable Long idPrestamo,
                                          @RequestBody DetallePrestamoDTO dPrestamoDTO) throws URISyntaxException {
        try {
            Optional<DetallePrestamo> optDP = dPrestamoService.findDIByIdAndIdPrestamo(id, idPrestamo);
            if (optDP.isPresent()) {
                DetallePrestamo oldDP = optDP.get();

                oldDP.setPagoEfectuado(true);
                dPrestamoService.saveOrUpdate(oldDP);

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



    @DeleteMapping("/delete/{id}/{idPrestamo}")
    public ResponseEntity<?> delete(@PathVariable Long id, @PathVariable Long idPrestamo) {
        Optional<DetallePrestamo> optDP = dPrestamoService.findDIByIdAndIdPrestamo(id, idPrestamo);
        if (optDP.isPresent()) {
            DetallePrestamo dP = optDP.get();
            Prestamo prestamo = prestamoService.findPById(dP.getDetallePrestamoId().getIdPrestamo()).get();
            Double saldoRest = prestamo.getSaldoRest();
            Double totPag = prestamo.getTotPag();
            Double pago = dP.getMontoPago();
            Double nTotPag = totPag - pago;
            Double nSaldoRest = saldoRest + pago;
            prestamo.setSaldoRest(nSaldoRest);
            prestamo.setTotPag(nTotPag);

            prestamoService.saveOrUpdate(prestamo);
            System.out.println("id: " + id);
            System.out.println("idPrestamo: " + idPrestamo);
            DetallePrestamoId idDetalle = new DetallePrestamoId(id,idPrestamo);
            dPrestamoService.deleteById(idDetalle);

            return ResponseEntity.ok(Response.builder()
                    .idMessage("203")
                    .message("Registro eliminado con éxito").build());

        }
        return ResponseEntity.notFound().build();
    }

    private DetallePrestamoDTO detallePrestamoToPrestamoDTO(DetallePrestamo dPrestamo) {
        return DetallePrestamoDTO.builder()
                .detallePrestamoId(dPrestamo.getDetallePrestamoId())
                .fechaPago(dPrestamo.getFechaPago())
                .montoPago(dPrestamo.getMontoPago())
                .pagoEfectuado(dPrestamo.isPagoEfectuado())
                .prestamo(dPrestamo.getPrestamo())
                .build();
    }

    private DetallePrestamo detallePrestamoDTOToDPrestamo(DetallePrestamoDTO dPrestamoDTO) {
        return DetallePrestamo.builder()
                .detallePrestamoId(dPrestamoDTO.getDetallePrestamoId())
                .fechaPago(dPrestamoDTO.getFechaPago())
                .montoPago(dPrestamoDTO.getMontoPago())
                .pagoEfectuado(dPrestamoDTO.isPagoEfectuado())
                .prestamo(dPrestamoDTO.getPrestamo())
                .build();

    }
}
