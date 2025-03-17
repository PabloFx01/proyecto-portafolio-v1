package SpringBootRestctrlPagos.persistences.impl.servicios;

import SpringBootRestctrlPagos.models.entities.servicios.DetalleFactura;
import SpringBootRestctrlPagos.models.entities.servicios.DetalleFacturaId;
import SpringBootRestctrlPagos.models.entities.servicios.Factura;
import SpringBootRestctrlPagos.persistences.servicios.IDetalleFacturaDAO;
import SpringBootRestctrlPagos.repositories.servicios.DetalleFacturaRepository;
import SpringBootRestctrlPagos.repositories.servicios.FacturaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class DetalleFacturaDAOImpl implements IDetalleFacturaDAO {
    @Autowired
    private DetalleFacturaRepository dfRepo;
    @Override
    public List<DetalleFactura> findAllByIdFactura(Long idFactura) {
        return dfRepo.findAllByIdFactura(idFactura);
    }

    @Override
    public Optional<DetalleFactura> findDIByIdAndIdFactura(Long id, Long idFactura) {
        return Optional.ofNullable(dfRepo.findDIByIdAndIdFactura(id, idFactura));
    }

    @Override
    public Long findNextIdByIdFactura(Long idFactura) {
        return dfRepo.findNextIdByIdFactura(idFactura);
    }

    @Override
    public void saveOrUpdate(DetalleFactura detalleFactura) {
        dfRepo.save(detalleFactura);
    }

    @Override
    public void deleteById(DetalleFacturaId detalleFacturaId) {
        dfRepo.deleteById(detalleFacturaId);
    }
}
