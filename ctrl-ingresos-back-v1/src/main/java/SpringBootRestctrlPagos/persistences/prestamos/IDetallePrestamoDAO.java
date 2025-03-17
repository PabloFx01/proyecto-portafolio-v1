package SpringBootRestctrlPagos.persistences.prestamos;

import SpringBootRestctrlPagos.models.entities.ingresos.DetalleIngreso;
import SpringBootRestctrlPagos.models.entities.ingresos.DetalleIngresoId;
import SpringBootRestctrlPagos.models.entities.prestamos.DetallePrestamo;
import SpringBootRestctrlPagos.models.entities.prestamos.DetallePrestamoId;

import java.util.List;
import java.util.Optional;

public interface IDetallePrestamoDAO {
    List<DetallePrestamo> findAllByIdPrestamo(Long idPrestamo);

    Optional<DetallePrestamo> findDPByIdAndIdPrestamo(Long id, Long idPrestamo);
    Long findNextIdByIdPrestamo(Long idPrestamo);

    void saveOrUpdate(DetallePrestamo dPrestamo);

    void deleteById(DetallePrestamoId id);
}
