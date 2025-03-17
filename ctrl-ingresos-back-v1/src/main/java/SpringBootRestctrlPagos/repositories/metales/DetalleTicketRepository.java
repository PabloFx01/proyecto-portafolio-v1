package SpringBootRestctrlPagos.repositories.metales;

import SpringBootRestctrlPagos.models.entities.metales.DetalleTicket;
import SpringBootRestctrlPagos.models.entities.metales.DetalleTicketId;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleTicketRepository extends CrudRepository<DetalleTicket, DetalleTicketId> {

    @Query("SELECT dt from DetalleTicket dt " +
            "left join fetch dt.metal m " +
            "inner join fetch m.usuario u " +
            "left join fetch dt.metalAsociadoTicket " +
            "where dt.detalleId.idTicket=?1 " +
            "order by dt.id desc")
    List<DetalleTicket> findAllAndChildren(Long idTicket);

    @Query("SELECT dt from DetalleTicket dt " +
            "left join fetch dt.metal m " +
            "inner join fetch m.usuario u " +
            "left join fetch dt.metalAsociadoTicket " +
            "where dt.detalleId.id=?1 and dt.detalleId.idTicket = ?2")
    DetalleTicket findByIdAndChildren(Long id, Long idTicket) ;
    @Query( "SELECT COALESCE(max(dt.detalleId.id),0)+1 FROM DetalleTicket dt WHERE dt.detalleId.idTicket =?1")
    Long nextIdDetalleByIdTicket(Long idTicket);


}
