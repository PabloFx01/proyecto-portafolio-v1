package SpringBootRestctrlPagos.services.impl.servicios;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.ingresos.Concepto;
import SpringBootRestctrlPagos.models.entities.servicios.Servicio;
import SpringBootRestctrlPagos.persistences.servicios.IServicioDAO;
import SpringBootRestctrlPagos.services.servicios.IServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ServicioServiceImpl implements IServicioService {
    @Autowired
    private IServicioDAO servicioDAO;

    @Override
    public List<Servicio> findAll() {
        return servicioDAO.findAll();
    }

    @Override
    public List<Servicio> findAllByUser(String username) {
        return servicioDAO.findAllByUser(username);
    }

    @Override
    public List<Servicio> findAllActByUser(String username) {
        return servicioDAO.findAllActByUser(username);
    }

    @Override
    public List<Servicio> findAllInacByUser(String username) {
        return servicioDAO.findAllInacByUser(username);
    }

    @Override
    public ListadoPaginador<Servicio> findAllWithPagination(Long cantidad, int pagina, String state, String username, String filter) {
        ListadoPaginador<Servicio> resultado = new ListadoPaginador<>();
        List<Servicio> servicioList;
        if (state.equals("ACT")) {
            servicioList = this.findAllActByUser(username);
        } else if (state.equals("INACT")) {
            servicioList = this.findAllInacByUser(username);
        } else {
            servicioList = this.findAllByUser(username);
        }
        Long cantidadTotal = 0L;
        if (filter != null) {

            resultado.elementos = servicioList.stream()
                    .filter(servicio -> servicio.getNombre().toLowerCase().contains(filter.toLowerCase()))
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = servicioList.stream()
                    .filter(servicio -> servicio.getNombre().toLowerCase().contains(filter.toLowerCase()))
                    .count();
        } else {
            resultado.elementos = servicioList.stream()
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(servicioList.size());
        }
        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }

    @Override
    public Optional<Servicio> findById(Long idServicio) {
        return servicioDAO.findById(idServicio);
    }

    @Override
    public Optional<Servicio> findIdAndChildren(Long id) {
        return servicioDAO.findIdAndChildren(id);
    }

    @Override
    public void saveOrUpdate(Servicio servicio) {
        servicioDAO.saveOrUpdate(servicio);
    }

    @Override
    public void updateComentario(String newComentario, Long id) {
        servicioDAO.updateComentario(newComentario, id);
    }

    @Override
    public void updateServicios(String username) {
        List<Servicio> servicioList = servicioDAO.findAllActByUser(username);
        if (servicioList.size() > 0) {
            servicioList.forEach(s -> {
                try {
                    this.saveOrUpdate(actualizarFechas(s));
                } catch (ParseException e) {
                    throw new RuntimeException(e);
                }
            });
        }
    }

    public static Date actualizarFecha(LocalDate oldDate) throws ParseException {
        LocalDate actDate = LocalDate.now();
        int oldDay = oldDate.getDayOfMonth();
        int actMonth = actDate.getMonthValue();
        int actYear = actDate.getYear();
        String fechaString = String.format("%04d%02d%02d", actYear, actMonth, oldDay);

        DateFormat formatoFecha = new SimpleDateFormat("yyyyMMdd");
        Date fecha = formatoFecha.parse(fechaString);

        return fecha;
    }

    public static Servicio actualizarFechas(Servicio servicio) throws ParseException {
        LocalDate fechaActual = LocalDate.now();
        System.out.println("fechaActual = " + fechaActual);

        String mesAct = LocalDate.now().getMonth().toString();
        String mesIniServicio = dateToLD(servicio.getFechaIniVto()).getMonth().toString();
        LocalDate servicioIniDate = dateToLD(servicio.getFechaIniVto());
        LocalDate servicioFinDate = dateToLD(servicio.getFechaFinVto());
        int mesIniNumber = servicioIniDate.getMonthValue();
        int yearIniNumber = servicioIniDate.getMonthValue();
        int mesFinNumber = servicioFinDate.getMonthValue();

        if (fechaActual.isEqual(servicioFinDate) || fechaActual.isAfter(servicioFinDate)) {
            if (servicio.getPeriodoPago() < 1) {
                servicio.setFechaIniVto(actualizarAFechaSiguiente(servicioIniDate, servicio.getPeriodoPago()));
                servicio.setFechaFinVto(actualizarAFechaSiguiente(servicioFinDate, servicio.getPeriodoPago()));
            } else if (!mesIniServicio.equals(mesAct) || servicioIniDate.getYear() != fechaActual.getYear()) {
                servicio.setFechaIniVto(actualizarAFechaActual(servicioIniDate));
               if (servicio.getPeriodoPago() == 1) {
                    if (mesFinNumber > mesIniNumber) {
                        servicio.setFechaFinVto(actualizarAFechaSiguiente(servicioFinDate, servicio.getPeriodoPago()));
                    } else if (mesIniNumber == mesFinNumber) {
                        servicio.setFechaFinVto(actualizarAFechaActual(servicioFinDate));
                    } else if (mesIniNumber == mesFinNumber) {
                        servicio.setFechaFinVto(actualizarAFechaActual(servicioFinDate));
                    }
                } else if (servicio.getPeriodoPago() > 1) {
                    System.out.println("4");
                    int mesIniNumberAct = dateToLD(servicio.getFechaIniVto()).getMonthValue();
                    if (mesFinNumber == mesIniNumberAct) {
                        servicio.setFechaFinVto(actualizarAFechaSiguiente(servicioFinDate, servicio.getPeriodoPago()));
                    }
                }
            }
        }


        return servicio;
    }

    public static Date actualizarAFechaActual(LocalDate oldDate) throws ParseException {
        LocalDate actDate = LocalDate.now();
        int oldDay = oldDate.getDayOfMonth();
        int actMonth = actDate.getMonthValue();
        int actYear = actDate.getYear();
        String fechaString = String.format("%04d%02d%02d", actYear, actMonth, oldDay);

        DateFormat formatoFecha = new SimpleDateFormat("yyyyMMdd");
        Date fecha = formatoFecha.parse(fechaString);

        return fecha;
    }

    public static Date actualizarAFechaSiguiente(LocalDate oldDate, Double periodPay) throws ParseException {
        LocalDate nDate;
        System.out.println("periodPay = " + periodPay);
        String fechaString = "";
        Date fecha;
        int oldDay, actMonth, actYear;
        //long nPeriodPay =  (periodPay<1) ? 1 : periodPay.longValue();
        if (periodPay < 1) {
            nDate = oldDate.plusDays(15);
            System.out.println("nDate = " + nDate);
            oldDay = nDate.getDayOfMonth();
            actMonth = nDate.getMonthValue();
            actYear = nDate.getYear();
        } else {

            long nPeriodPay = (periodPay < 1) ? 1 : periodPay.longValue();

            System.out.println("nPeriodPay = " + nPeriodPay);
            nDate = oldDate.plusMonths(nPeriodPay);

            oldDay = oldDate.getDayOfMonth();
            actMonth = nDate.getMonthValue();
            actYear = nDate.getYear();

        }
        fechaString = String.format("%04d%02d%02d", actYear, actMonth, oldDay);
        DateFormat formatoFecha = new SimpleDateFormat("yyyyMMdd");
        fecha = formatoFecha.parse(fechaString);
        System.out.println(fecha);
        return fecha;
    }

    public static LocalDate dateToLD(Date date) {

        LocalDate nDate = date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
        System.out.println(nDate);
        return nDate;
    }

    @Override
    public void deleteById(Long idServicio) {
        servicioDAO.deleteById(idServicio);
    }

    @Override
    public void softDeleteById(Long idServicio) {

    }
}
