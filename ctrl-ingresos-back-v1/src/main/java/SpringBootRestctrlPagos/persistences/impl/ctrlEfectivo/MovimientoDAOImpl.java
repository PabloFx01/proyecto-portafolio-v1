package SpringBootRestctrlPagos.persistences.impl.ctrlEfectivo;

import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Movimiento;
import SpringBootRestctrlPagos.persistences.ctrlEfectivo.IMovimientoDAO;
import SpringBootRestctrlPagos.repositories.ctrlEfectivo.MovimientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class MovimientoDAOImpl implements IMovimientoDAO {

    @Autowired
    private MovimientoRepository movimientoRepository;

    @Override
    public List<Movimiento> findAll() {
        return (List<Movimiento>) movimientoRepository.findAll();
    }

    @Override
    public List<Movimiento> findAllAndChildrenByUsername(String username) {
        return movimientoRepository.findAllAndChildrenByUsername(username);
    }

    @Override
    public List<Movimiento> findAllAndChildrenByUsernameAsc(String username) {
        return movimientoRepository.findAllAndChildrenByUsernameAsc(username);
    }

    @Override
    public Optional<Movimiento> findById(Long id) {
        return Optional.ofNullable(movimientoRepository.findByIdAndChildren(id));
    }

    @Override
    public List<Movimiento> findByIdSobreAndChildren(Long id) {
        return movimientoRepository.findByIdSobreAndChildren(id);
    }

    @Override
    public void saveOrUpdate(Movimiento movimiento) {
        movimientoRepository.save(movimiento);
    }

    @Override
    public void deleteById(Long id) {
        movimientoRepository.deleteById(id);
    }
}
