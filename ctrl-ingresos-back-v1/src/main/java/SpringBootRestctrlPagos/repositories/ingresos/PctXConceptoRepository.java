package SpringBootRestctrlPagos.repositories.ingresos;

import SpringBootRestctrlPagos.models.entities.ingresos.PctXConceptoId;
import SpringBootRestctrlPagos.models.entities.ingresos.PorcentajeXConcepto;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PctXConceptoRepository extends CrudRepository<PorcentajeXConcepto, PctXConceptoId> {

}
