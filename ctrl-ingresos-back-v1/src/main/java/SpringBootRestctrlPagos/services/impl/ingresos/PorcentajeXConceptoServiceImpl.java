package SpringBootRestctrlPagos.services.impl.ingresos;

import SpringBootRestctrlPagos.models.entities.ingresos.PctXConceptoId;
import SpringBootRestctrlPagos.models.entities.ingresos.PorcentajeXConcepto;
import SpringBootRestctrlPagos.persistences.ingresos.IPorcentajeXConceptoDAO;
import SpringBootRestctrlPagos.services.ingresos.IPctXConceptoService;
import org.springframework.beans.factory.annotation.Autowired;

public class PorcentajeXConceptoServiceImpl implements IPctXConceptoService {
    @Autowired
    private IPorcentajeXConceptoDAO pctDao;
    @Override
    public void saveOrUpdate(PorcentajeXConcepto pct) {
        pctDao.saveOrUpdate(pct);
    }

    @Override
    public void deleteById(PctXConceptoId id) {
        pctDao.deleteById(id);
    }
}
