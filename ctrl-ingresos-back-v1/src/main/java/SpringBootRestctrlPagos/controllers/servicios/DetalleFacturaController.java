package SpringBootRestctrlPagos.controllers.servicios;

import SpringBootRestctrlPagos.controllers.dto.ingresos.DetalleIngresoDTO;
import SpringBootRestctrlPagos.controllers.dto.servicios.DetalleFacturaDTO;
import SpringBootRestctrlPagos.controllers.dto.servicios.DetalleFacturaDTO1;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.entities.ingresos.DetalleIngreso;
import SpringBootRestctrlPagos.models.entities.ingresos.PorcentajeXConcepto;
import SpringBootRestctrlPagos.models.entities.servicios.DetalleFactura;
import SpringBootRestctrlPagos.models.entities.servicios.DetalleFacturaId;
import SpringBootRestctrlPagos.models.entities.servicios.Factura;
import SpringBootRestctrlPagos.services.ingresos.IDetalleIngresoService;
import SpringBootRestctrlPagos.services.servicios.IDetalleFacturaService;
import SpringBootRestctrlPagos.services.servicios.IFacturaService;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tools/ctrlPagos/servicios/factura/detalles")
public class DetalleFacturaController {
    @Autowired
    private IDetalleFacturaService dFacturaService;
    @Autowired
    private IFacturaService facturaService;

    @GetMapping("/findDFByIdAndIdFactura/{id}/{idFactura}")
    public ResponseEntity<?> findDFByIdAndIdFactura(@PathVariable Long id, @PathVariable Long idFactura) {
        Optional<DetalleFactura> optionalDFactura = dFacturaService.findDFByIdAndIdFactura(id, idFactura);
        if (optionalDFactura.isPresent()) {
            DetalleFactura dFactura = optionalDFactura.get();
            return ResponseEntity.ok(detalleFacturaToFacturaDTO(dFactura));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAllByIdFactura/{idFactura}")
    public ResponseEntity<?> findAllByIdFactura(@PathVariable Long idFactura) {
        List<DetalleFacturaDTO> dFacturaList = dFacturaService.findAllByIdFactura(idFactura)
                .stream()
                .map(dFactura -> detalleFacturaToFacturaDTO(dFactura))
                .toList();
        return ResponseEntity.ok(dFacturaList);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody DetalleFacturaDTO dFacturaDTO) throws URISyntaxException {
        DetalleFactura dFactura = detalleFacturaDTOToDFactura(dFacturaDTO);
        Long idFactura = dFactura.getDetalleFacturaId().getIdFactura();
        System.out.println("idFactura = " + idFactura);
        Optional<Factura> optFactura = facturaService.findFById(idFactura);
        Factura factura = optFactura.get();
        Long nextIdDetalle = dFacturaService.findNextIdByIdFactura(factura.getId());
        Double saldoRest = factura.getSaldoRest();
        Double totPag = factura.getTotPag();
        Double pago = dFactura.getPago();
        Double nTotPag = totPag + pago;
        Double nSaldoRest = saldoRest - pago;
        dFactura.setDetalleFacturaId
                (DetalleFacturaId.builder()
                        .idFactura(idFactura)
                        .id(nextIdDetalle).build());
        dFacturaService.saveOrUpdate(dFactura);
        factura.setSaldoRest(nSaldoRest);
        factura.setTotPag(nTotPag);
        if (factura.getSaldoRest() == 0) {
            factura.setEstado(true);
            factura.setFechaPagoTotVto(factura.getServicio().getFechaIniVto());
        }
        facturaService.saveOrUpdate(factura);
        return ResponseEntity.ok(Response.builder()
                .idMessage("201")
                .message("Registro creado con éxito").build());
    }

    @PutMapping("/update/{id}/{idFactura}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @PathVariable Long idFactura,
                                    @RequestBody DetalleFacturaDTO dFacturaDTO) throws URISyntaxException {

        Optional<DetalleFactura> optDF = dFacturaService.findDFByIdAndIdFactura(id, idFactura);
        if (optDF.isPresent()) {
            DetalleFactura oldDF = optDF.get();

            Factura factura = facturaService.findFById(idFactura).get();
            Double saldoRest = factura.getSaldoRest();
            Double totPag = factura.getTotPag();
            Double oldPago = oldDF.getPago();
            Double newPago = dFacturaDTO.getPago();
            Double difPagos = oldPago - newPago;
            Double nTotPag = 0D;
            Double nSaldoRest = 0D;
            if(difPagos<0){
                System.out.println("es negativo, en factura = " + difPagos);
                //es negativo, en factura:
                //saldoRest se resta
                //totPag se suma
                //difPagos se pasa a positivo
                Double nDifPagos = difPagos*-1;
                nSaldoRest = saldoRest -nDifPagos;
                nTotPag = totPag + nDifPagos;
            }else if(difPagos>0){
                System.out.println("es positivo, en factura: = " + difPagos);
                //es positivo, en factura:
                //saldoRest se suma
                //totPag se resta
                nSaldoRest = saldoRest + difPagos;
                nTotPag = totPag - difPagos;
            }

            factura.setSaldoRest(nSaldoRest);
            factura.setTotPag(nTotPag);


            oldDF.setFechaPago(dFacturaDTO.getFechaPago());
            oldDF.setPago(dFacturaDTO.getPago());
            dFacturaService.saveOrUpdate(oldDF);
            facturaService.saveOrUpdate(factura);
            return ResponseEntity.ok(Response.builder()
                    .idMessage("202")
                    .message("Registro modificado con éxito").build());
        }
        return ResponseEntity.notFound().build();
    }


    @DeleteMapping("/delete/{id}/{idFactura}")
    public ResponseEntity<?> delete(@PathVariable Long id,@PathVariable Long idFactura) {
        Optional<DetalleFactura> optDF = dFacturaService.findDFByIdAndIdFactura(id, idFactura);
        if(optDF.isPresent()){
            DetalleFactura dF = optDF.get();
            Factura factura = facturaService.findFById(dF.getDetalleFacturaId().getIdFactura()).get();
            Double saldoRest = factura.getSaldoRest();
            Double totPag = factura.getTotPag();
            Double pago = dF.getPago();
            Double nTotPag = totPag - pago;
            Double nSaldoRest = saldoRest + pago;
            factura.setSaldoRest(nSaldoRest);
            factura.setTotPag(nTotPag);

            facturaService.saveOrUpdate(factura);
            dFacturaService.deleteById(DetalleFacturaId.builder().id(id).idFactura(idFactura).build());
            return ResponseEntity.ok(Response.builder()
                    .idMessage("203")
                    .message("Registro eliminado con éxito").build());
        }
        return ResponseEntity.notFound().build();
    }

    private DetalleFacturaDTO detalleFacturaToFacturaDTO(DetalleFactura dFactura) {
        return DetalleFacturaDTO.builder()
                .detalleFacturaId(dFactura.getDetalleFacturaId())
                .fechaPago(dFactura.getFechaPago())
                .pago(dFactura.getPago())
                .factura(dFactura.getFactura())
                .build();
    }

    private DetalleFacturaDTO1 detalleFacturaToFacturaDTO1(DetalleFactura dFactura) {
        return DetalleFacturaDTO1.builder()
                .detalleFacturaId(dFactura.getDetalleFacturaId())
                .fechaPago(dFactura.getFechaPago())
                .pago(dFactura.getPago())
                .factura(dFactura.getFactura())
                .build();
    }

    private DetalleFactura detalleFacturaDTOToDFactura(DetalleFacturaDTO dFacturaDTO) {
        return DetalleFactura.builder()
                .detalleFacturaId(dFacturaDTO.getDetalleFacturaId())
                .fechaPago(dFacturaDTO.getFechaPago())
                .pago(dFacturaDTO.getPago())
                .factura(dFacturaDTO.getFactura())
                .build();
    }
}
