package SpringBootRestctrlPagos.repositories.metales;

import SpringBootRestctrlPagos.models.entities.metales.DetalleCompra;
import SpringBootRestctrlPagos.models.entities.metales.DetalleCompraId;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleCompraRepository extends CrudRepository<DetalleCompra, DetalleCompraId> {
    @Query("SELECT dc from DetalleCompra dc " +
            "left join fetch dc.metal m " +
            "inner join fetch m.usuario usu " +
            "where dc.detalleId.idCompra=?1" +
            " order by dc.id desc")
    List<DetalleCompra> findAllAndChildren(Long idCompra);

    @Query("SELECT dc from DetalleCompra dc left join fetch dc.metal m " +
            "inner join fetch m.usuario usu " +
            "where dc.detalleId.id=?1 and dc.detalleId.idCompra = ?2")
    DetalleCompra findByIdAndChildren(Long id, Long idCompra);

    @Query("SELECT COALESCE(max(dc.detalleId.id),0)+1 FROM DetalleCompra dc WHERE dc.detalleId.idCompra =?1")
    Long nextIdDetalleByIdCompra(Long idCompra);

    @Query("SELECT dc from DetalleCompra dc where dc.detalleId.id=?1 and dc.detalleId.idCompra = ?2")
    DetalleCompra findPorId(Long id, Long idCompra);

    @Modifying
    @Query("delete from DetalleCompra dc where dc.detalleId.id=?1 and dc.detalleId.idCompra = ?2")
    void deletePorId(Long id, Long idCompra);

    @Query(value =
            "SELECT max(metal_id) as metalId, avg(precio_compra) as avgMetalCompra " +
                    "FROM tbl_detalles_compra " +
                    "WHERE metal_id IN (SELECT metal_id FROM tbl_detalles_tickets WHERE id_ticket = (SELECT id_ticket FROM tbl_ventas WHERE id = :ventaId)) " +
                    "AND id_compra IN (SELECT id FROM tbl_compras WHERE id_venta = :ventaId) " +
                    "GROUP BY metal_id", nativeQuery = true)
    List<Object[]> findAVGDetallesCompraByIdVenta(@Param("ventaId") Long ventaId);

    @Query(value =
            "SELECT max(metal_id) as metalId, avg(precio_compra) as avgMetalCompra " +
                    "FROM tbl_detalles_compra " +
                    "WHERE metal_id IN (SELECT metal_id FROM tbl_detalles_tickets " +
                    "WHERE id_ticket = (SELECT id_ticket FROM tbl_ventas WHERE id = :ventaId)) " +
                    "GROUP BY metal_id", nativeQuery = true)
    List<Object[]> findAVGDetallesCompraByIdVentaAndIsIndividual(@Param("ventaId") Long ventaId);

}
