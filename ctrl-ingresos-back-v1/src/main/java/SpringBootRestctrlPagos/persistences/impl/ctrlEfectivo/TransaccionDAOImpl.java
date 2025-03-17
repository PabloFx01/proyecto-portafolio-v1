package SpringBootRestctrlPagos.persistences.impl.ctrlEfectivo;

import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Transaccion;
import SpringBootRestctrlPagos.persistences.ctrlEfectivo.ITransaccionDAO;
import SpringBootRestctrlPagos.repositories.ctrlEfectivo.TransaccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class TransaccionDAOImpl implements ITransaccionDAO {

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Override
    public List<Transaccion> findAll() {
        return (List<Transaccion>) transaccionRepository.findAll();
    }

    @Override
    public List<Transaccion> findAllAndChildren() {
        return transaccionRepository.findAllAndChildren();
    }

    @Override
    public Optional<Transaccion> findById(Long id) {
        return transaccionRepository.findById(id);
    }

    @Override
    public Optional<Transaccion> findByIdAndChildren(Long id) {
        return Optional.ofNullable(transaccionRepository.findByIdAndChildren(id));
    }

    @Override
    public Long findMaxId() {
        return transaccionRepository.findMaxId();
    }

    @Override
    public void saveOrUpdate(Transaccion transaccion) {
        transaccionRepository.save(transaccion);
    }

    @Override
    public void deleteById(Long id) {
        transaccionRepository.deleteById(id);
    }
}
