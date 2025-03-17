package SpringBootRestctrlPagos.services.ctrlEfectivo;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Transaccion;
import java.util.List;
import java.util.Optional;

public interface ITransaccionService {
    List<Transaccion> findAll();
    ListadoPaginador<Transaccion> findAllWithPagination(Long cantidad, int pagina, String filter);
    List<Transaccion> findAllAndChildren();
    Optional<Transaccion> findById(Long id);
    Optional<Transaccion> findByIdAndChildren(Long id);

    Long findMaxId() ;
    void saveOrUpdate(Transaccion transaccion);
    void deleteById(Long id);
}
