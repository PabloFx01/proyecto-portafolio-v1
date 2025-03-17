package SpringBootRestctrlPagos.services.metales;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.metales.*;

import java.util.List;
import java.util.Optional;

public interface IDetalleVentaService {

    ListadoPaginador<DetalleVenta> findAllWithPagination(Long idVenta, Long cantidad, int pagina, String filter);

    List<DetalleVenta>findAllAndChildren(Long idVenta);

    Optional<DetalleVenta> findByIdAndChildren(Long id, Long idVenta);

    Optional<DetalleVenta> findById(DetalleVentaId detalleVentaId);
    Long nextIdDetalleByIdVenta(Long idVenta);

    void saveOrUpdate(DetalleVenta venta);

    void update(Long id, DetalleVenta detalleVenta);
    void deleteById(DetalleVentaId detalleId);

}
