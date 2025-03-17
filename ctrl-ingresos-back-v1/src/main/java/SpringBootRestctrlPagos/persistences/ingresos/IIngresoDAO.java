package SpringBootRestctrlPagos.persistences.ingresos;

import SpringBootRestctrlPagos.models.entities.ingresos.Ingreso;

import java.util.List;
import java.util.Optional;

public interface IIngresoDAO {
    List<Ingreso>findAllByUser(String username);
    List<Ingreso>findAllAndChildrenByUser(String username);
    Optional<Ingreso>findById(Long id);
    Optional<Ingreso>findIAndChildrenById(Long id);
    Long findMaxId();
    void saveOrUpdate(Ingreso ingreso);
    void deleteById(Long id);


}
