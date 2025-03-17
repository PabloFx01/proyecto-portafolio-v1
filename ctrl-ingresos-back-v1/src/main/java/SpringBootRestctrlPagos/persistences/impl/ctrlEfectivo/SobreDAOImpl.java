package SpringBootRestctrlPagos.persistences.impl.ctrlEfectivo;

import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Sobre;
import SpringBootRestctrlPagos.persistences.ctrlEfectivo.ISobreDAO;
import SpringBootRestctrlPagos.repositories.ctrlEfectivo.SobreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class SobreDAOImpl implements ISobreDAO {

    @Autowired
    private SobreRepository sobreRepository;

    @Override
    public List<Sobre> findAll() {
        return (List<Sobre>) sobreRepository.findAll();
    }

    @Override
    public List<Sobre> findAllActByUsername(String username) {
        return sobreRepository.findAllActByUsername(username);
    }

    @Override
    public List<Sobre> findAllInacByUsername(String username) {
        return sobreRepository.findAllInacByUsername(username);
    }

    @Override
    public List<Sobre> findAllByUsername(String username) {
        return sobreRepository.findAllByUsername(username);
    }

    @Override
    public Optional<Sobre> findById(Long id) {
        return Optional.ofNullable(sobreRepository.findSobreAndChildrenById(id));
    }

    @Override
    public Long findMaxId() {
        return sobreRepository.findMaxId();
    }

    @Override
    public void saveOrUpdate(Sobre sobre) {
        sobreRepository.save(sobre);
    }

    @Override
    public void deleteById(Long id) {
        sobreRepository.deleteById(id);
    }
}
