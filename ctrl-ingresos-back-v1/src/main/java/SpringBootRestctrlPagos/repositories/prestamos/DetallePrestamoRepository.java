package SpringBootRestctrlPagos.repositories.prestamos;

import SpringBootRestctrlPagos.models.entities.ingresos.DetalleIngreso;
import SpringBootRestctrlPagos.models.entities.prestamos.DetallePrestamo;
import SpringBootRestctrlPagos.models.entities.prestamos.DetallePrestamoId;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetallePrestamoRepository extends CrudRepository<DetallePrestamo, DetallePrestamoId> {
    @Query("select dp from DetallePrestamo dp " +
            "where dp.detallePrestamoId.idPrestamo =?1")
    List<DetallePrestamo> findAllByIdPrestamo(Long idPrestamo);


    @Query("select dp from DetallePrestamo dp " +
           "where dp.detallePrestamoId.id =?1 and dp.detallePrestamoId.idPrestamo =?2")
    DetallePrestamo findDPByIdAndIdPrestamo(Long id, Long idPrestamo);


    @Query("SELECT COALESCE(max(dp.detallePrestamoId.id),0) + 1  from DetallePrestamo dp " +
            "where dp.detallePrestamoId.idPrestamo =?1")
    Long findNextIdByIdPrestamo(Long idPrestamo);

}
