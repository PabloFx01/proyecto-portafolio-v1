package SpringBootRestctrlPagos.services.ingresos;

import SpringBootRestctrlPagos.models.entities.ingresos.PctXConceptoId;
import SpringBootRestctrlPagos.models.entities.ingresos.PorcentajeXConcepto;

public interface IPctXConceptoService {

    void saveOrUpdate(PorcentajeXConcepto pct);

    void deleteById(PctXConceptoId id);
}
