package SpringBootRestctrlPagos.services.servicios;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.servicios.DetalleFactura;
import SpringBootRestctrlPagos.models.entities.servicios.DetalleFacturaId;
import SpringBootRestctrlPagos.models.entities.servicios.Factura;

import java.util.List;
import java.util.Optional;

public interface IDetalleFacturaService {
    List<DetalleFactura> findAllByIdFactura(Long idFactura);
    ListadoPaginador<DetalleFactura> findAllWithPagination(Long idFactura,Long cantidad, int pagina);
    Optional<DetalleFactura> findDFByIdAndIdFactura(Long id, Long idFactura);
    Long findNextIdByIdFactura(Long idFactura) ;
    void saveOrUpdate(DetalleFactura detalleFactura);
    void deleteById(DetalleFacturaId detalleFacturaId);
}
