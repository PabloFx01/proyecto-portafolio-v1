package SpringBootRestctrlPagos.persistences;

import SpringBootRestctrlPagos.models.entities.Usuario;


import java.util.List;
import java.util.Optional;

public interface IUserDAO {

    List<Usuario> findAll();
    Optional<Usuario> findById( Long id);
    Optional<Usuario> findByUsernameAndPassword(String username, String password);
    Optional<Usuario> findByUsername(String username);
    Long findMaxId() ;
    void saveOrUpdate(Usuario user);
    void deleteById(Long id);
}
