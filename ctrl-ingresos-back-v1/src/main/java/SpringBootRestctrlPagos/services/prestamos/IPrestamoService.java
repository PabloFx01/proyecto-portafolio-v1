package SpringBootRestctrlPagos.services.prestamos;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.prestamos.Prestamo;

import java.util.List;
import java.util.Optional;

public interface IPrestamoService {
    List<Prestamo> findAllAndChildrenByUser(String username);
    List<Prestamo> findAllPaidAndChildrenByUser(String username);

    List<Prestamo> findAllNotPaidAndChildrenByUser(String username);

    public ListadoPaginador<Prestamo> findAllWithPaginationByUsername(Long cantidad, int pagina, String filter, String username, String state);

    Optional<Prestamo> findPAndChildrenById(Long id);
    Optional<Prestamo> findPById(Long id);

    Long findMaxId();

    void saveOrUpdate(Prestamo prestamo);

    void deleteById(Long id);
}
