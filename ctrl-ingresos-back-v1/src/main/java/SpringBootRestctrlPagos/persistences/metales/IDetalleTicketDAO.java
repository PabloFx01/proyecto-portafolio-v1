package SpringBootRestctrlPagos.persistences.metales;

import SpringBootRestctrlPagos.models.entities.metales.DetalleTicket;
import SpringBootRestctrlPagos.models.entities.metales.DetalleTicketId;

import java.util.List;
import java.util.Optional;

public interface IDetalleTicketDAO {

    List<DetalleTicket> findAllAndChildren(Long idTicket);

    Optional<DetalleTicket> findByIdAndChildren(Long id, Long idTicket);

    Optional<DetalleTicket> findById(DetalleTicketId detalleTicketId);
    Long nextIdDetalleByIdTicket(Long idTicket);

    void saveOrUpdate(DetalleTicket detalleTicket);

    void deleteById(DetalleTicketId detalleId);
}
