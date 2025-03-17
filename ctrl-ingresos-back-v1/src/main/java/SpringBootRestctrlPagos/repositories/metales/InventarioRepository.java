package SpringBootRestctrlPagos.repositories.metales;


import SpringBootRestctrlPagos.models.entities.metales.Inventario;
import SpringBootRestctrlPagos.models.entities.metales.InventarioId;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventarioRepository extends CrudRepository<Inventario, InventarioId> {
    @Query("SELECT i from Inventario i " +
            "inner join fetch i.usuario u " +
            "left join fetch i.metal " +
            "where u.username =?1 " +
            "order by i.id asc")
    List<Inventario> findAllAndChildren(String username);

    @Query("SELECT i from Inventario i left join fetch i.metal " +
            "inner join fetch i.usuario usu " +
            "where i.inventarioId.id=?1 and i.inventarioId.metalId=?2")
    Inventario findByIdAndChildren(Long id,String metalId) ;

    @Query("SELECT i from Inventario i " +
            "inner join fetch i.usuario u " +
            "left join fetch i.metal " +
            "where i.inventarioId.metalId=?1")
    Inventario findByIdMetal(String metalId) ;

    @Query( "SELECT COALESCE(max(i.inventarioId.id),0)+1 FROM Inventario i " +
            "where i.usuario.username =?1 ")
    Long nextInventarioId(String username);

}
