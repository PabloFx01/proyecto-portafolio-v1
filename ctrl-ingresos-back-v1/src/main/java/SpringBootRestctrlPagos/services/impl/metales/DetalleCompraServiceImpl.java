package SpringBootRestctrlPagos.services.impl.metales;

import SpringBootRestctrlPagos.controllers.dto.metales.DetalleCompraPromDTO;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.persistences.metales.*;
import SpringBootRestctrlPagos.services.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class DetalleCompraServiceImpl implements IDetalleCompraService {
    @Autowired
    private IDetalleCompraDAO detalleCompraDAO;

    @Override
    public List<DetalleCompra> findAll(Long idCompra) {
        return detalleCompraDAO.findAllAndChildren(idCompra);
    }

    @Override
    public ListadoPaginador<DetalleCompra> findAllWithPagination(Long idCompra,Long cantidad, int pagina, String filter) {
        ListadoPaginador<DetalleCompra> resultado = new ListadoPaginador<>();
        List<DetalleCompra> detalleCompraList = this.findAllAndChildren(idCompra);

        Long cantidadTotal = 0L;
        if (filter != null) {
            resultado.elementos = detalleCompraList.stream()
                    .filter(detalleCompra -> detalleCompra.getMetal().getNombre().toLowerCase().contains(filter.toLowerCase()))
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = detalleCompraList.stream()
                    .filter(detalleCompra -> detalleCompra.getMetal().getNombre().toLowerCase().contains(filter.toLowerCase()))
                    .count();
        } else {
            resultado.elementos = detalleCompraList.stream()
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(detalleCompraList.size());
        }
        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }


    @Override
    public List<DetalleCompra> findAllAndChildren(Long idCompra) {
        return detalleCompraDAO.findAllAndChildren(idCompra);
    }

    @Override
    public List<DetalleCompraPromDTO> findAVGDetallesCompraByIdVenta(Long idVenta) {
        return detalleCompraDAO.findAVGDetallesCompraByIdVenta(idVenta);
    }

    @Override
    public List<DetalleCompraPromDTO> findAVGDetallesCompraByIdVentaAndIsIndividual(Long idVenta) {
        return detalleCompraDAO.findAVGDetallesCompraByIdVentaAndIsIndividual(idVenta);
    }

    @Override
    public Optional<DetalleCompra> findByIdAndChildren(Long id, Long idCompra) {
        return detalleCompraDAO.findByIdAndChildren(id, idCompra);
    }
    @Override
    public Optional<DetalleCompra> findPorId(Long id, Long idCompra) {
        return detalleCompraDAO.findPorId(id, idCompra);
    }

    @Override
    public Long nextIdDetalleByIdCompra(Long idCompra) {
        return detalleCompraDAO.nextIdDetalleByIdCompra(idCompra);
    }

    @Override
    public void saveOrUpdate(DetalleCompra compra) {
        detalleCompraDAO.saveOrUpdate(compra);
    }

    @Override
    public void update(Long id, DetalleCompra compra) {

    }

    @Override
    public void deletePorId(Long id,Long idCompra) {
        detalleCompraDAO.deletePorId(id, idCompra);
    }

    @Override
    public void deleteById(DetalleCompraId detalleId) {
        detalleCompraDAO.deleteById(detalleId);
    }
}
