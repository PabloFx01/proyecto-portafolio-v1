package SpringBootRestctrlPagos.services.impl.metales;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.persistences.metales.*;
import SpringBootRestctrlPagos.services.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CompraServiceImpl implements ICompraService {
    @Autowired
    private ICompraDAO compraDAO;
    @Autowired
    private IDetalleCompraDAO detalleCompraDAO;

    @Override
    public List<Compra> findAll() {
        return compraDAO.findAll();
    }

    @Override
    public ListadoPaginador<Compra> findAllWithPagination(Long cantidad, int pagina, String username) {
        ListadoPaginador<Compra> resultado = new ListadoPaginador<>();
        List<Compra> compraList = this.findAllAndChildrenNotIdVenta(username);

        Long cantidadTotal = 0L;
        resultado.elementos = compraList.stream()
                .skip(pagina * cantidad)
                .limit(cantidad)
                .collect(Collectors.toList());
        cantidadTotal = Long.valueOf(compraList.size());

        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }

    @Override
    public ListadoPaginador<Compra> findAllWithVentaPagination(Long cantidad,
                                                               int pagina,
                                                               String startBuyFilter,
                                                               String endBuyFilter,
                                                               String startSaleFilter,
                                                               String endSaleFilter,
                                                               String descriptionSaleFilter,
                                                               String username) {
        ListadoPaginador<Compra> resultado = new ListadoPaginador<>();
        List<Compra> compraList = this.findAllAndChildrenWithVenta(username);
        Long cantidadTotal = 0L;
        LocalDate nStartBuyFilter = null;
        LocalDate nEndBuyFilter = null;
        LocalDate nStartSaleFilter = null;
        LocalDate nEndSaleFilter = null;

        if (startBuyFilter != null) {
            if (!startBuyFilter.equals("not")) {
                nStartBuyFilter = LocalDate.parse(startBuyFilter);
            }
        }

        if (endBuyFilter != null) {
            if (!endBuyFilter.equals("not")) {
                nEndBuyFilter = LocalDate.parse(endBuyFilter);
            }
        }

        if (startSaleFilter != null) {
            if (!startSaleFilter.equals("not")) {
                nStartSaleFilter = LocalDate.parse(startSaleFilter);
            }
        }

        if (endSaleFilter != null) {
            if (!endSaleFilter.equals("not")) {
                nEndSaleFilter = LocalDate.parse(endSaleFilter);
            }
        }

        if (nStartBuyFilter != null &&
                nEndBuyFilter != null) {
            resultado.elementos = compraList.stream()
                    .filter(compra -> dateToLD(compra.getFechaCompra()).isAfter(LocalDate.parse(startBuyFilter))
                            && dateToLD(compra.getFechaCompra()).isBefore(LocalDate.parse(endBuyFilter)))
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = compraList.stream()
                    .filter(compra -> dateToLD(compra.getFechaCompra()).isAfter(LocalDate.parse(startBuyFilter))
                            && dateToLD(compra.getFechaCompra()).isBefore(LocalDate.parse(endBuyFilter)))
                    .count();
        } else if (nStartSaleFilter != null &&
                nEndSaleFilter != null) {
            resultado.elementos = compraList.stream()
                    .filter(compra -> dateToLD(compra.getVenta().getFechaVenta()).isAfter(LocalDate.parse(startSaleFilter))
                            && dateToLD(compra.getVenta().getFechaVenta()).isBefore(LocalDate.parse(endSaleFilter)))
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = compraList.stream()
                    .filter(compra -> dateToLD(compra.getVenta().getFechaVenta()).isAfter(LocalDate.parse(startSaleFilter))
                            && dateToLD(compra.getVenta().getFechaVenta()).isBefore(LocalDate.parse(endSaleFilter)))
                    .count();
        } else if (descriptionSaleFilter != null) {

            resultado.elementos = compraList.stream()
                    .filter(compra -> compra.getVenta().getDescripcion().toLowerCase().contains(descriptionSaleFilter.toLowerCase()))
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = compraList.stream()
                    .filter(compra -> compra.getVenta().getDescripcion().toLowerCase().contains(descriptionSaleFilter.toLowerCase()))
                    .count();
        }
        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }


    @Override
    public List<Compra> findAllWithVenta(Long cantidad,
                                         int pagina,
                                         String startBuyFilter,
                                         String endBuyFilter,
                                         String startSaleFilter,
                                         String endSaleFilter,
                                         String descriptionSaleFilter,
                                         String username) {
        List<Compra> resultado = new ArrayList<>();
        List<Compra> compraList = this.findAllAndChildrenWithVenta(username);

        LocalDate nStartBuyFilter = null;
        LocalDate nEndBuyFilter = null;
        LocalDate nStartSaleFilter = null;
        LocalDate nEndSaleFilter = null;

        if (startBuyFilter != null) {
            if (!startBuyFilter.equals("not")) {
                nStartBuyFilter = LocalDate.parse(startBuyFilter);
            }
        }

        if (endBuyFilter != null) {
            if (!endBuyFilter.equals("not")) {
                nEndBuyFilter = LocalDate.parse(endBuyFilter);
            }
        }

        if (startSaleFilter != null) {
            if (!startSaleFilter.equals("not")) {
                nStartSaleFilter = LocalDate.parse(startSaleFilter);
            }
        }

        if (endSaleFilter != null) {
            if (!endSaleFilter.equals("not")) {
                nEndSaleFilter = LocalDate.parse(endSaleFilter);
            }
        }

        if (nStartBuyFilter != null &&
                nEndBuyFilter != null) {
            resultado = compraList.stream()
                    .filter(compra -> dateToLD(compra.getFechaCompra()).isAfter(LocalDate.parse(startBuyFilter))
                            && dateToLD(compra.getFechaCompra()).isBefore(LocalDate.parse(endBuyFilter)))
                    .collect(Collectors.toList());
        } else if (nStartSaleFilter != null &&
                nEndSaleFilter != null) {
            resultado = compraList.stream()
                    .filter(compra -> dateToLD(compra.getVenta().getFechaVenta()).isAfter(LocalDate.parse(startSaleFilter))
                            && dateToLD(compra.getVenta().getFechaVenta()).isBefore(LocalDate.parse(endSaleFilter)))
                    .collect(Collectors.toList());
        } else if (descriptionSaleFilter != null) {

            resultado = compraList.stream()
                    .filter(compra -> compra.getVenta().getDescripcion().toLowerCase().contains(descriptionSaleFilter.toLowerCase()))
                    .collect(Collectors.toList());
        }
        return resultado;
    }

    public static LocalDate dateToLD(Date date) {

        LocalDate nDate = date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
        return nDate;
    }

    @Override
    public Optional<Compra> findById(Long id) {
        return compraDAO.findById(id);
    }

    @Override
    public Optional<Compra> findByIdAndChildren(Long id) {
        return compraDAO.findByIdAndChildren(id);
    }

    @Override
    public Long findMaxId(String username) {
        return compraDAO.findMaxId(username);
    }

    @Override
    public void cerrarDia(Long id) {
        Optional<Compra> compraOptional = this.findByIdAndChildren(id);
        if (compraOptional.isPresent()) {
            Compra compra = compraOptional.get();
            List<DetalleCompra> detalleCompraList = detalleCompraDAO.findAllAndChildren(id);
            Double totalComprado = detalleCompraList.stream()
                    .mapToDouble(detalle ->
                            detalle.getImporte().doubleValue()
                    ).sum();
            compra.setTotalComprado(BigDecimal.valueOf(totalComprado));
            compra.setCierre(true);
            compra.setEditadoPor("Automático");
            compra.setModificadoEl(new Date());
            this.saveOrUpdate(compra);
        }
    }

    @Override
    public List<Compra> findAllAndChildren() {
        return compraDAO.findAllAndChildren();
    }

    @Override
    public List<Compra> findAllAndChildrenByIdVenta(Long idVenta, String username) {
        return compraDAO.findAllAndChildrenByIdVenta(idVenta, username);
    }

    @Override
    public List<Compra> findAllAndChildrenNotIdVenta(String username) {
        return compraDAO.findAllAndChildrenNotIdVenta(username);
    }

    @Override
    public List<Compra> findAllAndChildrenWithVenta(String username) {
        return compraDAO.findAllAndChildrenWithVenta(username);
    }

    @Override
    public void saveOrUpdate(Compra compra) {
        compraDAO.saveOrUpdate(compra);
    }

    @Override
    public void update(Long id, Compra compra) {

    }

    @Override
    public void deleteById(Long id) {
        compraDAO.deleteById(id);
    }
}
