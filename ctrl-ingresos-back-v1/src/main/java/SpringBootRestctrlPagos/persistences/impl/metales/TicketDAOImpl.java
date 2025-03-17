package SpringBootRestctrlPagos.persistences.impl.metales;

import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.persistences.metales.*;
import SpringBootRestctrlPagos.repositories.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class TicketDAOImpl implements ITicketDAO {
    @Autowired
    private TicketRepository ticketRepository;

    @Override
    public List<Ticket> findAll() {
        return (List<Ticket>) ticketRepository.findAll();
    }

    @Override
    public List<Ticket> findAllAndChildren(String username) {
        return ticketRepository.findAllAndChildren(username);
    }

    @Override
    public List<Ticket> findAllAndChildrenNotUsed(String username) {
        return ticketRepository.findAllAndChildrenNotUsed(username);
    }

    @Override
    public Optional<Ticket> findByIdAndChildren(Long id) {
        return Optional.ofNullable(ticketRepository.findByIdAndChildren(id));
    }

    @Override
    public Optional<Ticket> findById(Long id) {
        return ticketRepository.findById(id);
    }

    @Override
    public Long findMaxId() {
        return ticketRepository.findMaxId();
    }

    @Override
    public void saveOrUpdate(Ticket ticket) {
        ticketRepository.save(ticket);
    }

    @Override
    public void deleteById(Long id) {
        ticketRepository.deleteById(id);
    }
}
