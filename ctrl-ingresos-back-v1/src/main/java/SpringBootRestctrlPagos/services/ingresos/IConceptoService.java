package SpringBootRestctrlPagos.services.ingresos;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.ingresos.Concepto;
import SpringBootRestctrlPagos.models.entities.ingresos.ConceptoId;

import java.util.List;
import java.util.Optional;

public interface IConceptoService {
    List<Concepto> findAll();
    List<Concepto> findAllByUser(String username);
    List<Concepto> findAllActByUser(String username);
    List<Concepto> findAllInacByUser(String username);
    ListadoPaginador<Concepto> findAllWithPagination(Long cantidad, int pagina, String state, String username, String filter);
    Optional<Concepto> findById(ConceptoId conceptoId);
    Long findNextIdByUser(Long idUsuario);
    void saveOrUpdate(Concepto concepto);
    void deleteById(ConceptoId conceptoId);
    void softDeleteById(ConceptoId conceptoId);
}
