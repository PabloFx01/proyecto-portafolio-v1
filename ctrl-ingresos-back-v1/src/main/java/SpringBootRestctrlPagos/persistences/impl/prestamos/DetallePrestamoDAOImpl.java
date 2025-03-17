package SpringBootRestctrlPagos.persistences.impl.prestamos;

import SpringBootRestctrlPagos.models.entities.prestamos.DetallePrestamo;
import SpringBootRestctrlPagos.models.entities.prestamos.DetallePrestamoId;
import SpringBootRestctrlPagos.persistences.prestamos.IDetallePrestamoDAO;
import SpringBootRestctrlPagos.repositories.prestamos.DetallePrestamoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class DetallePrestamoDAOImpl implements IDetallePrestamoDAO {

    @Autowired
    private DetallePrestamoRepository dPrestamoRepository;

    @Override
    public List<DetallePrestamo> findAllByIdPrestamo(Long idPrestamo) {
        return dPrestamoRepository.findAllByIdPrestamo(idPrestamo);
    }

    @Override
    public Optional<DetallePrestamo> findDPByIdAndIdPrestamo(Long id, Long idPrestamo) {
        return Optional.ofNullable(dPrestamoRepository.findDPByIdAndIdPrestamo(id, idPrestamo));
    }

    @Override
    public Long findNextIdByIdPrestamo(Long idPrestamo) {
        return dPrestamoRepository.findNextIdByIdPrestamo(idPrestamo);
    }

    @Override
    public void saveOrUpdate(DetallePrestamo dPrestamo) {
        dPrestamoRepository.save(dPrestamo);
    }

    @Override
    public void deleteById(DetallePrestamoId id) {
        dPrestamoRepository.deleteById(id);
    }
}
