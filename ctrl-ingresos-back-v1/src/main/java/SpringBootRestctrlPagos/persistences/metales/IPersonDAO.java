package SpringBootRestctrlPagos.persistences.metales;

import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.metales.Person;

import java.util.List;
import java.util.Optional;

public interface IPersonDAO {
    List<Person> findAll();
    Optional<Person> findById( Long id);
    Long findMaxId() ;
    Optional<Person> findByAliasAndPassword(String alias, String password);
    Optional<Person> findByAlias(String alias);
    void saveOrUpdate(Person person);
    void deleteById(Long id);
}
