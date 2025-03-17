package SpringBootRestctrlPagos.repositories.metales;

import SpringBootRestctrlPagos.models.entities.ingresos.Ingreso;
import SpringBootRestctrlPagos.models.entities.metales.Metal;
import SpringBootRestctrlPagos.models.entities.metales.MetalId;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MetalRepository extends CrudRepository<Metal, MetalId> {

    @Query("select m from Metal m inner join fetch m.usuario usu where m.metalId.id =?1")
    Metal findMetalById(String id);

    @Query("SELECT m from Metal m " +
            "inner join fetch m.usuario usu " +
            "where usu.username =?1 Order by m.nombre")
    List<Metal> findAllByUsername(String username);

    //Trae todos los activos
    //Activos = fechaFin is null
    @Query("SELECT m from Metal m " +
            "inner join fetch m.usuario usu " +
            "WHERE m.fechaFin is null " +
            "and usu.username =?1 Order by m.nombre")
    List<Metal> findAllAct(String username);

    //Trae todos los inactivos
    //Inactivos = fechaFin is not null

/*    @Query("SELECT mc1 FROM Metal mc1 WHERE mc1.metalId.period IN (" +
            "SELECT MAX(mc2.metalId.period) FROM Metal mc2 " +
            "WHERE mc2.metalId.id = mc1.metalId.id AND mc2.fechaFin IS NOT NULL " +
            "AND mc2.metalId.id NOT IN (SELECT mc3.metalId.id FROM Metal mc3 WHERE mc3.fechaFin IS NULL))")*/
@Query("SELECT m from Metal m " +
        "inner join fetch m.usuario usu " +
        "WHERE m.fechaFin is not null " +
        "and usu.username =?1 Order by m.nombre")
    List<Metal> findAllInact(String username);
}
