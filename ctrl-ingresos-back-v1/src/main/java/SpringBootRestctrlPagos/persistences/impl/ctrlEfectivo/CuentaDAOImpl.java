package SpringBootRestctrlPagos.persistences.impl.ctrlEfectivo;

import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Cuenta;
import SpringBootRestctrlPagos.persistences.ctrlEfectivo.ICuentaDAO;
import SpringBootRestctrlPagos.repositories.ctrlEfectivo.CuentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class CuentaDAOImpl implements ICuentaDAO {

    @Autowired
    private CuentaRepository cuentaRepository;

    @Override
    public List<Cuenta> findAll() {
        return (List<Cuenta>) cuentaRepository.findAll();
    }

    @Override
    public List<Cuenta> findAllFromSobreActByUsername(String username) {
        return cuentaRepository.findAllFromSobreActByUsername(username);
    }

    @Override
    public Optional<Cuenta> findById(Long id) {
        return Optional.ofNullable(cuentaRepository.findCAndChildrenById(id));
    }

    @Override
    public Optional<Cuenta> findByIdSobre(Long id) {
        return Optional.ofNullable(cuentaRepository.findByIdSobre(id));
    }

    @Override
    public Long findMaxId() {
        return cuentaRepository.findMaxId();
    }

    @Override
    public void saveOrUpdate(Cuenta cuenta) {
        cuentaRepository.save(cuenta);
    }

    @Override
    public void deleteById(Long id) {
        cuentaRepository.deleteById(id);
    }
}
