package SpringBootRestctrlPagos.repositories.ctrlEfectivo;

import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Transaccion;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransaccionRepository extends CrudRepository<Transaccion, Long> {
    @Query("SELECT max(t.id) from Transaccion t ")
    Long findMaxId() ;
    @Query("SELECT t from Transaccion t inner join fetch t.cuentaOrigen co  " +
            "inner join fetch co.sobre " +
            "inner join fetch t.cuentaDestino cd " +
            "inner join fetch cd.sobre " +
            "order by t.id desc")
    List<Transaccion> findAllAndChildren();

    @Query("SELECT t from Transaccion t inner join fetch t.cuentaOrigen co  " +
            "inner join fetch co.sobre " +
            "inner join fetch t.cuentaDestino cd " +
            "inner join fetch cd.sobre " +
            "where t.id =?1 ")
    Transaccion findByIdAndChildren(Long id);
}
