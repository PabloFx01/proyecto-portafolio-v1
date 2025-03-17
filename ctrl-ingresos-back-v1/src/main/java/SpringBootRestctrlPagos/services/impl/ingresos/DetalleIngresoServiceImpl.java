package SpringBootRestctrlPagos.services.impl.ingresos;

import SpringBootRestctrlPagos.models.entities.ingresos.DetalleIngreso;
import SpringBootRestctrlPagos.models.entities.ingresos.DetalleIngresoId;
import SpringBootRestctrlPagos.persistences.ingresos.IDetalleIngresoDAO;
import SpringBootRestctrlPagos.services.ingresos.IDetalleIngresoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DetalleIngresoServiceImpl implements IDetalleIngresoService {
    @Autowired
    private IDetalleIngresoDAO detalleIngresoDAO;
    @Override
    public List<DetalleIngreso> findAllByIdIngreso(Long idIngreso) {
        return detalleIngresoDAO.findAllByIdIngreso(idIngreso);
    }

    @Override
    public List<DetalleIngreso> findAllAndChildrenByIdIngreso( Long idIngreso) {
        return detalleIngresoDAO.findAllAndChildrenByIdIngreso(idIngreso);
    }

    @Override
    public Optional<DetalleIngreso> findDIAndChildrenByIdAndIdIngreso(Long id, Long idIngreso) {
        return detalleIngresoDAO.findDIAndChildrenByIdAndIdIngreso(id, idIngreso);
    }

    @Override
    public Optional<DetalleIngreso> findDIAndChildrenByConceptoAndIdIngreso(String concepto, Long idIngreso) {
        return detalleIngresoDAO.findDIAndChildrenByConceptoAndIdIngreso(concepto, idIngreso);
    }

    @Override
    public Long findMaxIdByIdIngreso(Long idIngreso) {
        return detalleIngresoDAO.findMaxIdByIdIngreso(idIngreso);
    }

    @Override
    public void saveOrUpdate(DetalleIngreso dIngreso) {
        detalleIngresoDAO.saveOrUpdate(dIngreso);
    }

    @Override
    public void deleteById(DetalleIngresoId id) {
        detalleIngresoDAO.deleteById(id);
    }

    @Override
    public void updateTotalRestByIdIngreso(Long idIngreso) {
        detalleIngresoDAO.updateTotalRestByIdIngreso(idIngreso);
    }
}
