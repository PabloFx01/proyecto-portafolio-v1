package SpringBootRestctrlPagos.services.impl.servicios;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.servicios.DetalleFactura;
import SpringBootRestctrlPagos.models.entities.servicios.DetalleFacturaId;
import SpringBootRestctrlPagos.models.entities.servicios.Factura;
import SpringBootRestctrlPagos.persistences.servicios.IDetalleFacturaDAO;
import SpringBootRestctrlPagos.services.servicios.IDetalleFacturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DetalleFacturaServiceImpl implements IDetalleFacturaService {
    @Autowired
    private IDetalleFacturaDAO detalleFacturaDAO;
    @Override
    public List<DetalleFactura> findAllByIdFactura(Long idFactura) {
        return detalleFacturaDAO.findAllByIdFactura(idFactura);
    }

    @Override
    public ListadoPaginador<DetalleFactura> findAllWithPagination(Long idFactura,Long cantidad, int pagina) {
        ListadoPaginador<DetalleFactura> resultado = new ListadoPaginador<>();
        List<DetalleFactura> servicioList = this.findAllByIdFactura(idFactura);

        Long cantidadTotal = 0L;

        resultado.elementos = servicioList.stream()
                .skip(pagina * cantidad)
                .limit(cantidad)
                .collect(Collectors.toList());
        cantidadTotal = Long.valueOf(servicioList.size());

        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }

    @Override
    public Optional<DetalleFactura> findDFByIdAndIdFactura(Long id, Long idFactura) {
        return detalleFacturaDAO.findDIByIdAndIdFactura(id,idFactura);
    }

    @Override
    public Long findNextIdByIdFactura(Long idFactura) {
        return detalleFacturaDAO.findNextIdByIdFactura(idFactura);
    }

    @Override
    public void saveOrUpdate(DetalleFactura detalleFactura) {
        detalleFacturaDAO.saveOrUpdate(detalleFactura);
    }

    @Override
    public void deleteById(DetalleFacturaId detalleFacturaId) {
        detalleFacturaDAO.deleteById(detalleFacturaId);
    }
}
