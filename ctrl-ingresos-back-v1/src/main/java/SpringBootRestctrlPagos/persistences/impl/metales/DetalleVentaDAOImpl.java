package SpringBootRestctrlPagos.persistences.impl.metales;

import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.persistences.metales.*;
import SpringBootRestctrlPagos.repositories.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
@Component
public class DetalleVentaDAOImpl implements IDetalleVentaDAO {
    @Autowired
    DetalleVentaRepository detalleVentaRepository;

    @Override
    public List<DetalleVenta> findAll() {
        return (List<DetalleVenta>) detalleVentaRepository.findAll();
    }

    @Override
    public List<DetalleVenta> findAllAndChildren(Long idVenta) {
        return detalleVentaRepository.findAllAndChildren(idVenta);
    }

    @Override
    public Optional<DetalleVenta> findByIdAndChildren(Long id, Long idVenta) {
        return Optional.ofNullable(detalleVentaRepository.findByIdAndChildren(id, idVenta));
    }

    @Override
    public Optional<DetalleVenta> findById(DetalleVentaId detalleVentaId) {
        return detalleVentaRepository.findById(detalleVentaId);
    }

    @Override
    public Long nextIdDetalleByIdVenta(Long idVenta) {
        return detalleVentaRepository.nextIdDetalleByIdVenta(idVenta);
    }

    @Override
    public void saveOrUpdate(DetalleVenta detalleVenta) {
        detalleVentaRepository.save(detalleVenta);
    }

    @Override
    public void deleteById(DetalleVentaId detalleId) {
        detalleVentaRepository.deleteById(detalleId);
    }
}
