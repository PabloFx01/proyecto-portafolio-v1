package SpringBootRestctrlPagos.persistences.servicios;

import SpringBootRestctrlPagos.models.entities.servicios.Factura;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface IFacturaDAO {
    List<Factura> findAllAndChildrenByUser(String username);
    List<Factura> findAllByUser(String username);
    List<Factura> findAllAndChildrenPaidByUser(String username);
    List<Factura> findAllAndChildrenNotPaidByUser(String username);
    List<Factura> findAllPaidByUser(String username);
    List<Factura> findAllNotPaidByUser(String username);
    List<Factura> findAllAndChildrenByUserAndService(String username, Long idService);
    List<Factura> findAllByUserAndService(String username, Long idService);
    List<Factura> findAllAndChildrenPaidByUserAndService(String username, Long idService);
    List<Factura> findAllAndChildrenNotPaidByUserAndService(String username, Long idService);
    List<Factura> findAllPaidByUserAndService(String username, Long idService);
    List<Factura> findAllNotPaidByUserAndService(String username, Long idService);
    Optional<Factura> findFAndChildrenById(Long id);
    Optional<Factura> findFById(Long id);
    Long findMaxId() ;
    void saveOrUpdate(Factura factura);
    void deleteById(Long idFactura);
}
