package SpringBootRestctrlPagos.repositories.ingresos;

import SpringBootRestctrlPagos.models.entities.ingresos.Ingreso;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngresoRepository extends CrudRepository<Ingreso, Long> {
    @Query("select i from Ingreso i left join fetch i.detallesIngreso di " +
            "left join fetch di.concepto c " +
            "left join fetch di.pctXCpto pc " +
            "inner join fetch i.usuario usu where usu.username =?1 " +
            "order by i.fechaDeposito asc")
    List<Ingreso> findAllAndChildrenByUser(String username);

    @Query("select i from Ingreso i inner join fetch i.usuario usu where usu.username =?1 " +
            "order by i.fechaDeposito asc")
    List<Ingreso> findAllByUser(String username);
    @Query("select i from Ingreso i left join fetch i.detallesIngreso di " +
            "left join fetch di.concepto c " +
            "left join fetch di.pctXCpto pc " +
            "inner join fetch i.usuario usu where i.id =?1")
    Ingreso findIAndChildrenById(Long id);
    @Query("select i from Ingreso i inner join fetch i.usuario usu where i.id =?1")
    Ingreso findIngresoById(Long id);
    @Query("SELECT max(i.id) from Ingreso i ")
    Long findMaxId() ;


}
