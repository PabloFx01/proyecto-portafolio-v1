package SpringBootRestctrlPagos.services.ingresos;

import SpringBootRestctrlPagos.models.entities.ingresos.DetalleIngreso;
import SpringBootRestctrlPagos.models.entities.ingresos.DetalleIngresoId;

import java.util.List;
import java.util.Optional;

public interface IDetalleIngresoService {
    List<DetalleIngreso> findAllByIdIngreso(Long idIngreso);

    List<DetalleIngreso> findAllAndChildrenByIdIngreso(Long idIngreso);

    Optional<DetalleIngreso> findDIAndChildrenByIdAndIdIngreso(Long id, Long idIngreso);
    Optional<DetalleIngreso> findDIAndChildrenByConceptoAndIdIngreso(String concepto, Long idIngreso);

    Long findMaxIdByIdIngreso(Long idIngreso);

    void saveOrUpdate(DetalleIngreso dIngreso);

    void deleteById(DetalleIngresoId id);
    void updateTotalRestByIdIngreso(Long idIngreso);
}
