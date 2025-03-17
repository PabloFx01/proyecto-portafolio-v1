package SpringBootRestctrlPagos.repositories;


import SpringBootRestctrlPagos.models.entities.Usuario;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<Usuario, Long> {
    @Query("select u from Usuario u where u.username=?1 and u.password=?2")
    Usuario findByUsernameAndPassword(String username, String password);

    @Query("select u from Usuario u where u.username=?1 ")
    Usuario findByUsername(String username);

    @Query("SELECT max(u.id) from Usuario u")
    Long findMaxId() ;
}
