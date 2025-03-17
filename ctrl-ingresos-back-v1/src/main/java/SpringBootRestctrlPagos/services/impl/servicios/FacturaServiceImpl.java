package SpringBootRestctrlPagos.services.impl.servicios;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.servicios.Factura;
import SpringBootRestctrlPagos.models.entities.servicios.Servicio;
import SpringBootRestctrlPagos.persistences.servicios.IFacturaDAO;
import SpringBootRestctrlPagos.persistences.servicios.IServicioDAO;
import SpringBootRestctrlPagos.services.servicios.IFacturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FacturaServiceImpl implements IFacturaService {
    @Autowired
    private IFacturaDAO facturaDAO;

    @Autowired
    private IServicioDAO servicioDAO;

    @Override
    public List<Factura> findAllAndChildrenByUser(String username) {
        return facturaDAO.findAllAndChildrenByUser(username);
    }

    @Override
    public List<Factura> findAllByUser(String username) {
        return facturaDAO.findAllByUser(username);
    }

    @Override
    public List<Factura> findAllAndChildrenPaidByUser(String username) {
        return facturaDAO.findAllAndChildrenPaidByUser(username);
    }

    @Override
    public List<Factura> findAllAndChildrenNotPaidByUser(String username) {
        return facturaDAO.findAllAndChildrenNotPaidByUser(username);
    }

    @Override
    public List<Factura> findAllPaidByUser(String username) {
        return facturaDAO.findAllPaidByUser(username);
    }

    @Override
    public List<Factura> findAllNotPaidByUser(String username) {
        return facturaDAO.findAllNotPaidByUser(username);
    }

    @Override
    public ListadoPaginador<Factura> findAllWithPagination(Long cantidad, int pagina, String state, String username) {
        ListadoPaginador<Factura> resultado = new ListadoPaginador<>();
        List<Factura> servicioList;
        if (state.equals("PAID")) {
            servicioList = this.findAllPaidByUser(username);
        } else if (state.equals("NOT_PAID")) {
            servicioList = this.findAllNotPaidByUser(username);
        } else {
            servicioList = this.findAllByUser(username);
        }
        Long cantidadTotal = 0L;

        resultado.elementos = servicioList.stream()
                .skip(pagina * cantidad)
                .limit(cantidad)
                .collect(Collectors.toList());
        cantidadTotal = Long.valueOf(servicioList.size());

        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }

    @Override
    public ListadoPaginador<Factura> findAllWithPaginationByServicio(Long cantidad, int pagina, String state, String username, Long idService) {
        ListadoPaginador<Factura> resultado = new ListadoPaginador<>();
        List<Factura> servicioList;
        if (state.equals("PAID")) {
            servicioList = this.findAllPaidByUserAndService(username,idService);
        } else if (state.equals("NOT_PAID")) {
            servicioList = this.findAllNotPaidByUserAndService(username, idService);
        } else {
            servicioList = this.findAllByUserAndService(username,idService);
        }
        Long cantidadTotal = 0L;

        resultado.elementos = servicioList.stream()
                .skip(pagina * cantidad)
                .limit(cantidad)
                .collect(Collectors.toList());
        cantidadTotal = Long.valueOf(servicioList.size());

        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }

    @Override
    public ListadoPaginador<Factura> findAllConsultaFacturaWithPaginador(Long cantidad,
                                                                         int pagina,
                                                                         String startDate,
                                                                         String endDate,
                                                                         String idServicio,
                                                                         boolean state,
                                                                         String username) {
        ListadoPaginador<Factura> resultado = new ListadoPaginador<>();
        List<Factura>facturaList;
        if(state){
            facturaList = this.findAllPaidByUser(username);
        }else {
            facturaList = this.findAllNotPaidByUser(username);
        }

        List<Factura>facturaListResult;

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
        facturaListResult = facturaList.stream()
                .filter(factura -> (finalNStartFilter != null && finalNEndFilter != null) ?
                        dateToLD(factura.getFecha()).isAfter(finalNStartFilter) &&
                                dateToLD(factura.getFecha()).isBefore(finalNEndFilter) : true)
                .filter(factura -> !idServicio.equals("not") ?
                        factura.getServicio().getId().equals(Long.parseLong(idServicio)) : true)
                .collect(Collectors.toList());

        resultado.elementos = facturaListResult.stream()
                .skip(pagina * cantidad)
                .limit(cantidad)
                .collect(Collectors.toList());
        resultado.cantidadTotal = (long) facturaListResult.size();


        return resultado;
    }

    public static LocalDate dateToLD(Date date) {

        LocalDate nDate = date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
        System.out.println(nDate);
        return nDate;
    }
    @Override
    public List<Factura> findAllAndChildrenByUserAndService(String username, Long idService) {
        return facturaDAO.findAllAndChildrenByUserAndService(username, idService);
    }

    @Override
    public List<Factura> findAllByUserAndService(String username, Long idService) {
        return facturaDAO.findAllByUserAndService(username, idService);
    }

    @Override
    public List<Factura> findAllAndChildrenPaidByUserAndService(String username, Long idService) {
        return facturaDAO.findAllAndChildrenPaidByUserAndService(username, idService);
    }

    @Override
    public List<Factura> findAllAndChildrenNotPaidByUserAndService(String username, Long idService) {
        return facturaDAO.findAllAndChildrenNotPaidByUserAndService(username, idService);
    }

    @Override
    public List<Factura> findAllPaidByUserAndService(String username, Long idService) {
        return facturaDAO.findAllPaidByUserAndService(username,idService);
    }

    @Override
    public List<Factura> findAllNotPaidByUserAndService(String username, Long idService) {
        return facturaDAO.findAllNotPaidByUserAndService(username, idService);
    }

    @Override
    public Optional<Factura> findFAndChildrenPaidByUserAndService(String username, Long idService) {
        Optional<Servicio> optionalServicio = servicioDAO.findIdAndChildren(idService);
        Optional<Factura> optFactura = null;
        if(optionalServicio.isPresent()){
            Servicio servicio = optionalServicio.get();
            List<Factura> facturaList = facturaDAO.findAllAndChildrenPaidByUserAndService(username, idService);
            if(!facturaList.isEmpty()){
                optFactura = Optional.ofNullable(facturaList.stream()
                        .filter(f -> dateToLD(f.getFechaPagoTotVto()).isEqual(dateToLD(servicio.getFechaIniVto())))
                        .findFirst().orElse(null));
            }
        }
        return optFactura;
    }

    @Override
    public Optional<Factura> findFAndChildrenById(Long id) {
        return facturaDAO.findFAndChildrenById(id);
    }
    @Override
    public Optional<Factura> findFById(Long id) {
        return facturaDAO.findFById(id);
    }

    @Override
    public Long findMaxId() {
        return facturaDAO.findMaxId();
    }

    @Override
    public void saveOrUpdate(Factura factura) {
        facturaDAO.saveOrUpdate(factura);
    }

    @Override
    public void deleteById(Long idFactura) {
        facturaDAO.deleteById(idFactura);
    }
}
