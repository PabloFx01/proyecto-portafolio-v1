package SpringBootRestctrlPagos.repositories.metales;

import SpringBootRestctrlPagos.models.entities.metales.DetalleVenta;
import SpringBootRestctrlPagos.models.entities.metales.DetalleVentaId;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleVentaRepository extends CrudRepository<DetalleVenta, DetalleVentaId> {

   /* @Query("SELECT dv from DetalleVenta dv left join fetch dv.metal where dv.detalleId.idVenta=?1" +
            " order by dv.id desc")*/
/*   @Query("SELECT dv from DetalleVenta dv left join fetch dv.metal m left join fetch " +
           " dv.venta v left join fetch v.ticket" +
           " left join fetch dv.metalVenta" +
           " where dv.detalleId.idVenta=?1" +
           " order by dv.id desc")*/
   @Query("SELECT dv from DetalleVenta dv " +
           "left join fetch dv.metal m " +
           "left join fetch dv.metalAsociadoVenta " +
           "inner join fetch m.usuario u " +
           "where dv.detalleId.idVenta=?1 " +
           "order by dv.id desc")
    List<DetalleVenta> findAllAndChildren(Long idVenta);

    @Query("SELECT dv from DetalleVenta dv " +
            "left join fetch dv.metal m " +
            "left join fetch dv.metalAsociadoVenta " +
            "inner join fetch m.usuario u " +
            "where dv.detalleId.id=?1 and dv.detalleId.idVenta = ?2")
    DetalleVenta findByIdAndChildren(Long id, Long idCompra) ;
    @Query( "SELECT COALESCE(max(dv.detalleId.id),0)+1 FROM DetalleVenta dv WHERE dv.detalleId.idVenta =?1")
    Long nextIdDetalleByIdVenta(Long idVenta);


}
