package SpringBootRestctrlPagos.persistences.metales;

import SpringBootRestctrlPagos.models.entities.metales.DetalleVenta;
import SpringBootRestctrlPagos.models.entities.metales.DetalleVentaId;

import java.util.List;
import java.util.Optional;

public interface IDetalleVentaDAO {

    List<DetalleVenta> findAll();

    List<DetalleVenta> findAllAndChildren(Long idVenta);

    Optional<DetalleVenta> findByIdAndChildren(Long id, Long idVenta);
    Optional<DetalleVenta> findById(DetalleVentaId detalleVentaId);
    Long nextIdDetalleByIdVenta(Long idVenta);

    void saveOrUpdate(DetalleVenta detalleVenta);

    void deleteById(DetalleVentaId detalleId);
}
