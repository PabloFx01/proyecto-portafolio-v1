package SpringBootRestctrlPagos.services.metales;

import SpringBootRestctrlPagos.models.FechaCompraAsociada;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.metales.*;

import java.util.List;
import java.util.Optional;

public interface IVentaService {
    List<Venta> findAll();

    ListadoPaginador<Venta> findAllWithPagination(Long cantidad, int pagina, String filter, String username);

    public List<Venta>findAllAndChildren(String username);

    Optional<Venta> findById(Long id);

    Optional<Venta> findByIdAndChildren(Long id);

    Long findMaxId();
    void asociarComprasDiariasByIdVenta(Long id);

    FechaCompraAsociada findFechasCompraAsociadasByIdVenta(Long id);

    void saveOrUpdate(Venta venta);

    void update(Long id, Venta venta);

    void deleteById(Long id);


}
