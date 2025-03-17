package SpringBootRestctrlPagos.services.metales;

import SpringBootRestctrlPagos.controllers.dto.metales.DetalleCompraPromDTO;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.metales.*;

import java.util.List;
import java.util.Optional;

public interface IDetalleCompraService {
    List<DetalleCompra> findAll(Long idCompra);
    ListadoPaginador<DetalleCompra> findAllWithPagination(Long idCompra, Long cantidad, int pagina, String filter);

    List<DetalleCompra>findAllAndChildren(Long idCompra);
    List<DetalleCompraPromDTO>findAVGDetallesCompraByIdVenta(Long idVenta);
    List<DetalleCompraPromDTO>findAVGDetallesCompraByIdVentaAndIsIndividual(Long idVenta);
    Optional<DetalleCompra> findByIdAndChildren(Long id, Long idCompra);
    Optional<DetalleCompra> findPorId(Long id, Long idCompra);
    Long nextIdDetalleByIdCompra(Long idCompra);
    void saveOrUpdate(DetalleCompra compra);
    void update(Long id, DetalleCompra detalleCompra);

    void deletePorId(Long id,Long idCompra);
    void deleteById(DetalleCompraId detalleId);

}
