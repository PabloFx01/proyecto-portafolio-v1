package SpringBootRestctrlPagos.repositories.ingresos;

import SpringBootRestctrlPagos.models.entities.ingresos.Concepto;
import SpringBootRestctrlPagos.models.entities.ingresos.ConceptoId;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConceptoRepository extends CrudRepository<Concepto, ConceptoId> {
    @Query("select c from Concepto c inner join fetch c.usuario u where u.username =?1 " +
            "order by c.porcentaje desc")
    List<Concepto> findAllByUser(String username);

    @Query("select c from Concepto c inner join fetch c.usuario u where u.username =?1 " +
            "and c.activo = true " +
            "order by c.porcentaje desc")
    List<Concepto> findAllActByUser(String username);

    @Query("select c from Concepto c inner join fetch c.usuario u where u.username =?1 " +
            "and c.activo = false " +
            "order by c.porcentaje desc")
    List<Concepto> findAllInacByUser(String username);

    @Query("SELECT COALESCE(max(c.conceptoId.idConcepto),0) + 1  from Concepto c where c.conceptoId.idUsuario =?1")
    Long findNextIdByUser(Long idUsuario) ;
}
