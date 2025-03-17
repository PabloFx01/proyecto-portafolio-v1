package SpringBootRestctrlPagos.services.metales;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.metales.*;

import java.util.List;
import java.util.Optional;

public interface ITicketService {
    List<Ticket> findAll();

    ListadoPaginador<Ticket> findAllWithPagination(Long cantidad, int pagina, String filter, String username);
    List<Ticket> findAllAndChildrenNotUsed(String username);
    List<Ticket>findAllAndChildren(String username);
    Optional<Ticket> findById(Long id);
    Optional<Ticket> findByIdAndChildren(Long id);
    Long findMaxId();
    void saveOrUpdate(Ticket ticket);
    void update(Long id, Ticket ticket);

    void deleteById(Long id);

}
