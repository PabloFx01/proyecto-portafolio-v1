package SpringBootRestctrlPagos.persistences.impl.metales;

import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.persistences.metales.*;
import SpringBootRestctrlPagos.repositories.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class VentaDAOImpl implements IVentaDAO {
    @Autowired
    VentaRepository ventaRepository;

    @Override
    public List<Venta> findAll() {
        return (List<Venta>) ventaRepository.findAll();
    }

    @Override
    public List<Venta> findAllAndChildren(String username) {
        return ventaRepository.findAllAndChildren(username);
    }

    @Override
    public Optional<Venta> findByIdAndChildren(Long id) {
        return Optional.ofNullable(ventaRepository.findByIdAndChildren(id));
    }

    @Override
    public Optional<Venta> findById(Long id) {
        return ventaRepository.findById(id);
    }

    @Override
    public Long findMaxId() {
        return ventaRepository.findMaxId();
    }

    @Override
    public void saveOrUpdate(Venta venta) {
        ventaRepository.save(venta);
    }

    @Override
    public void deleteById(Long id) {
        ventaRepository.deleteById(id);
    }
}
