package SpringBootRestctrlPagos.services.impl.metales;

import SpringBootRestctrlPagos.models.FechaCompraAsociada;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.persistences.metales.*;
import SpringBootRestctrlPagos.services.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class VentaServiceImpl implements IVentaService {
    @Autowired
    IVentaDAO ventaDAO;
    @Autowired
    ICompraDAO compraDAO;
    @Autowired
    IDetalleCompraDAO detalleCompraDAO;
    @Autowired
    IDetalleVentaDAO detalleVentaDAO;
    @Autowired
    ICompraService compraService;
    @Autowired
    IInventarioService inventarioService;

    @Override
    public List<Venta> findAll() {
        return ventaDAO.findAll();
    }

    @Override
    public ListadoPaginador<Venta> findAllWithPagination(Long cantidad, int pagina, String filter, String username) {
        ListadoPaginador<Venta> resultado = new ListadoPaginador<>();
        List<Venta> ventaList = this.findAllAndChildren(username);

        Long cantidadTotal = 0L;
        if (!filter.equals("not")) {
            resultado.elementos = ventaList.stream()
                    .filter(venta -> venta.getDescripcion().toLowerCase().contains(filter.toLowerCase()))
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = ventaList.stream()
                    .filter(venta -> venta.getDescripcion().toLowerCase().contains(filter.toLowerCase()))
                    .count();
        } else {
            resultado.elementos = ventaList.stream()
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(ventaList.size());
        }
        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }

    @Override
    public List<Venta> findAllAndChildren(String username) {
        return ventaDAO.findAllAndChildren(username);
    }

    @Override
    public Optional<Venta> findById(Long id) {
        return ventaDAO.findById(id);
    }

    @Override
    public Optional<Venta> findByIdAndChildren(Long id) {
        return ventaDAO.findByIdAndChildren(id);
    }

    @Override
    public Long findMaxId() {
        return ventaDAO.findMaxId();
    }

    @Override
    public void asociarComprasDiariasByIdVenta(Long id) {
        Optional<Venta> ventaOptional = ventaDAO.findById(id);

        FechaCompraAsociada fechaCompraAsociada = new FechaCompraAsociada();
        try {
            if (ventaOptional.isPresent()) {
                Venta venta = ventaOptional.get();
                String username = venta.getUsuario().getUsername();
                List<Compra> compraList = compraDAO.findAllAndChildrenNotIdVenta(username);
                if (!compraList.isEmpty()) {

                    Integer ultElemento = compraList.size() - 1;
                    fechaCompraAsociada.setFechaIni(compraList.get(0).getFechaCompra());
                    fechaCompraAsociada.setFechaFin(compraList.get(ultElemento).getFechaCompra());
                    Set<Metal> metalesVendidos = new HashSet<>();
                    //List<DetalleVenta> detalleVenta = venta.getDetalleVenta();
                    List<DetalleVenta> detalleVenta = detalleVentaDAO.findAllAndChildren(venta.getId());
                    detalleVenta.forEach(detalle -> {
                        metalesVendidos.add(detalle.getMetal());
                    });
                    Compra nuevaCompra = new Compra();
                    List<DetalleCompra> nuevoDetalleList = new ArrayList<>();
                    compraList.forEach(compra -> {
                        compra.getDetalleCompra().forEach(detalleCompra -> {
                            Metal metalExist = metalesVendidos.stream()
                                    .filter(metal -> metal.getMetalId().
                                            equals(detalleCompra.getMetal().getMetalId()))
                                    .findFirst()
                                    .orElse(null);
                            if (metalExist == null) {
                                Optional<Inventario> optionalInventario = inventarioService.findByIdMetal(detalleCompra.getMetal().getMetalId().getId());
                                if (optionalInventario.isPresent()) {
                                    Inventario inventario = optionalInventario.get();
                                    BigDecimal stock = inventario.getStock();

                                    if (stock.doubleValue() > 0) {

                                        DetalleCompra nuevaDetalleCompra = detalleCompra;
                                        nuevoDetalleList.add(nuevaDetalleCompra);
                                    }
                                }
                            }
                        });
                        compra.setVenta(venta);
                        compraDAO.saveOrUpdate(compra);
                    });

                    if (!nuevoDetalleList.isEmpty()) {

                        nuevaCompra.setFechaCompra(new Date());
                        nuevaCompra.setTotalComprado(new BigDecimal(0));
                        nuevaCompra.setCierre(false);
                        nuevaCompra.setUsuario(venta.getUsuario());
                        nuevaCompra.setEditadoPor("Automático");
                        nuevaCompra.setComentario("Generado automáticamente");

                        compraDAO.saveOrUpdate(nuevaCompra);
                        Long nextIdCompra = compraDAO.findMaxId(username);
                        AtomicInteger i = new AtomicInteger();
                        nuevoDetalleList.forEach(nuevoDetalle -> {
                            i.getAndIncrement();

                            DetalleCompraId nuevoId = new DetalleCompraId(i.longValue(), nextIdCompra);
                            DetalleCompra dc = new DetalleCompra();
                            dc.setDetalleId(nuevoId);
                            dc.setPrecioCompra(nuevoDetalle.getPrecioCompra());
                            dc.setPeso(nuevoDetalle.getPeso());
                            dc.setMetal(nuevoDetalle.getMetal());
                            dc.setImporte(nuevoDetalle.getImporte());

                            detalleCompraDAO.saveOrUpdate(dc);

                        });
                        compraService.cerrarDia(nextIdCompra);
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("e = " + e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public FechaCompraAsociada findFechasCompraAsociadasByIdVenta(Long id) {
        Optional<Venta> ventaOptional = ventaDAO.findById(id);
        FechaCompraAsociada fechaCompraAsociada = new FechaCompraAsociada();
        if (ventaOptional.isPresent()) {
            Venta venta = ventaOptional.get();
            String username = venta.getUsuario().getUsername();
            List<Compra> compraList = compraDAO.findAllAndChildrenByIdVenta(id, username);

            if (!compraList.isEmpty()) {

                List<Compra> sortedObjetos = compraList.stream()
                        .sorted(Comparator.comparing(Compra::getFechaCompra))
                        .collect(Collectors.toList());

                Integer ultElemento = sortedObjetos.size() - 1;
                fechaCompraAsociada.setFechaIni(sortedObjetos.get(0).getFechaCompra());
                fechaCompraAsociada.setFechaFin(sortedObjetos.get(ultElemento).getFechaCompra());
            }
        }
        return fechaCompraAsociada;
    }

    @Override
    public void saveOrUpdate(Venta venta) {
        ventaDAO.saveOrUpdate(venta);
    }

    @Override
    public void update(Long id, Venta venta) {

    }

    @Override
    public void deleteById(Long id) {
        ventaDAO.deleteById(id);
    }
}
