package SpringBootRestctrlPagos.persistences.impl.metales;

import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.persistences.metales.*;
import SpringBootRestctrlPagos.repositories.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
@Component
public class MetalVentaDAOImpl implements IMetalVentaDAO {
    @Autowired
    MetalVentaRepository metalVentaRepository;

    @Override
    public List<MetalVenta> findAll() {
        return (List<MetalVenta>) metalVentaRepository.findAll();
    }

    @Override
    public List<MetalVenta> findAllByIdMetalCompra(String idMetalCompra) {
        return metalVentaRepository.findAllByIdMetalCompra(idMetalCompra);
    }

    @Override
    public Optional<MetalVenta> findById(MetalVentaId metalVentaId) {
        return metalVentaRepository.findById(metalVentaId);
    }

    @Override
    public Long nextMetalVentaIdByIdMetalCompra(String idMetalCompra) {
        return metalVentaRepository.nextMetalVentaIdByIdMetalCompra(idMetalCompra);
    }

    @Override
    public void saveOrUpdate(MetalVenta metalVenta) {
        metalVentaRepository.save(metalVenta);
    }

    @Override
    public void deleteById(MetalVentaId metalVentaId) {
        metalVentaRepository.deleteById(metalVentaId);
    }
}
