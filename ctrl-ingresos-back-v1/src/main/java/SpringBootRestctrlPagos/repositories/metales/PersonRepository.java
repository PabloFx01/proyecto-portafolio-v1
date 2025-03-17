package SpringBootRestctrlPagos.repositories.metales;

import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.metales.Person;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonRepository extends CrudRepository<Person, Long> {

    @Query("SELECT max(p.id) from Person p")
    Long findMaxId() ;
    @Query("select p from Person p where p.alias=?1 and p.password=?2")
    Person findByAliasAndPassword(String alias, String password);

    @Query("select p from Person p where p.alias=?1 ")
    Person findByAlias(String alias);
}
