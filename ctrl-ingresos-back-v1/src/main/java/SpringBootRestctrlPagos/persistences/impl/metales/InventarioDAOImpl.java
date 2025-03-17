package SpringBootRestctrlPagos.persistences.impl.metales;

import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.persistences.metales.*;
import SpringBootRestctrlPagos.repositories.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class InventarioDAOImpl implements IInventarioDAO {
    @Autowired
    private InventarioRepository inventarioRepository;

    @Override
    public List<Inventario> findAll() {
        return (List<Inventario>) inventarioRepository.findAll();
    }

    @Override
    public List<Inventario> findAllAndChildren(String username) {
        return inventarioRepository.findAllAndChildren(username);
    }

    @Override
    public Optional<Inventario> findByIdAndChildren(Long id, String metalId) {
        return Optional.ofNullable(inventarioRepository.findByIdAndChildren(id, metalId));
    }

    @Override
    public Optional<Inventario> findByIdMetal(String metalId) {
        return Optional.ofNullable(inventarioRepository.findByIdMetal(metalId));
    }

    @Override
    public Optional<Inventario> findById(InventarioId inventarioId) {
        return inventarioRepository.findById(inventarioId);
    }

    @Override
    public Long nextInventarioId(String username) {
        return inventarioRepository.nextInventarioId(username);
    }

    @Override
    public void saveOrUpdate(Inventario inventario) {
        inventarioRepository.save(inventario);
    }

    @Override
    public void deleteById(InventarioId idInventario) {
        inventarioRepository.deleteById(idInventario);
    }
}
