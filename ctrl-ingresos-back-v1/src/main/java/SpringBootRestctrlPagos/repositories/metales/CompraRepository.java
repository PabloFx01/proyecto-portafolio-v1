package SpringBootRestctrlPagos.repositories.metales;

import SpringBootRestctrlPagos.models.entities.metales.Compra;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompraRepository extends CrudRepository<Compra, Long> {
    //@Query("SELECT c from Compra c left join fetch c.detalleCompra dc left join fetch dc.metal")
    @Query("SELECT c from Compra c " +
            "inner join fetch c.usuario u " +
           "left join fetch c.venta v left join fetch v.ticket " +
           "left join fetch c.detalleCompra dc left join fetch dc.metal m " +
            "where u.username =?1" +
           "order by c.id desc")
    List<Compra> findAllAndChildren(String username);

    @Query("SELECT c from Compra c " +
            "inner join fetch c.usuario u " +
            "left join fetch c.venta v left join fetch v.ticket " +
            "left join fetch c.detalleCompra dc left join fetch dc.metal m " +
            "where c.venta.id=?1 and u.username =?2 order by c.id asc")
    List<Compra> findAllAndChildrenByIdVenta(Long idVenta, String username);

    @Query("SELECT c from Compra c " +
            "inner join fetch c.usuario u " +
            "left join fetch c.venta v left join fetch v.ticket " +
            "left join fetch c.detalleCompra dc left join fetch dc.metal m " +
            "where c.venta.id is null and u.username =?1 order by c.id desc")
    List<Compra> findAllAndChildrenNotIdVenta(String username);

    @Query("SELECT c from Compra c " +
            "inner join fetch c.usuario u " +
            "left join fetch c.venta v left join fetch v.ticket " +
            "left join fetch c.detalleCompra dc left join fetch dc.metal m " +
            "where c.venta.id is not null and u.username =?1 " +
            "order by c.fechaCompra")
    List<Compra> findAllAndChildrenWithVenta(String username);

    /*@Query("SELECT c from Compra c left join fetch c.detalleCompra dc left join fetch dc.metal " +
            "where c.id=?1")*/
    @Query("SELECT c from Compra c " +
            "left join fetch c.venta v " +
            "left join fetch v.ticket " +
            "left join fetch c.detalleCompra dc " +
            "left join fetch dc.metal m " +
            "inner join fetch c.usuario usu " +
            "where c.id=?1")
    Compra findByIdAndChildren(Long id) ;

    @Query("SELECT max(c.id) from Compra c " +
            "where c.usuario.username =?1")
    Long findMaxId(String username) ;
}
