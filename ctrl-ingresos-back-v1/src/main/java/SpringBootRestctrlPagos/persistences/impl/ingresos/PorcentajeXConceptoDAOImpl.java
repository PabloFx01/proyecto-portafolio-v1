package SpringBootRestctrlPagos.persistences.impl.ingresos;

import SpringBootRestctrlPagos.models.entities.ingresos.PctXConceptoId;
import SpringBootRestctrlPagos.models.entities.ingresos.PorcentajeXConcepto;
import SpringBootRestctrlPagos.persistences.ingresos.IPorcentajeXConceptoDAO;
import SpringBootRestctrlPagos.repositories.ingresos.PctXConceptoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PorcentajeXConceptoDAOImpl implements IPorcentajeXConceptoDAO {
    @Autowired
    private PctXConceptoRepository pctXConceptoRepository;
    @Override
    public void saveOrUpdate(PorcentajeXConcepto pct) {
        pctXConceptoRepository.save(pct);
    }

    @Override
    public void deleteById(PctXConceptoId id) {
        pctXConceptoRepository.deleteById(id);
    }
}
