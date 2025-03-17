package SpringBootRestctrlPagos.services.metales;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.metales.*;

import java.util.List;
import java.util.Optional;

public interface IMetalVentaService {

    ListadoPaginador<MetalVenta> findAllWithPagination(String idMetalCompra, Long cantidad, int pagina, String filter);

    List<MetalVenta>findAllByIdMetalCompra(String idMetalCompra);

    Optional<MetalVenta> findById(MetalVentaId metalVentaId);
    Long nextMetalVentaIdByIdMetalCompra(String idMetalCompra);

    void saveOrUpdate(MetalVenta metalVenta);

    void update(MetalVentaId metalVentaId, MetalVenta detalleVenta);

    void deleteById(MetalVentaId metalVentaId);

}
