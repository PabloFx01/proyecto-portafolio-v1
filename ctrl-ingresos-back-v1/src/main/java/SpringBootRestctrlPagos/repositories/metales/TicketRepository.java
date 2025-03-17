package SpringBootRestctrlPagos.repositories.metales;

import SpringBootRestctrlPagos.models.entities.metales.Ticket;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends CrudRepository<Ticket, Long> {
    @Query("SELECT t from Ticket t  " +
            "inner join fetch t.usuario u " +
            "left join fetch t.detalleTicket dt " +
            "left join fetch dt.metal m " +
            "where u.username =?1 " +
            "order by t.id desc")
    List<Ticket> findAllAndChildren(String username);

    @Query("SELECT t from Ticket t  " +
            "inner join fetch t.usuario u " +
            "left join fetch t.detalleTicket dt " +
            "left join fetch dt.metal " +
            "where t.used = false and u.username =?1 ")
    List<Ticket> findAllAndChildrenNotUsed(String username);

    @Query("SELECT t from Ticket t " +
            "inner join fetch t.usuario u " +
            "left join fetch t.detalleTicket dt " +
            "left join fetch dt.metal m " +
            "where t.id=?1")
    Ticket findByIdAndChildren(Long id) ;

    @Query("SELECT max(t.id) from Ticket t ")
    Long findMaxId() ;
}
