package SpringBootRestctrlPagos.repositories.metales;

import SpringBootRestctrlPagos.models.entities.metales.Venta;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VentaRepository extends CrudRepository<Venta, Long> {

    @Query("SELECT v from Venta v " +
            "inner join fetch v.usuario usu " +
            "left join fetch v.ticket t  " +
            "left join fetch v.detalleVenta dv " +
            "left join fetch dv.metal m " +
            //"inner join fetch m.usuario m_usu " +
            "left join fetch dv.metalAsociadoVenta " +
            "where usu.username =?1 " +
            "ORDER BY v.id desc")
   // @Query("SELECT v from Venta v left join fetch v.ticket t ")
    List<Venta> findAllAndChildren(String username);

    @Query("SELECT v from Venta v " +
            "inner join fetch v.usuario usu " +
            "left join fetch v.ticket t " +
            "left join fetch v.detalleVenta dv " +
            "left join fetch dv.metal " +
            "left join fetch dv.metalAsociadoVenta " +
            "where v.id=?1")
        // @Query("SELECT v from Venta v left join fetch v.ticket t " +
        //       "where v.id=?1")
    Venta findByIdAndChildren(Long id);

    @Query("SELECT max(v.id) from Venta v ")
    Long findMaxId();
}
