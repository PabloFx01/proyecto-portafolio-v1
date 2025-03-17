package SpringBootRestctrlPagos.repositories.servicios;

import SpringBootRestctrlPagos.models.entities.servicios.DetalleFactura;
import SpringBootRestctrlPagos.models.entities.servicios.DetalleFacturaId;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleFacturaRepository extends CrudRepository<DetalleFactura, DetalleFacturaId> {
    @Query("select df from DetalleFactura df where df.detalleFacturaId.idFactura =?1")
    List<DetalleFactura> findAllByIdFactura(Long idFactura);

    @Query("select df from DetalleFactura df where df.detalleFacturaId.id=?1 and df.detalleFacturaId.idFactura =?2")
    DetalleFactura findDIByIdAndIdFactura(Long id, Long idFactura);

    @Query("SELECT COALESCE(max(df.detalleFacturaId.id),0) + 1  from DetalleFactura df where df.detalleFacturaId.idFactura =?1")
    Long findNextIdByIdFactura(Long idFactura) ;
}
