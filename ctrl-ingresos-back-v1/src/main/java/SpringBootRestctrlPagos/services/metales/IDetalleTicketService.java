package SpringBootRestctrlPagos.services.metales;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.metales.*;

import java.util.List;
import java.util.Optional;

public interface IDetalleTicketService {

    ListadoPaginador<DetalleTicket> findAllWithPagination(Long idVenta, Long cantidad, int pagina, String filter);

    List<DetalleTicket>findAllAndChildren(Long idTicket);

    Optional<DetalleTicket> findByIdAndChildren(Long id, Long idTicket);

    Optional<DetalleTicket> findById(DetalleTicketId detalleTicketId);
    Long nextIdDetalleByIdTicket(Long idTicket);

    void saveOrUpdate(DetalleTicket ticket);

    void update(Long id, DetalleTicket detalleTicket);
    void deleteById(DetalleTicketId detalleId);

}
