package SpringBootRestctrlPagos.persistences.impl.ingresos;

import SpringBootRestctrlPagos.models.entities.ingresos.DetalleIngreso;
import SpringBootRestctrlPagos.models.entities.ingresos.DetalleIngresoId;
import SpringBootRestctrlPagos.persistences.ingresos.IDetalleIngresoDAO;
import SpringBootRestctrlPagos.repositories.ingresos.DetalleIngresoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
@Component
public class DetalleIngresoDAOImpl implements IDetalleIngresoDAO {
    @Autowired
    private DetalleIngresoRepository dIngresoRepository;


    @Override
    public List<DetalleIngreso> findAllByIdIngreso(Long idIngreso) {
        return null;
    }

    @Override
    public List<DetalleIngreso> findAllAndChildrenByIdIngreso(Long idIngreso) {
        return dIngresoRepository.findAllAndChildrenByIdIngreso(idIngreso);
    }

    @Override
    public Optional<DetalleIngreso> findDIAndChildrenByIdAndIdIngreso(Long id, Long idIngreso) {
        return Optional.ofNullable(dIngresoRepository.findDIAndChildrenByIdAndIdIngreso(id, idIngreso));
    }

    @Override
    public Optional<DetalleIngreso> findDIAndChildrenByConceptoAndIdIngreso(String concepto, Long idIngreso) {
        return Optional.ofNullable(dIngresoRepository.findDIAndChildrenByConceptoAndIdIngreso(concepto, idIngreso));
    }

    @Override
    public Long findMaxIdByIdIngreso(Long idIngreso) {
        return dIngresoRepository.findMaxIdByIdIngreso(idIngreso);
    }

    @Override
    public void saveOrUpdate(DetalleIngreso dIngreso) {
        dIngresoRepository.save(dIngreso);
    }

    @Override
    public void deleteById(DetalleIngresoId id) {
        dIngresoRepository.deleteById(id);
    }

    @Override
    public void updateTotalRestByIdIngreso(Long idIngreso) {
        dIngresoRepository.updateTotalRestByIdIngreso(idIngreso);
    }

}
