package SpringBootRestctrlPagos.services.metales;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.metales.*;

import java.util.List;
import java.util.Optional;

public interface IPersonService {


    List<Person> findAll();
    Optional<Person> findById( Long id);
    Long findMaxId() ;
    Optional<Person> findByAliasAndPassword(String alias, String password);
    ListadoPaginador<Person> findAllWithPagination(Long cantidad, int pagina, String filter);
    Optional<Person> findByAlias(String alias);
    void saveOrUpdate(Person person);
    void deleteById(Long id);
}
