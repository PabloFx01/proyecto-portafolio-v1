package SpringBootRestctrlPagos.persistences.metales;


import SpringBootRestctrlPagos.models.entities.metales.Compra;

import java.util.List;
import java.util.Optional;

public interface ICompraDAO {
    List<Compra> findAll();
    List<Compra> findAllAndChildren();
    List<Compra> findAllAndChildrenByIdVenta(Long idVenta, String username);
    List<Compra> findAllAndChildrenNotIdVenta(String username);
    List<Compra> findAllAndChildrenWithVenta(String username);
    Optional<Compra> findByIdAndChildren(Long id) ;
    Optional<Compra> findById(Long id);
    Long findMaxId(String username);
    void saveOrUpdate(Compra compra);
    void deleteById(Long id);
}
