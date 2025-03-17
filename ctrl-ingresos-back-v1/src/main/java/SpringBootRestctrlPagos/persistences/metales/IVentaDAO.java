package SpringBootRestctrlPagos.persistences.metales;
import SpringBootRestctrlPagos.models.entities.metales.Venta;

import java.util.List;
import java.util.Optional;

public interface IVentaDAO {
    List<Venta> findAll();
    List<Venta> findAllAndChildren(String username);
    Optional<Venta> findByIdAndChildren(Long id) ;
    Optional<Venta> findById(Long id);
    Long findMaxId();
    void saveOrUpdate(Venta venta);
    void deleteById(Long id);
}
