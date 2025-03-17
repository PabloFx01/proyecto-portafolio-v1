package SpringBootRestctrlPagos.persistences.metales;

import SpringBootRestctrlPagos.models.entities.metales.Ticket;

import java.util.List;
import java.util.Optional;

public interface ITicketDAO {
    List<Ticket> findAll();
    List<Ticket> findAllAndChildren(String username);
    List<Ticket> findAllAndChildrenNotUsed(String username);
    Optional<Ticket> findByIdAndChildren(Long id) ;
    Optional<Ticket> findById(Long id);
    Long findMaxId();
    void saveOrUpdate(Ticket ticket);
    void deleteById(Long id);
}
