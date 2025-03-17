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
public class MetalVentaServiceImpl implements IMetalVentaService {
    @Autowired
    IMetalVentaDAO metalVentaDAO;

    @Override
    public ListadoPaginador<MetalVenta> findAllWithPagination(String idMetalCompra,
                                                              Long cantidad, int pagina, String filter) {
        ListadoPaginador<MetalVenta> resultado = new ListadoPaginador<>();
        List<MetalVenta> metalVentaList = this.findAllByIdMetalCompra(idMetalCompra);

        Long cantidadTotal = 0L;
        if (filter != null) {
            resultado.elementos = metalVentaList.stream()
                    .filter(metalVenta -> metalVenta.getDescripcion().toLowerCase().contains(filter.toLowerCase()))
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = metalVentaList.stream()
                    .filter(metalVenta -> metalVenta.getDescripcion().toLowerCase().contains(filter.toLowerCase()))
                    .count();
        } else {
            resultado.elementos = metalVentaList.stream()
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(metalVentaList.size());
        }
        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }

    @Override
    public List<MetalVenta> findAllByIdMetalCompra(String idMetalCompra) {
        return metalVentaDAO.findAllByIdMetalCompra(idMetalCompra);
    }

    @Override
    public Optional<MetalVenta> findById(MetalVentaId metalVentaId) {
        return metalVentaDAO.findById(metalVentaId);
    }

    @Override
    public Long nextMetalVentaIdByIdMetalCompra(String idMetalCompra) {
        return metalVentaDAO.nextMetalVentaIdByIdMetalCompra(idMetalCompra);
    }

    @Override
    public void saveOrUpdate(MetalVenta metalVenta) {
        metalVentaDAO.saveOrUpdate(metalVenta);
    }

    @Override
    public void update(MetalVentaId metalVentaId, MetalVenta detalleVenta) {

    }

    @Override
    public void deleteById(MetalVentaId metalVentaId) {
        metalVentaDAO.deleteById(metalVentaId);
    }
}
