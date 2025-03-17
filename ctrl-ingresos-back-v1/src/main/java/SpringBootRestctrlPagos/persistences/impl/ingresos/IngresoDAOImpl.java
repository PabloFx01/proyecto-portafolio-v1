package SpringBootRestctrlPagos.persistences.impl.ingresos;

import SpringBootRestctrlPagos.models.entities.ingresos.Ingreso;
import SpringBootRestctrlPagos.persistences.ingresos.IIngresoDAO;
import SpringBootRestctrlPagos.repositories.ingresos.IngresoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class IngresoDAOImpl implements IIngresoDAO {
    @Autowired
    private IngresoRepository ingresoRepository;

    @Override
    public List<Ingreso> findAllByUser(String username) {
        return ingresoRepository.findAllByUser(username);
    }

    @Override
    public List<Ingreso> findAllAndChildrenByUser(String username) {
        return ingresoRepository.findAllAndChildrenByUser(username);
    }

    @Override
    public Optional<Ingreso> findById(Long id) {
        return Optional.ofNullable(ingresoRepository.findIngresoById(id));
    }

    @Override
    public Optional<Ingreso> findIAndChildrenById(Long id) {
        return Optional.ofNullable(ingresoRepository.findIAndChildrenById(id));
    }

    @Override
    public Long findMaxId() {
        return ingresoRepository.findMaxId();
    }

    @Override
    public void saveOrUpdate(Ingreso ingreso) {
        ingresoRepository.save(ingreso);
    }

    @Override
    public void deleteById(Long id) {
        ingresoRepository.deleteById(id);
    }
}
