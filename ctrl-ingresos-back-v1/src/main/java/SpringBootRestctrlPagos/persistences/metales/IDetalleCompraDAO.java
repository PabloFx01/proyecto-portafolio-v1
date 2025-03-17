package SpringBootRestctrlPagos.persistences.metales;

import SpringBootRestctrlPagos.controllers.dto.metales.DetalleCompraPromDTO;
import SpringBootRestctrlPagos.models.entities.metales.DetalleCompra;
import SpringBootRestctrlPagos.models.entities.metales.DetalleCompraId;

import java.util.List;
import java.util.Optional;

public interface IDetalleCompraDAO {
    List<DetalleCompra> findAll();
    List<DetalleCompra> findAllAndChildren(Long idCompra);
    List<DetalleCompraPromDTO> findAVGDetallesCompraByIdVenta(Long idVenta);
    List<DetalleCompraPromDTO> findAVGDetallesCompraByIdVentaAndIsIndividual(Long idVenta);
    Optional<DetalleCompra> findByIdAndChildren(Long id, Long idCompra);
    Optional<DetalleCompra> findPorId(Long id, Long idCompra);
    Long nextIdDetalleByIdCompra(Long idCompra);
    void saveOrUpdate(DetalleCompra DetalleCompra);
    void deletePorId(Long id, Long idCompra);
    void deleteById(DetalleCompraId detalleId);
}
