package SpringBootRestctrlPagos.persistences.metales;

import SpringBootRestctrlPagos.models.entities.metales.Inventario;
import SpringBootRestctrlPagos.models.entities.metales.InventarioId;

import java.util.List;
import java.util.Optional;

public interface IInventarioDAO {

    List<Inventario> findAll();
    List<Inventario> findAllAndChildren(String username);
    Optional<Inventario> findByIdAndChildren(Long id, String metalId);
    Optional<Inventario> findByIdMetal(String metalId);
    Optional<Inventario> findById(InventarioId inventarioId);
    Long nextInventarioId(String username);
    void saveOrUpdate(Inventario inventario);
    void deleteById(InventarioId idInventario);
}
