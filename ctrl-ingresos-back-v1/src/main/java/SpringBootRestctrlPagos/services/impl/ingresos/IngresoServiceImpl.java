package SpringBootRestctrlPagos.services.impl.ingresos;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.ingresos.TipoMoneda;
import SpringBootRestctrlPagos.models.entities.ingresos.*;
import SpringBootRestctrlPagos.models.entities.servicios.Factura;
import SpringBootRestctrlPagos.persistences.ingresos.IConceptoDAO;
import SpringBootRestctrlPagos.persistences.ingresos.IDetalleIngresoDAO;
import SpringBootRestctrlPagos.persistences.ingresos.IIngresoDAO;
import SpringBootRestctrlPagos.persistences.ingresos.IPorcentajeXConceptoDAO;
import SpringBootRestctrlPagos.services.ingresos.IIngresoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
public class IngresoServiceImpl implements IIngresoService {
    @Autowired
    private IIngresoDAO ingresoDAO;
    @Autowired
    private IConceptoDAO conceptoDAO;
    @Autowired
    private IDetalleIngresoDAO detalleIngresoDAO;
    @Autowired
    private IPorcentajeXConceptoDAO porcentajeXConceptoDAO;

    @Override
    public List<Ingreso> findAllByUser(String username) {
        return ingresoDAO.findAllByUser(username);
    }

    @Override
    public List<Ingreso> findAllAndChildrenByUser(String username) {
        return ingresoDAO.findAllAndChildrenByUser(username);
    }

    @Override
    public ListadoPaginador<Ingreso> findAllConsultaIngresoWithPaginador(Long cantidad, int pagina, String startDate, String endDate, String titulo, String username) {
        ListadoPaginador<Ingreso> resultado = new ListadoPaginador<>();
        List<Ingreso>ingresoList = this.findAllAndChildrenByUser(username);
        List<Ingreso>ingresoListResult;

        LocalDate nStartFilter;
        LocalDate nEndFilter;

        if (startDate != null) {
            if (!startDate.equals("not")) {
                nStartFilter = LocalDate.parse(startDate);
            } else {
                nStartFilter = null;
            }
        } else {
            nStartFilter = null;
        }

        if (endDate != null) {
            if (!endDate.equals("not")) {
                nEndFilter = LocalDate.parse(endDate);
            }else {
                nEndFilter = null;
            }
        }else {
            nEndFilter = null;
        }

        LocalDate finalNStartFilter = nStartFilter;
        LocalDate finalNEndFilter = nEndFilter;
        ingresoListResult = ingresoList.stream()
                .filter(ingreso -> (finalNStartFilter != null && finalNEndFilter != null) ?
                        dateToLD(ingreso.getFechaDeposito()).isAfter(finalNStartFilter) &&
                                dateToLD(ingreso.getFechaDeposito()).isBefore(finalNEndFilter) : true)
                .filter(ingreso -> !titulo.equals("not") ?
                        ingreso.getComentario().toLowerCase().contains(titulo.toLowerCase()) : true)
                .collect(Collectors.toList());

        resultado.elementos = ingresoListResult.stream()
                .skip(pagina * cantidad)
                .limit(cantidad)
                .collect(Collectors.toList());
        resultado.cantidadTotal = (long) ingresoListResult.size();


        return resultado;
    }

    @Override
    public List<Ingreso> findAllConsultaIngreso(Long cantidad, int pagina, String startDate, String endDate, String titulo, String username) {
        List<Ingreso>ingresoList = this.findAllByUser(username);
        List<Ingreso>ingresoListResult;
        System.out.println("entra");
        LocalDate nStartFilter;
        LocalDate nEndFilter;

        if (startDate != null) {
            if (!startDate.equals("not")) {
                nStartFilter = LocalDate.parse(startDate);
            } else {
                nStartFilter = null;
            }
        } else {
            nStartFilter = null;
        }

        if (endDate != null) {
            if (!endDate.equals("not")) {
                nEndFilter = LocalDate.parse(endDate);
            }else {
                nEndFilter = null;
            }
        }else {
            nEndFilter = null;
        }

        LocalDate finalNStartFilter = nStartFilter;
        LocalDate finalNEndFilter = nEndFilter;
        ingresoListResult = ingresoList.stream()
                .filter(ingreso -> (finalNStartFilter != null && finalNEndFilter != null) ?
                        dateToLD(ingreso.getFechaDeposito()).isAfter(finalNStartFilter) &&
                                dateToLD(ingreso.getFechaDeposito()).isBefore(finalNEndFilter) : true)
                .filter(ingreso -> !titulo.equals("not") ?
                        ingreso.getComentario().toLowerCase().contains(titulo.toLowerCase()) : true)
                .collect(Collectors.toList());

        System.out.println("Sale");
        return ingresoListResult;
    }

    public static LocalDate dateToLD(Date date) {

        LocalDate nDate = date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
        return nDate;
    }

    @Override
    public Optional<Ingreso> findById(Long id) {
        return ingresoDAO.findById(id);
    }

    @Override
    public Optional<Ingreso> findIAndChildrenById(Long id) {
        return ingresoDAO.findIAndChildrenById(id);
    }

    @Override
    public Long findMaxId() {
        return ingresoDAO.findMaxId();
    }

    @Override
    public Ingreso AsociarConceptos(Ingreso ingreso, Long oldIdIngreso) {
        if (ingreso.isAsociarConceptos()) {
            List<Concepto> conceptoList = conceptoDAO.findAllActByUser(ingreso.getUsuario().getUsername());
            if (!conceptoList.isEmpty()) {
                Long newIdIngreso;
                List<DetalleIngreso> detalleIngresoList = new ArrayList<>();
                AtomicReference<Long> idDetalle = new AtomicReference<>(1L);
                if(oldIdIngreso!=null){
                    newIdIngreso = oldIdIngreso;
                }else {
                    newIdIngreso = this.findMaxId();
                }


                conceptoList.forEach(concepto -> {
                    DetalleIngreso detalleIngreso = new DetalleIngreso();
                    PorcentajeXConcepto porcentajeXConcepto = new PorcentajeXConcepto();
                    detalleIngreso.setDetalleIngresoId(DetalleIngresoId.builder()
                            .id(idDetalle.get())
                            .idIngreso(newIdIngreso)
                            .build());
                    detalleIngreso.setConcepto(concepto);
                    detalleIngreso.setUsuario(ingreso.getUsuario());
                    Double porcentaje = (concepto.getPorcentaje() * 1.0) / 100;
                    Double totalPorConcepto = ingreso.getMontoIngreso() * porcentaje;
                    detalleIngreso.setMontoPorcentaje(totalPorConcepto);
                    detalleIngreso.setMontoPorcentajeRest(0D);//Campo total asignado: maneja un registro de cuanto $ este concepto reasigno
                    detalleIngreso.setIdPctXCpto(idDetalle.get());

                    porcentajeXConcepto.setPctXConceptoId(PctXConceptoId.builder()
                                                          .id(idDetalle.get())
                                                          .detalleIngresoId(idDetalle.get())
                                                          .idIngreso(newIdIngreso)
                                                          .build());

                    if(ingreso.getTMoneda().equals(TipoMoneda.EFECTIVO)){
                        porcentajeXConcepto.setMontoAsigRealEfec(totalPorConcepto);
                        porcentajeXConcepto.setMontoAsigRealDig(0D);
                    }else {
                        porcentajeXConcepto.setMontoAsigRealEfec(0D);
                        porcentajeXConcepto.setMontoAsigRealDig(totalPorConcepto);
                    }
                    porcentajeXConcepto.setMontoAsigRest(0D);
                    porcentajeXConceptoDAO.saveOrUpdate(porcentajeXConcepto);
                    detalleIngresoDAO.saveOrUpdate(detalleIngreso);
                    idDetalle.getAndSet(idDetalle.get() + 1);
                });
                ingreso.setDetallesIngreso(detalleIngresoList);
            }
        }
        return ingreso;
    }

    @Override
    public void saveOrUpdate(Ingreso ingreso) {
        ingresoDAO.saveOrUpdate(ingreso);
    }

    @Override
    public void deleteById(Long id) {
        ingresoDAO.deleteById(id);
    }
}
