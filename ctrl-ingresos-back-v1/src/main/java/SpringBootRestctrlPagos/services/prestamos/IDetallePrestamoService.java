package SpringBootRestctrlPagos.services.prestamos;

import SpringBootRestctrlPagos.models.entities.prestamos.DetallePrestamo;
import SpringBootRestctrlPagos.models.entities.prestamos.DetallePrestamoId;

import java.util.List;
import java.util.Optional;

public interface IDetallePrestamoService {
    List<DetallePrestamo> findAllByIdPrestamo(Long idPrestamo);

    Optional<DetallePrestamo> findDIByIdAndIdPrestamo(Long id, Long idPrestamo);
    Long findNextIdByIdPrestamo(Long idPrestamo);

    void saveOrUpdate(DetallePrestamo dPrestamo);

    void deleteById(DetallePrestamoId id);

}
