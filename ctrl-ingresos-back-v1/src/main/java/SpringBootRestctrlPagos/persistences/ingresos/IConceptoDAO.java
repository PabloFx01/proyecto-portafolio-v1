package SpringBootRestctrlPagos.persistences.ingresos;

import SpringBootRestctrlPagos.models.entities.ingresos.Concepto;
import SpringBootRestctrlPagos.models.entities.ingresos.ConceptoId;

import java.util.List;
import java.util.Optional;

public interface IConceptoDAO {

    List<Concepto> findAll();
    List<Concepto> findAllByUser(String username);
    List<Concepto> findAllActByUser(String username);
    List<Concepto> findAllInacByUser(String username);
    Optional<Concepto> findById(ConceptoId conceptoId);
    Long findNextIdByUser(Long idUsuario);
    void saveOrUpdate(Concepto concepto);
    void deleteById(ConceptoId conceptoId);
}
