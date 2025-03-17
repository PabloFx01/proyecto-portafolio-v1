package SpringBootRestctrlPagos.persistences.impl.metales;

import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.persistences.metales.*;
import SpringBootRestctrlPagos.repositories.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class DetalleTicketDAOImpl implements IDetalleTicketDAO {
    @Autowired
    private DetalleTicketRepository dTicketRepository;

    @Override
    public List<DetalleTicket> findAllAndChildren(Long idTicket) {
        return dTicketRepository.findAllAndChildren(idTicket);
    }

    @Override
    public Optional<DetalleTicket> findByIdAndChildren(Long id, Long idTicket) {
        return Optional.ofNullable(dTicketRepository.findByIdAndChildren(id, idTicket));
    }

    @Override
    public Optional<DetalleTicket> findById(DetalleTicketId detalleTicketId) {
        return dTicketRepository.findById(detalleTicketId);
    }

    @Override
    public Long nextIdDetalleByIdTicket(Long idTicket) {
        return dTicketRepository.nextIdDetalleByIdTicket(idTicket);
    }

    @Override
    public void saveOrUpdate(DetalleTicket detalleTicket) {
        dTicketRepository.save(detalleTicket);
    }

    @Override
    public void deleteById(DetalleTicketId detalleId) {
        dTicketRepository.deleteById(detalleId);
    }
}
