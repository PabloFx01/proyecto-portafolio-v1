package SpringBootRestctrlPagos.services.impl.metales;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.persistences.metales.*;
import SpringBootRestctrlPagos.services.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DetalleTicketServiceImpl implements IDetalleTicketService {
    @Autowired
    private IDetalleTicketDAO dTicketDAO;

    @Override
    public ListadoPaginador<DetalleTicket> findAllWithPagination(Long idTicket, Long cantidad, int pagina, String filter) {
        ListadoPaginador<DetalleTicket> resultado = new ListadoPaginador<>();
        List<DetalleTicket> detalleTicketList = this.findAllAndChildren(idTicket);

        Long cantidadTotal = 0L;
        if (filter != null) {
            resultado.elementos = detalleTicketList.stream()
                    .filter(detalleTicket -> detalleTicket.getMetal().getNombre().toLowerCase().contains(filter.toLowerCase()))
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = detalleTicketList.stream()
                    .filter(detalleTicket -> detalleTicket.getMetal().getNombre().toLowerCase().contains(filter.toLowerCase()))
                    .count();
        } else {
            resultado.elementos = detalleTicketList.stream()
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(detalleTicketList.size());
        }
        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }

    @Override
    public List<DetalleTicket> findAllAndChildren(Long idTicket) {
        return dTicketDAO.findAllAndChildren(idTicket);
    }

    @Override
    public Optional<DetalleTicket> findByIdAndChildren(Long id, Long idTicket) {
        return dTicketDAO.findByIdAndChildren(id,idTicket);
    }

    @Override
    public Optional<DetalleTicket> findById(DetalleTicketId detalleTicketId) {
        return dTicketDAO.findById(detalleTicketId);
    }

    @Override
    public Long nextIdDetalleByIdTicket(Long idTicket) {
        return dTicketDAO.nextIdDetalleByIdTicket(idTicket);
    }

    @Override
    public void saveOrUpdate(DetalleTicket ticket) {
        dTicketDAO.saveOrUpdate(ticket);
    }

    @Override
    public void update(Long id, DetalleTicket detalleTicket) {

    }

    @Override
    public void deleteById(DetalleTicketId detalleId) {
        dTicketDAO.deleteById(detalleId);
    }
}
