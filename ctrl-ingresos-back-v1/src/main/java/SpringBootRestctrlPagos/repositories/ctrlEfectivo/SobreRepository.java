package SpringBootRestctrlPagos.repositories.ctrlEfectivo;

import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Sobre;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SobreRepository extends CrudRepository<Sobre, Long> {
    @Query("SELECT s from Sobre s inner join fetch s.usuario usu where s.activo = false and s.usuario.username =?1")
    List<Sobre> findAllActByUsername(String username);

    @Query("SELECT s from Sobre s inner join fetch s.usuario usu where s.activo=true and usu.username =?1")
    List<Sobre> findAllInacByUsername(String username);

    @Query("SELECT s from Sobre s inner join fetch s.usuario usu where usu.username =?1")
    List<Sobre> findAllByUsername(String username);
    @Query("SELECT s from Sobre s inner join fetch s.usuario usu where s.id =?1")
    Sobre findSobreAndChildrenById(Long id);

    @Query("SELECT max(s.id) from Sobre s ")
    Long findMaxId();
}
