package SpringBootRestctrlPagos.services.impl.metales;

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
public class DetalleVentaServiceImpl implements IDetalleVentaService {
    @Autowired
    IDetalleVentaDAO detalleVentaDAO;

    @Override
    public ListadoPaginador<DetalleVenta> findAllWithPagination(Long idVenta, Long cantidad, int pagina, String filter) {
        ListadoPaginador<DetalleVenta> resultado = new ListadoPaginador<>();
        List<DetalleVenta> detalleVentaList = this.findAllAndChildren(idVenta);

        Long cantidadTotal = 0L;
        if (filter != null) {
            resultado.elementos = detalleVentaList.stream()
                    .filter(detalleVenta -> detalleVenta.getMetal().getNombre().toLowerCase().contains(filter.toLowerCase()))
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = detalleVentaList.stream()
                    .filter(detalleVenta -> detalleVenta.getMetal().getNombre().toLowerCase().contains(filter.toLowerCase()))
                    .count();
        } else {
            resultado.elementos = detalleVentaList.stream()
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(detalleVentaList.size());
        }
        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }

    @Override
    public List<DetalleVenta> findAllAndChildren(Long idVenta) {
        return detalleVentaDAO.findAllAndChildren(idVenta);
    }

    @Override
    public Optional<DetalleVenta> findByIdAndChildren(Long id, Long idVenta) {
        return detalleVentaDAO.findByIdAndChildren(id,idVenta);
    }

    @Override
    public Optional<DetalleVenta> findById(DetalleVentaId detalleVentaId) {
        return detalleVentaDAO.findById(detalleVentaId);
    }

    @Override
    public Long nextIdDetalleByIdVenta(Long idVenta) {
        return detalleVentaDAO.nextIdDetalleByIdVenta(idVenta);
    }

    @Override
    public void saveOrUpdate(DetalleVenta venta) {
        detalleVentaDAO.saveOrUpdate(venta);
    }

    @Override
    public void update(Long id, DetalleVenta detalleVenta) {

    }

    @Override
    public void deleteById(DetalleVentaId detalleId) {
        detalleVentaDAO.deleteById(detalleId);
    }
}
