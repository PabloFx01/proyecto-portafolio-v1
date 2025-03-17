package SpringBootRestctrlPagos.services.impl.prestamos;

import SpringBootRestctrlPagos.models.entities.prestamos.DetallePrestamo;
import SpringBootRestctrlPagos.models.entities.prestamos.DetallePrestamoId;
import SpringBootRestctrlPagos.persistences.prestamos.IDetallePrestamoDAO;
import SpringBootRestctrlPagos.services.prestamos.IDetallePrestamoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class DetallePrestamoServiceImpl implements IDetallePrestamoService {
    @Autowired
    private IDetallePrestamoDAO dPDAO;

    @Override
    public List<DetallePrestamo> findAllByIdPrestamo(Long idPrestamo) {
        return dPDAO.findAllByIdPrestamo(idPrestamo);
    }

    @Override
    public Optional<DetallePrestamo> findDIByIdAndIdPrestamo(Long id, Long idPrestamo) {
        return dPDAO.findDPByIdAndIdPrestamo(id, idPrestamo);
    }

    @Override
    public Long findNextIdByIdPrestamo(Long idPrestamo) {
        return dPDAO.findNextIdByIdPrestamo(idPrestamo);
    }

    @Override
    public void saveOrUpdate(DetallePrestamo dPrestamo) {
        dPDAO.saveOrUpdate(dPrestamo);
    }

    @Override
    public void deleteById(DetallePrestamoId id) {
        dPDAO.deleteById(id);
    }
}
