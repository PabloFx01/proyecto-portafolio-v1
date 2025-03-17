package SpringBootRestctrlPagos.persistences.ingresos;

import SpringBootRestctrlPagos.models.entities.ingresos.PctXConceptoId;
import SpringBootRestctrlPagos.models.entities.ingresos.PorcentajeXConcepto;

public interface IPorcentajeXConceptoDAO {

    void saveOrUpdate(PorcentajeXConcepto pct);

    void deleteById(PctXConceptoId id);


}
