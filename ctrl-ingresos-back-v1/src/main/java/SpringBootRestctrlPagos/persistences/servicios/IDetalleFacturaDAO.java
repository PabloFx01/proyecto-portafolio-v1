package SpringBootRestctrlPagos.persistences.servicios;

import SpringBootRestctrlPagos.models.entities.servicios.DetalleFactura;
import SpringBootRestctrlPagos.models.entities.servicios.DetalleFacturaId;
import SpringBootRestctrlPagos.models.entities.servicios.Factura;
import org.springframework.data.jpa.repository.Query;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface IDetalleFacturaDAO {
    List<DetalleFactura> findAllByIdFactura(Long idFactura);
    Optional<DetalleFactura> findDIByIdAndIdFactura(Long id, Long idFactura);
    Long findNextIdByIdFactura(Long idFactura) ;
    void saveOrUpdate(DetalleFactura detalleFactura);
    void deleteById(DetalleFacturaId detalleFacturaId);
}
