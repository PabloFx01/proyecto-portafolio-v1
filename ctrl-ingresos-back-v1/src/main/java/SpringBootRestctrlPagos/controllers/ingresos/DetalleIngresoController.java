package SpringBootRestctrlPagos.controllers.ingresos;

import SpringBootRestctrlPagos.controllers.dto.ingresos.DetalleIngresoDTO;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.ingresos.DetalleIngreso;
import SpringBootRestctrlPagos.models.entities.ingresos.PorcentajeXConcepto;
import SpringBootRestctrlPagos.services.IUserService;
import SpringBootRestctrlPagos.services.ingresos.IDetalleIngresoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tools/ctrlPagos/ingreso/ingresos/detalles")
@CrossOrigin(origins = {"http://localhost:4200"})
public class DetalleIngresoController {
    @Autowired
    private IDetalleIngresoService dIngresoService;
    @Autowired
    private IUserService userService;

    @GetMapping("/findDIAndChildrenByIdAndIdIngreso/{id}/{idIngreso}")
    public ResponseEntity<?> findDIAndChildrenByIdAndIdIngreso(@PathVariable Long id, @PathVariable Long idIngreso) {
        Optional<DetalleIngreso> optionalDIngreso = dIngresoService.findDIAndChildrenByIdAndIdIngreso(id, idIngreso);
        if (optionalDIngreso.isPresent()) {
            DetalleIngreso dIngreso = optionalDIngreso.get();
            return ResponseEntity.ok(detalleIngresoToIngresoDTO(dIngreso));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findDIAndChildrenByCptoAndIdIngreso/{cpto}/{idIngreso}")
    public ResponseEntity<?> findDIAndChildrenByCptoAndIdIngreso(@PathVariable String cpto, @PathVariable Long idIngreso) {
        Optional<DetalleIngreso> optionalDIngreso = dIngresoService.findDIAndChildrenByConceptoAndIdIngreso(cpto, idIngreso);
        if (optionalDIngreso.isPresent()) {
            DetalleIngreso dIngreso = optionalDIngreso.get();
            return ResponseEntity.ok(detalleIngresoToIngresoDTO(dIngreso));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAllAndChildrenByIdIngreso/{idIngreso}")
    public ResponseEntity<?> findAllAndChildrenByIdIngreso(@PathVariable Long idIngreso) {
        List<DetalleIngresoDTO> dIngresoList = dIngresoService.findAllAndChildrenByIdIngreso(idIngreso)
                .stream()
                .map(dIngreso -> detalleIngresoToIngresoDTO(dIngreso))
                .toList();
        return ResponseEntity.ok(dIngresoList);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody DetalleIngresoDTO dIngresoDTO) throws URISyntaxException {
        DetalleIngreso dIngreso = detalleIngresoDTOToDIngreso(dIngresoDTO);
        dIngresoService.saveOrUpdate(dIngreso);
        return ResponseEntity.ok(Response.builder()
                .idMessage("201")
                .message("Registro creado con éxito").build());
    }

    @PutMapping("/updateMontos/{id}/{idIngreso}")
    public ResponseEntity<?> updateMontos(@PathVariable Long id,
                                    @PathVariable Long idIngreso,
                                    @RequestBody DetalleIngresoDTO dIngresoDTO) throws URISyntaxException {
        try {

            Optional<Usuario> optionalUser = userService.findByUsername(dIngresoDTO.getUsuario().getUsername());
            if (optionalUser.isPresent()) {
                Optional<DetalleIngreso> optDI = dIngresoService.findDIAndChildrenByIdAndIdIngreso(id, idIngreso);
                if (optDI.isPresent()) {
                    DetalleIngreso oldDI = optDI.get();
                    PorcentajeXConcepto nPctXCpto = oldDI.getPctXCpto();
                    Double nMontoEfect, nMontoDig, oldMontoRest,oldMontoEfec,oldMontoDig, nMontoReasignado, nMontoRest;
                    nMontoEfect = dIngresoDTO.getPctXCpto().getMontoAsigRealEfec();
                    nMontoDig = dIngresoDTO.getPctXCpto().getMontoAsigRealDig();
                    oldMontoRest = oldDI.getPctXCpto().getMontoAsigRest();
                    oldMontoDig = oldDI.getPctXCpto().getMontoAsigRealDig();
                    oldMontoEfec = oldDI.getPctXCpto().getMontoAsigRealEfec();
                    //nMontoReasignado = (nMontoDig + nMontoEfect);
                    nMontoRest = (oldMontoDig+oldMontoEfec+oldMontoRest) - (nMontoEfect + nMontoDig);

                    nPctXCpto.setMontoAsigRest(nMontoRest);
                    nPctXCpto.setMontoAsigRealDig(nMontoDig);
                    nPctXCpto.setMontoAsigRealEfec(nMontoEfect);
                    oldDI.setPctXCpto(nPctXCpto);
                    oldDI.setUsuario(optionalUser.get());
                    oldDI.setMontoPorcentajeRest(nMontoRest);
                    dIngresoService.saveOrUpdate(oldDI);
                    return ResponseEntity.ok(Response.builder()
                            .idMessage("202")
                            .message("Registro modificado con éxito").build());
                }
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e);

        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/updateMontoRest/{id}/{idIngreso}")
    public ResponseEntity<?> updateMontoRest(@PathVariable Long id,
                                    @PathVariable Long idIngreso,
                                    @RequestBody DetalleIngresoDTO dIngresoDTO) throws URISyntaxException {
        try {

            Optional<Usuario> optionalUser = userService.findByUsername(dIngresoDTO.getUsuario().getUsername());
            if (optionalUser.isPresent()) {
                Optional<DetalleIngreso> optDI = dIngresoService.findDIAndChildrenByIdAndIdIngreso(id, idIngreso);
                if (optDI.isPresent()) {
                    DetalleIngreso oldDI = optDI.get();
                    PorcentajeXConcepto nPctXCpto = oldDI.getPctXCpto();

                    //nPctXCpto.setMontoAsigRest(dIngresoDTO.getPctXCpto().getMontoAsigRest());
                    nPctXCpto.setMontoAsigRest(dIngresoDTO.getPctXCpto().getMontoAsigRest());
                    oldDI.setPctXCpto(nPctXCpto);
                    oldDI.setUsuario(optionalUser.get());
                    dIngresoService.saveOrUpdate(oldDI);
                    return ResponseEntity.ok(Response.builder()
                            .idMessage("202")
                            .message("Registro modificado con éxito").build());
                }
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e);

        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/updateTransferir/{id}/{idIngreso}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @PathVariable Long idIngreso,
                                    @RequestBody DetalleIngresoDTO dIngresoDTO) throws URISyntaxException {
        try {

            Optional<Usuario> optionalUser = userService.findByUsername(dIngresoDTO.getUsuario().getUsername());
            if (optionalUser.isPresent()) {
                Optional<DetalleIngreso> optDI = dIngresoService.findDIAndChildrenByIdAndIdIngreso(id, idIngreso);
                if (optDI.isPresent()) {
                    DetalleIngreso oldDI = optDI.get();
                    PorcentajeXConcepto nPctXCpto = oldDI.getPctXCpto();

                    nPctXCpto.setMontoAsigRealDig(dIngresoDTO.getPctXCpto().getMontoAsigRealDig());
                    nPctXCpto.setMontoAsigRealEfec(dIngresoDTO.getPctXCpto().getMontoAsigRealEfec());
                    oldDI.setPctXCpto(nPctXCpto);
                    oldDI.setUsuario(optionalUser.get());
                    dIngresoService.saveOrUpdate(oldDI);
                    return ResponseEntity.ok(Response.builder()
                            .idMessage("202")
                            .message("Registro modificado con éxito").build());
                }
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e);

        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/updateDIngresoAndTotRest/{id}/{idIngreso}")
    public ResponseEntity<?> updateDIngresoAndTotRest(@PathVariable Long id,
                                                      @PathVariable Long idIngreso,
                                                      @RequestBody DetalleIngresoDTO dIngresoDTO) throws URISyntaxException {
        Optional<Usuario> optionalUser = userService.findByUsername(dIngresoDTO.getUsuario().getUsername());
        if (optionalUser.isPresent()) {
            Optional<DetalleIngreso> optDI = dIngresoService.findDIAndChildrenByIdAndIdIngreso(id, idIngreso);
            if (optDI.isPresent()) {
                DetalleIngreso oldDI = optDI.get();
                PorcentajeXConcepto nPctXCpto = oldDI.getPctXCpto();
                nPctXCpto.setMontoAsigRest(dIngresoDTO.getPctXCpto().getMontoAsigRest());
                nPctXCpto.setMontoAsigRealDig(dIngresoDTO.getPctXCpto().getMontoAsigRealDig());
                nPctXCpto.setMontoAsigRealEfec(dIngresoDTO.getPctXCpto().getMontoAsigRealEfec());
                oldDI.setPctXCpto(nPctXCpto);
                oldDI.setUsuario(optionalUser.get());
                dIngresoService.saveOrUpdate(oldDI);
                List<DetalleIngreso> detList = dIngresoService.findAllAndChildrenByIdIngreso(idIngreso);
                detList.forEach(detalleIngreso -> {
                    PorcentajeXConcepto pctXCpto = detalleIngreso.getPctXCpto();
                    pctXCpto.setMontoAsigRest(0D);
                    detalleIngreso.setPctXCpto(pctXCpto);
                    dIngresoService.saveOrUpdate(detalleIngreso);
                });
                return ResponseEntity.ok(Response.builder()
                        .idMessage("202")
                        .message("Registro modificado con éxito").build());
            }
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return ResponseEntity.badRequest().build();
    }

    private DetalleIngresoDTO detalleIngresoToIngresoDTO(DetalleIngreso dIngreso) {
        return DetalleIngresoDTO.builder()
                .detalleIngresoId(dIngreso.getDetalleIngresoId())
                .concepto(dIngreso.getConcepto())
                .montoPorcentaje(dIngreso.getMontoPorcentaje())
                .montoPorcentajeRest(dIngreso.getMontoPorcentajeRest())
                .pctXCpto(dIngreso.getPctXCpto())
                .idPctXCpto(dIngreso.getIdPctXCpto())
                .usuario(dIngreso.getUsuario())
                .ingreso(dIngreso.getIngreso())
                .build();
    }

    private DetalleIngreso detalleIngresoDTOToDIngreso(DetalleIngresoDTO dIngresoDTO) {
        return DetalleIngreso.builder()
                .detalleIngresoId(dIngresoDTO.getDetalleIngresoId())
                .concepto(dIngresoDTO.getConcepto())
                .montoPorcentaje(dIngresoDTO.getMontoPorcentaje())
                .montoPorcentajeRest(dIngresoDTO.getMontoPorcentajeRest())
                .pctXCpto(dIngresoDTO.getPctXCpto())
                .idPctXCpto(dIngresoDTO.getIdPctXCpto())
                .usuario(dIngresoDTO.getUsuario())
                .ingreso(dIngresoDTO.getIngreso())
                .build();
    }
}
