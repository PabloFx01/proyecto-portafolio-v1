package SpringBootRestctrlPagos.services.impl.metales;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.persistences.metales.*;
import SpringBootRestctrlPagos.services.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PersonServiceImpl implements IPersonService {
    @Autowired
    private IPersonDAO personDao;

    @Override
    public List<Person> findAll() {
        return (List<Person>) personDao.findAll();
    }

    @Override
    public Optional<Person> findById(Long id) {
        return personDao.findById(id);
    }

    @Override
    public Long findMaxId() {
        return personDao.findMaxId();
    }

    @Override
    public Optional<Person> findByAliasAndPassword(String alias, String password) {
        return personDao.findByAliasAndPassword(alias, password);
    }

    @Override
    public ListadoPaginador<Person> findAllWithPagination(Long cantidad, int pagina, String filter) {
        ListadoPaginador<Person> resultado = new ListadoPaginador<>();
        List<Person> personList = this.findAll();

        Long cantidadTotal = 0L;
        if (filter != null) {
            resultado.elementos = personList.stream()
                    .filter(person -> person.getNombre().toLowerCase().contains(filter.toLowerCase()))
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = personList.stream()
                    .filter(person -> person.getNombre().toLowerCase().contains(filter.toLowerCase()))
                    .count();
        } else {
            resultado.elementos = personList.stream()
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(personList.size());
        }
        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }

    @Override
    public Optional<Person> findByAlias(String alias) {
        return personDao.findByAlias(alias);
    }

    @Override
    public void saveOrUpdate(Person person) {
        personDao.saveOrUpdate(person);
    }

    @Override
    public void deleteById(Long id) {
        personDao.deleteById(id);
    }
}
