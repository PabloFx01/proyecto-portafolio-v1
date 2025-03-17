package SpringBootRestctrlPagos.repositories.ctrlEfectivo;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Cuenta;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CuentaRepository extends CrudRepository<Cuenta, Long> {
    @Query("select c from Cuenta c inner join fetch c.sobre s " +
            "inner join fetch s.usuario usu " +
            "where s.activo = false and s.usuario.username =?1")
    List<Cuenta> findAllFromSobreActByUsername(String username);

    @Query("SELECT c from Cuenta c inner join fetch c.sobre s  " +
            "inner join fetch s.usuario usu " +
            "where c.sobre.id=?1")
    Cuenta findByIdSobre(Long id) ;

    @Query("SELECT c from Cuenta c inner join fetch c.sobre s  " +
            "inner join fetch s.usuario usu " +
            "where c.id=?1")
    Cuenta findCAndChildrenById(Long id) ;

    @Query("SELECT max(c.id) from Cuenta c ")
    Long findMaxId() ;


}
