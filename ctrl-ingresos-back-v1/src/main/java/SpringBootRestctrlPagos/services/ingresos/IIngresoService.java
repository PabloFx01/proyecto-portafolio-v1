package SpringBootRestctrlPagos.services.ingresos;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.ingresos.Ingreso;
import SpringBootRestctrlPagos.models.entities.servicios.Factura;

import java.util.List;
import java.util.Optional;

public interface IIngresoService {
    List<Ingreso> findAllByUser(String username);
    List<Ingreso>findAllAndChildrenByUser(String username);
    ListadoPaginador<Ingreso> findAllConsultaIngresoWithPaginador(Long cantidad, int pagina, String startDate, String endDate, String titulo, String username );
    List<Ingreso> findAllConsultaIngreso(Long cantidad, int pagina, String startDate, String endDate, String titulo, String username );
    Optional<Ingreso> findById(Long id);
    Optional<Ingreso>findIAndChildrenById(Long id);
    Long findMaxId();
    Ingreso AsociarConceptos(Ingreso ingreso, Long oldIdIngreso);
    void saveOrUpdate(Ingreso ingreso);
    void deleteById(Long id);
}
