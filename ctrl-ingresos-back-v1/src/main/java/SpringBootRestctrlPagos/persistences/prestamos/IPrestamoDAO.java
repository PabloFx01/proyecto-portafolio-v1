package SpringBootRestctrlPagos.persistences.prestamos;

import SpringBootRestctrlPagos.models.entities.prestamos.Prestamo;

import java.util.List;
import java.util.Optional;

public interface IPrestamoDAO {
    List<Prestamo> findAllAndChildrenByUser(String username);
    List<Prestamo> findAllPaidAndChildrenByUser(String username);

    List<Prestamo> findAllNotPaidAndChildrenByUser(String username);

    Optional<Prestamo> findPAndChildrenById(Long id);
    Optional<Prestamo> findPById(Long id);

    Long findMaxId();

    void saveOrUpdate(Prestamo prestamo);

    void deleteById(Long id);


}
