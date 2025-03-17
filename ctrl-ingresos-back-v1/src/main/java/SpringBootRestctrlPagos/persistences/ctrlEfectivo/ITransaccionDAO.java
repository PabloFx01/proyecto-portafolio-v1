package SpringBootRestctrlPagos.persistences.ctrlEfectivo;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Transaccion;
import java.util.List;
import java.util.Optional;

public interface ITransaccionDAO {

    List<Transaccion> findAll();
    List<Transaccion> findAllAndChildren();
    Optional<Transaccion> findById( Long id);
    Optional<Transaccion> findByIdAndChildren( Long id);

    Long findMaxId() ;
    void saveOrUpdate(Transaccion transaccion);
    void deleteById(Long id);

}
