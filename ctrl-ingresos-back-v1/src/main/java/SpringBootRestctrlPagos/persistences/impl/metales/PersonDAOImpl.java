package SpringBootRestctrlPagos.persistences.impl.metales;

import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.persistences.metales.*;
import SpringBootRestctrlPagos.repositories.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class PersonDAOImpl implements IPersonDAO {
    @Autowired
    private PersonRepository personRepository;

    @Override
    public List<Person> findAll() {
        return (List<Person>) personRepository.findAll();
    }

    @Override
    public Optional<Person> findById(Long id) {
        return personRepository.findById(id);
    }

    @Override
    public Long findMaxId() {
        return personRepository.findMaxId();
    }

    @Override
    public Optional<Person> findByAliasAndPassword(String alias, String password) {
        return Optional.ofNullable(personRepository.findByAliasAndPassword(alias, password));
    }

    @Override
    public Optional<Person> findByAlias(String alias) {
        return Optional.ofNullable(personRepository.findByAlias(alias));
    }

    @Override
    public void saveOrUpdate(Person person) {
        personRepository.save(person);
    }

    @Override
    public void deleteById(Long id) {
        personRepository.deleteById(id);
    }
}
