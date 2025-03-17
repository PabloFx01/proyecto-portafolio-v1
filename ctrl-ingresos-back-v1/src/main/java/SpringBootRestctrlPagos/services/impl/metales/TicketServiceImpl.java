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
public class TicketServiceImpl implements ITicketService {
    @Autowired
    private ITicketDAO ticketDAO;

    @Override
    public List<Ticket> findAll() {
        return ticketDAO.findAll();
    }

    @Override
    public ListadoPaginador<Ticket> findAllWithPagination(Long cantidad, int pagina, String filter, String username) {
        ListadoPaginador<Ticket> resultado = new ListadoPaginador<>();
        List<Ticket> ticketList = this.findAllAndChildren(username);

        Long cantidadTotal = 0L;
        if (!filter.equals("not")) {
            resultado.elementos = ticketList.stream()
                    .filter(ticket -> ticket.getDescripcion().toLowerCase().contains(filter.toLowerCase()))
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = ticketList.stream()
                    .filter(ticket -> ticket.getDescripcion().toLowerCase().contains(filter.toLowerCase()))
                    .count();
        } else {
            resultado.elementos = ticketList.stream()
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(ticketList.size());
        }
        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }

    @Override
    public List<Ticket> findAllAndChildrenNotUsed(String username) {
        return ticketDAO.findAllAndChildrenNotUsed(username);
    }

    @Override
    public List<Ticket> findAllAndChildren(String username) {
        return ticketDAO.findAllAndChildren(username);
    }

    @Override
    public Optional<Ticket> findById(Long id) {
        return ticketDAO.findById(id);
    }

    @Override
    public Optional<Ticket> findByIdAndChildren(Long id) {
        return ticketDAO.findByIdAndChildren(id);
    }

    @Override
    public Long findMaxId() {
        return ticketDAO.findMaxId();
    }

    @Override
    public void saveOrUpdate(Ticket ticket) {
        ticketDAO.saveOrUpdate(ticket);
    }

    @Override
    public void update(Long id, Ticket ticket) {

    }

    @Override
    public void deleteById(Long id) {
        ticketDAO.deleteById(id);
    }
}
