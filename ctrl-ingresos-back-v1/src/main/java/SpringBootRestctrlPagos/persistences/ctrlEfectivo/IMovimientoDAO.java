package SpringBootRestctrlPagos.persistences.ctrlEfectivo;

import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Movimiento;

import java.util.List;
import java.util.Optional;

public interface IMovimientoDAO {

    List<Movimiento> findAll();
    List<Movimiento> findAllAndChildrenByUsername(String username);
    List<Movimiento> findAllAndChildrenByUsernameAsc(String username);
    Optional<Movimiento> findById( Long id);
    List<Movimiento> findByIdSobreAndChildren( Long id);
    void saveOrUpdate(Movimiento movimiento);
    void deleteById(Long id);

}
