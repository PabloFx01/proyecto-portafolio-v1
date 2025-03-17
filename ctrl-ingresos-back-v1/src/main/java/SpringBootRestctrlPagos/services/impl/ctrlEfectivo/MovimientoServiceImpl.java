package SpringBootRestctrlPagos.services.impl.ctrlEfectivo;


import SpringBootRestctrlPagos.controllers.dto.ctrlEfectivo.MovimientoConsultaDTO;
import SpringBootRestctrlPagos.controllers.dto.ctrlEfectivo.MovimientoConsultaDTO2;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Movimiento;
import SpringBootRestctrlPagos.persistences.ctrlEfectivo.IMovimientoDAO;
import SpringBootRestctrlPagos.services.ctrlEfectivo.IMovimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import SpringBootRestctrlPagos.models.ListadoPaginador;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MovimientoServiceImpl implements IMovimientoService {
    @Autowired
    private IMovimientoDAO movimientoDAO;

    @Override
    public List<Movimiento> findAll() {
        return movimientoDAO.findAll();
    }

    @Override
    public List<Movimiento> findAllAndChildrenByUsername(String username) {
        return movimientoDAO.findAllAndChildrenByUsername(username);
    }

    @Override
    public List<Movimiento> findAllAndChildrenByUsernameAsc(String username) {
        return movimientoDAO.findAllAndChildrenByUsernameAsc(username);
    }

    @Override
    public ListadoPaginador<Movimiento> findAllWithPaginationByUsername(Long cantidad, int pagina, String filter, String username) {
        ListadoPaginador<Movimiento> resultado = new ListadoPaginador<>();
        List<Movimiento> movimientoList = this.findAllAndChildrenByUsername(username);

        Long cantidadTotal = 0L;
        if (!filter.equals("not")) {
            resultado.elementos = movimientoList.stream()
                    .filter(movimiento -> movimiento.getCuenta().getSobre().getDescripcion().toLowerCase().equals(filter.toLowerCase()))
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = movimientoList.stream()
                    .filter(movimiento -> movimiento.getCuenta().getSobre().getDescripcion().toLowerCase().equals(filter.toLowerCase()))
                    .count();
        } else {
            resultado.elementos = movimientoList.stream()
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(movimientoList.size());
        }
        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }

    @Override
    public ListadoPaginador<Movimiento> findAllConsultaMovWithPaginationByUsername(Long cantidad,
                                                                                   int pagina,
                                                                                   String startMov,
                                                                                   String endMov,
                                                                                   String idSobre,
                                                                                   String tipoMov,
                                                                                   String username) {
        ListadoPaginador<Movimiento> resultado = new ListadoPaginador<>();
        List<Movimiento> movimientoList = this.findAllAndChildrenByUsername(username);
        List<Movimiento> movimientoListResult = new ArrayList<>();

        LocalDate nStartFilter;
        LocalDate nEndFilter;

        String[] tMov = tipoMov.split(" ");
        String tMovString = tMov[0];

        if (startMov != null) {
            if (!startMov.equals("not")) {
                nStartFilter = LocalDate.parse(startMov);
            } else {
                nStartFilter = null;
            }
        } else {
            nStartFilter = null;
        }


        if (endMov != null) {
            if (!endMov.equals("not")) {
                nEndFilter = LocalDate.parse(endMov);
            } else {
                nEndFilter = null;
            }
        } else {
            nEndFilter = null;
        }

        LocalDate finalNStartFilter = nStartFilter;
        LocalDate finalNEndFilter = nEndFilter;
        movimientoListResult = movimientoList.stream()
                .filter(mov -> (finalNStartFilter != null && finalNEndFilter != null) ?
                        dateToLD(mov.getFecha()).isAfter(LocalDate.parse(startMov)) &&
                                dateToLD(mov.getFecha()).isBefore(LocalDate.parse(endMov)) : true)
                .filter(mov -> !idSobre.equals("not") ?
                        mov.getCuenta().getSobre().getId().equals(Long.parseLong(idSobre)) : true)
                .filter(mov -> !tipoMov.equals("not") ?
                        mov.getTipoMovimiento().contains(tMovString) : true)
                .collect(Collectors.toList());

        resultado.elementos = movimientoListResult.stream()
                .skip(pagina * cantidad)
                .limit(cantidad)
                .collect(Collectors.toList());
        resultado.cantidadTotal = (long) movimientoListResult.size();


        return resultado;
    }

    @Override
    public List<MovimientoConsultaDTO> findAllConsultaMovByUsername(String startMov, String endMov, String idSobre, String tipoMov, String username) {

        List<Movimiento> movimientoList = this.findAllAndChildrenByUsername(username);
        List<MovimientoConsultaDTO> movimientoListResult = new ArrayList<>();

        LocalDate nStartFilter;
        LocalDate nEndFilter;

        if (startMov != null) {
            if (!startMov.equals("not")) {
                nStartFilter = LocalDate.parse(startMov);
            } else {
                nStartFilter = null;
            }
        } else {
            nStartFilter = null;
        }

        if (endMov != null) {
            if (!endMov.equals("not")) {
                nEndFilter = LocalDate.parse(endMov);
            } else {
                nEndFilter = null;
            }
        } else {
            nEndFilter = null;
        }

        LocalDate finalNStartFilter = nStartFilter;
        System.out.println("finalNStartFilter = " + finalNStartFilter);
        LocalDate finalNEndFilter = nEndFilter;
        System.out.println("finalNEndFilter = " + finalNEndFilter);

        movimientoListResult = movimientoList.stream()
                .filter(mov -> (finalNStartFilter != null && finalNEndFilter != null) ?
                        dateToLD(mov.getFecha()).isAfter(LocalDate.parse(startMov)) &&
                                dateToLD(mov.getFecha()).isBefore(LocalDate.parse(endMov)) : true)
                .filter(mov -> !idSobre.equals("not") ?
                        mov.getCuenta().getSobre().getId().equals(Long.parseLong(idSobre)) : true)
                .filter(mov -> !tipoMov.equals("not") ?
                        mov.getTipoMovimiento().equals(tipoMov) : true)
                .map(this::movimientoToMovimientoConsultaDTO)
                .collect(Collectors.toList());


        return movimientoListResult;
    }

    @Override
    public List<MovimientoConsultaDTO2> getAllConsultaMovByUsername(String startMov, String endMov, String idSobre, String tipoMov, String username) {
        List<Movimiento> movimientoList = this.findAllAndChildrenByUsernameAsc(username);
        List<MovimientoConsultaDTO2> movimientoListResult = new ArrayList<>();

        LocalDate nStartFilter;
        LocalDate nEndFilter;

        String[] tMov = tipoMov.split(" ");
        String tMovString = tMov[0];

        if (startMov != null) {
            if (!startMov.equals("not")) {
                nStartFilter = LocalDate.parse(startMov);
            } else {
                nStartFilter = null;
            }
        } else {
            nStartFilter = null;
        }

        if (endMov != null) {
            if (!endMov.equals("not")) {
                nEndFilter = LocalDate.parse(endMov);
            } else {
                nEndFilter = null;
            }
        } else {
            nEndFilter = null;
        }

        LocalDate finalNStartFilter = nStartFilter;
        LocalDate finalNEndFilter = nEndFilter;
        movimientoListResult = movimientoList.stream()
                .filter(mov -> (finalNStartFilter != null && finalNEndFilter != null) ?
                        dateToLD(mov.getFecha()).isAfter(LocalDate.parse(startMov)) &&
                                dateToLD(mov.getFecha()).isBefore(LocalDate.parse(endMov)) : true)
                .filter(mov -> !idSobre.equals("not") ?
                        mov.getCuenta().getSobre().getId().equals(Long.parseLong(idSobre)) : true)
                .filter(mov -> !tipoMov.equals("not") ?
                        mov.getTipoMovimiento().contains(tMovString) : true)
                .map(this::movimientoToMovimientoConsultaDTO2)
                .collect(Collectors.toList());


        return movimientoListResult;
    }

    @Override
    public List<MovimientoConsultaDTO2> getAllConsultaADDMovByUsername(String startMov, String endMov, String idSobre, String tipoMov, String username) {
        List<Movimiento> movimientoList = this.findAllAndChildrenByUsernameAsc(username);
        List<MovimientoConsultaDTO2> movimientoListResult = new ArrayList<>();

        LocalDate nStartFilter;
        LocalDate nEndFilter;

        String[] tMov = tipoMov.split(" ");
        String tMovString = tMov[0];
        String tMovStringTranfer = "Transferir fondo de";

        if (startMov != null) {
            if (!startMov.equals("not")) {
                nStartFilter = LocalDate.parse(startMov);
            } else {
                nStartFilter = null;
            }
        } else {
            nStartFilter = null;
        }

        if (endMov != null) {
            if (!endMov.equals("not")) {
                nEndFilter = LocalDate.parse(endMov);
            } else {
                nEndFilter = null;
            }
        } else {
            nEndFilter = null;
        }

        LocalDate finalNStartFilter = nStartFilter;
        LocalDate finalNEndFilter = nEndFilter;
        movimientoListResult = movimientoList.stream()
                .filter(mov -> (finalNStartFilter != null && finalNEndFilter != null) ?
                        dateToLD(mov.getFecha()).isAfter(LocalDate.parse(startMov)) &&
                                dateToLD(mov.getFecha()).isBefore(LocalDate.parse(endMov)) : true)
                .filter(mov -> !idSobre.equals("not") ?
                        mov.getCuenta().getSobre().getId().equals(Long.parseLong(idSobre)) : true)
                .filter(mov -> !tipoMov.equals("not") ?
                        mov.getTipoMovimiento().contains(tMovString) || mov.getTipoMovimiento().contains(tMovStringTranfer): true)
                .map(this::movimientoToMovimientoConsultaDTO2)
                .collect(Collectors.toList());


        return movimientoListResult;
    }

    private MovimientoConsultaDTO movimientoToMovimientoConsultaDTO(Movimiento movimiento) {
        return MovimientoConsultaDTO.builder()
                .id(movimiento.getId())
                .fecha(movimiento.getFecha())
                .tipoMovimiento(movimiento.getTipoMovimiento())
                .comentario(movimiento.getComentario())
                .monto(movimiento.getMonto())
                .cuenta(movimiento.getCuenta())
                .transaccion(movimiento.getTransaccion())
                .build();
    }

    private MovimientoConsultaDTO2 movimientoToMovimientoConsultaDTO2(Movimiento movimiento) {
        return MovimientoConsultaDTO2.builder()
                .id(movimiento.getId())
                .fecha(movimiento.getFecha())
                .tipoMovimiento(movimiento.getTipoMovimiento())
                .comentario(movimiento.getComentario())
                .monto(movimiento.getMonto())
                .cuenta(movimiento.getCuenta())
                .transaccion(movimiento.getTransaccion())
                .build();
    }


    public static LocalDate dateToLD(Date date) {

        LocalDate nDate = date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
        return nDate;
    }

    @Override
    public Optional<Movimiento> findById(Long id) {
        return movimientoDAO.findById(id);
    }

    @Override
    public List<Movimiento> findByIdSobreAndChildren(Long id) {
        return movimientoDAO.findByIdSobreAndChildren(id);
    }

    @Override
    public void saveOrUpdate(Movimiento movimiento) {
        movimientoDAO.saveOrUpdate(movimiento);
    }

    @Override
    public void deleteById(Long id) {
        movimientoDAO.deleteById(id);
    }
}
