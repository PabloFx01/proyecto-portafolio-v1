package SpringBootRestctrlPagos.services.metales;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.metales.*;

import java.util.List;
import java.util.Optional;

public interface IInventarioService {
    List<Inventario> findAll();
    List<Inventario> findAllAndChildren(String username);
    ListadoPaginador<Inventario> findAllWithPagination(Long cantidad, int pagina, String filter, String usuario);
    Optional<Inventario> findByIdAndChildren(Long id, String metalId);
    Optional<Inventario> findById(InventarioId inventarioId);
    Optional<Inventario> findByIdMetal(String metalId);
    Long nextInventarioId(String username);
    void saveOrUpdate(Inventario inventario);
    void deleteById(InventarioId inventarioId);
    void update(Long id, String metalId, Inventario inventario);
    void calcularInventario(Long idCompra);
}
