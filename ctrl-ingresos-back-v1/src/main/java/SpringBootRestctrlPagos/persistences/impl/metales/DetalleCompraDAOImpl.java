package SpringBootRestctrlPagos.persistences.impl.metales;

import SpringBootRestctrlPagos.controllers.dto.metales.DetalleCompraPromDTO;
import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.persistences.metales.*;
import SpringBootRestctrlPagos.repositories.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class DetalleCompraDAOImpl implements IDetalleCompraDAO {
    @Autowired
    private DetalleCompraRepository detalleCompraRepository;

    @Override
    public List<DetalleCompra> findAll() {
        return (List<DetalleCompra>) detalleCompraRepository.findAll();
    }

    @Override
    public List<DetalleCompra> findAllAndChildren(Long idCompra) {
        return (List<DetalleCompra>) detalleCompraRepository.findAllAndChildren(idCompra);
    }

    @Override
    public List<DetalleCompraPromDTO> findAVGDetallesCompraByIdVenta(Long idVenta) {
        List<Object[]> results = detalleCompraRepository.findAVGDetallesCompraByIdVenta(idVenta);
        return results.stream().map(result -> {
            DetalleCompraPromDTO dto = new DetalleCompraPromDTO();
            dto.setMetalId(((String) result[0]).toString());
            dto.setAvgMetalCompra(((Number) result[1]).doubleValue());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<DetalleCompraPromDTO> findAVGDetallesCompraByIdVentaAndIsIndividual(Long idVenta) {
        List<Object[]> results = detalleCompraRepository.findAVGDetallesCompraByIdVentaAndIsIndividual(idVenta);
        return results.stream().map(result -> {
            DetalleCompraPromDTO dto = new DetalleCompraPromDTO();
            dto.setMetalId(((String) result[0]).toString());
            dto.setAvgMetalCompra(((Number) result[1]).doubleValue());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public Optional<DetalleCompra> findByIdAndChildren(Long id, Long idCompra) {
        return Optional.ofNullable(detalleCompraRepository.findByIdAndChildren(id, idCompra));
    }
    @Override
    public Optional<DetalleCompra> findPorId(Long id, Long idCompra) {
        return Optional.ofNullable(detalleCompraRepository.findPorId(id, idCompra));
    }

    @Override
    public Long nextIdDetalleByIdCompra(Long idCompra) {
        return detalleCompraRepository.nextIdDetalleByIdCompra(idCompra);
    }

    @Override
    public void saveOrUpdate(DetalleCompra DetalleCompra) {
        detalleCompraRepository.save(DetalleCompra);
    }

    @Override
    public void deletePorId(Long id,Long idCompra ) {
        detalleCompraRepository.deletePorId(id,idCompra);
    }

    @Override
    public void deleteById(DetalleCompraId detalleId) {
        detalleCompraRepository.deleteById(detalleId);
    }
}
