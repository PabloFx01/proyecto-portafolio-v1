package SpringBootRestctrlPagos.persistences.impl.ingresos;

import SpringBootRestctrlPagos.models.entities.ingresos.Concepto;
import SpringBootRestctrlPagos.models.entities.ingresos.ConceptoId;
import SpringBootRestctrlPagos.persistences.ingresos.IConceptoDAO;
import SpringBootRestctrlPagos.repositories.ingresos.ConceptoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
@Component
public class ConceptoDAOImpl implements IConceptoDAO {
    @Autowired
    private ConceptoRepository conceptoRepository;
    @Override
    public List<Concepto> findAll() {
        return (List<Concepto>) conceptoRepository.findAll();
    }

    @Override
    public List<Concepto> findAllByUser(String username) {
        return conceptoRepository.findAllByUser(username);
    }

    @Override
    public List<Concepto> findAllActByUser(String username) {
        return conceptoRepository.findAllActByUser(username);
    }

    @Override
    public List<Concepto> findAllInacByUser(String username) {
        return conceptoRepository.findAllInacByUser(username);
    }

    @Override
    public Optional<Concepto> findById(ConceptoId conceptoId) {
        return conceptoRepository.findById(conceptoId);
    }

    @Override
    public Long findNextIdByUser(Long idUsuario) {
        return conceptoRepository.findNextIdByUser(idUsuario);
    }

    @Override
    public void saveOrUpdate(Concepto concepto) {
        conceptoRepository.save(concepto);
    }

    @Override
    public void deleteById(ConceptoId conceptoId) {
        conceptoRepository.deleteById(conceptoId);
    }
}
