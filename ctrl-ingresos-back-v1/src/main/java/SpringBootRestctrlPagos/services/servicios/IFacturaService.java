package SpringBootRestctrlPagos.services.servicios;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.servicios.Factura;

import java.util.List;
import java.util.Optional;

public interface IFacturaService {
    List<Factura> findAllAndChildrenByUser(String username);
    List<Factura> findAllByUser(String username);
    List<Factura> findAllAndChildrenPaidByUser(String username);
    List<Factura> findAllAndChildrenNotPaidByUser(String username);
    List<Factura> findAllPaidByUser(String username);
    List<Factura> findAllNotPaidByUser(String username);
    ListadoPaginador<Factura> findAllWithPagination(Long cantidad, int pagina, String state, String username);
    ListadoPaginador<Factura> findAllWithPaginationByServicio(Long cantidad, int pagina, String state, String username, Long idService );
    ListadoPaginador<Factura> findAllConsultaFacturaWithPaginador(Long cantidad, int pagina, String startDate, String endDate,  String idServicio, boolean state ,String username );
    List<Factura> findAllAndChildrenByUserAndService(String username, Long idService);
    List<Factura> findAllByUserAndService(String username, Long idService);
    List<Factura> findAllAndChildrenPaidByUserAndService(String username, Long idService);
    List<Factura> findAllAndChildrenNotPaidByUserAndService(String username, Long idService);
    List<Factura> findAllPaidByUserAndService(String username, Long idService);
    List<Factura> findAllNotPaidByUserAndService(String username, Long idService);
    Optional<Factura> findFAndChildrenPaidByUserAndService(String username, Long idService);
    Optional<Factura> findFAndChildrenById(Long id);
    Optional<Factura> findFById(Long id);
    Long findMaxId() ;
    void saveOrUpdate(Factura factura);
    void deleteById(Long idFactura);
}
