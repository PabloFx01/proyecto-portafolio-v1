package SpringBootRestctrlPagos.repositories.servicios;

import SpringBootRestctrlPagos.models.entities.servicios.Factura;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacturaRepository extends CrudRepository<Factura, Long> {
    @Query("select f from Factura f left join fetch f.detallesFactura df " +
            "inner join fetch f.servicio s " +
            "inner join fetch f.usuario usu where usu.username =?1")
    List<Factura> findAllAndChildrenByUser(String username);

    @Query("select f from Factura f left join fetch f.detallesFactura df " +
            "inner join fetch f.servicio s " +
            "inner join fetch f.usuario usu " +
            "where f.estado = true and usu.username =?1")
    List<Factura> findAllAndChildrenPaidByUser(String username);

    @Query("select f from Factura f left join fetch f.detallesFactura df " +
            "inner join fetch f.servicio s " +
            "inner join fetch f.usuario usu " +
            "where f.estado = false and usu.username =?1")
    List<Factura> findAllAndChildrenNotPaidByUser(String username);

    @Query("select f from Factura f " +
            "inner join fetch f.servicio s " +
            "inner join fetch f.usuario usu where usu.username =?1")
    List<Factura> findAllByUser(String username);

    @Query("select f from Factura f " +
            "inner join fetch f.servicio s " +
            "inner join fetch f.usuario usu " +
            "where f.estado = true and usu.username =?1")
    List<Factura> findAllPaidByUser(String username);

    @Query("select f from Factura f " +
            "inner join fetch f.servicio s " +
            "inner join fetch f.usuario usu " +
            "where f.estado = false and usu.username =?1")
    List<Factura> findAllNotPaidByUser(String username);


    @Query("select f from Factura f left join fetch f.detallesFactura df " +
            "inner join fetch f.servicio s " +
            "inner join fetch f.usuario usu where usu.username =?1 and s.id=?2")
    List<Factura> findAllAndChildrenByUserAndService(String username, Long idService);

    @Query("select f from Factura f left join fetch f.detallesFactura df " +
            "inner join fetch f.servicio s " +
            "inner join fetch f.usuario usu " +
            "where f.estado = true and usu.username =?1 and s.id=?2")
    List<Factura> findAllAndChildrenPaidByUserAndService(String username, Long idService);

    @Query("select f from Factura f left join fetch f.detallesFactura df " +
            "inner join fetch f.servicio s " +
            "inner join fetch f.usuario usu " +
            "where f.estado = false and usu.username =?1 and s.id=?2")
    List<Factura> findAllAndChildrenNotPaidByUserAndService(String username, Long idService);

    @Query("select f from Factura f " +
            "inner join fetch f.servicio s " +
            "inner join fetch f.usuario usu where usu.username =?1 and s.id=?2")
    List<Factura> findAllByUserAndService(String username, Long idService);

    @Query("select f from Factura f " +
            "inner join fetch f.servicio s " +
            "inner join fetch f.usuario usu " +
            "where f.estado = true and usu.username =?1 and s.id=?2")
    List<Factura> findAllPaidByUserAndService(String username, Long idService);

    @Query("select f from Factura f " +
            "inner join fetch f.servicio s " +
            "inner join fetch f.usuario usu " +
            "where f.estado = false and usu.username =?1 and s.id=?2")
    List<Factura> findAllNotPaidByUserAndService(String username, Long idService);

    @Query("select f from Factura f left join fetch f.detallesFactura df " +
            "inner join fetch f.servicio s " +
            "inner join fetch f.usuario usu where f.id =?1")
    Factura findFAndChildrenById(Long id);

    @Query("select f from Factura f " +
            "inner join fetch f.servicio s " +
            "inner join fetch f.usuario usu where f.id =?1")
    Factura findFById(Long id);

    @Query("SELECT max(f.id) from Factura f ")
    Long findMaxId();
}

