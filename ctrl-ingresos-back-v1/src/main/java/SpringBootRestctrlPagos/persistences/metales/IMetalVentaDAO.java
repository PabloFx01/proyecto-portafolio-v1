package SpringBootRestctrlPagos.persistences.metales;

import SpringBootRestctrlPagos.models.entities.metales.MetalVenta;
import SpringBootRestctrlPagos.models.entities.metales.MetalVentaId;
import java.util.List;
import java.util.Optional;

public interface IMetalVentaDAO {

    List<MetalVenta> findAll();
    List<MetalVenta> findAllByIdMetalCompra(String idMetalCompra);
    Optional<MetalVenta> findById(MetalVentaId metalVentaId);
    Long nextMetalVentaIdByIdMetalCompra(String idMetalCompra);
    void saveOrUpdate(MetalVenta metalVenta);
    void deleteById(MetalVentaId metalVentaId);
}
