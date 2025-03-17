package SpringBootRestctrlPagos.services;



import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.Usuario;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    List<Usuario> findAll();
    Optional<Usuario> findById( Long id);
    Optional<Usuario> findByUsernameAndPassword(String username, String password);
    ListadoPaginador<Usuario> findAllWithPagination(Long cantidad, int pagina, String filter);
    Optional<Usuario> findByUsername(String username);
    Long findMaxId() ;
    void saveOrUpdate(Usuario user);
    void deleteById(Long id);
}
