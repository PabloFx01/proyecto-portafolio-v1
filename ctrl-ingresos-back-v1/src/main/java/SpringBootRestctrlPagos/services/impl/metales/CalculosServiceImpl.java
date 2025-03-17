package SpringBootRestctrlPagos.services.impl.metales;


import SpringBootRestctrlPagos.controllers.dto.metales.DetalleCompraPromDTO;
import SpringBootRestctrlPagos.models.Calculo;
import SpringBootRestctrlPagos.models.Item;
import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.persistences.metales.*;
import SpringBootRestctrlPagos.services.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class CalculosServiceImpl implements ICalculosService {
    @Autowired
    private ICompraDAO compraDAO;
    @Autowired
    private IVentaDAO ventaDAO;
    @Autowired
    private IInventarioDAO inventarioDAO;
    @Autowired
    private ITicketDAO ticketDAO;
    @Autowired
    private IDetalleTicketDAO DetalleTicketDAO;
    @Autowired
    private IDetalleCompraDAO detalleCompraDAO;
    @Autowired
    IDetalleVentaDAO detalleVentaDAO;

    @Override
    public void calcularInventarioByIdCompra(Long idCompra) {

        try {
            Optional<Compra> optionalCompra = compraDAO.findByIdAndChildren(idCompra);
            if (optionalCompra.isPresent()) {
                Compra compra = optionalCompra.get();
                String username = compra.getUsuario().getUsername();
                List<Calculo> calculos = new ArrayList<>();
                Set<Metal> valoresUnicos = new HashSet<>();
                List<DetalleCompra> detalles = compra.getDetalleCompra();
                System.out.println("valores unicos");
                detalles.forEach(detalle -> {
                    valoresUnicos.add(detalle.getMetal());
                });
                System.out.println("fin valores unicos");
                valoresUnicos.forEach(valor -> {
                    Calculo calculo = new Calculo();
                    detalles.forEach(detalle -> {
                        if (valor.getMetalId().equals(detalle.getMetal().getMetalId())) {
                            Item item = new Item();
                            item.setMetal(detalle.getMetal());
                            item.setPeso(detalle.getPeso());
                            item.setPrecioCompra(detalle.getPrecioCompra());
                            item.setImporte(detalle.getImporte());
                            calculo.addItems(item);
                        }
                    });
                    calculos.add(calculo);
                });
                System.out.println("dsp de calculos");
                List<Inventario> inventarioList = inventarioDAO.findAllAndChildren(username);
                System.out.println("antes de inventario");
                AtomicInteger i = new AtomicInteger();
                calculos.forEach(calculo -> {
                    i.getAndIncrement();
                    calculo.calcularAtributos();
                    Inventario inventario = inventarioList.stream()
                            .filter(inventario1 -> inventario1.getMetal().getMetalId().
                                    equals(calculo.getItems().get(0).getMetal().getMetalId()))
                            .findFirst()
                            .orElse(null);
                    if (inventario != null) {
                        BigDecimal newStock = calculo.getPesoAcumulado().add(inventario.getStock());
                        BigDecimal newImporte = calculo.getImporteAcumulado().add(inventario.getImporteTotal());
                        inventario.setStock(newStock);
                        inventario.setImporteTotal(newImporte);
                        inventario.setFechaUltAct(new Date());
                        inventarioDAO.saveOrUpdate(inventario);
                    } else {
                        Long newId = inventarioDAO.nextInventarioId(username);
                        String metalId = calculo.getItems().get(0).getMetal().getMetalId().getId();
                        InventarioId newInventarioId = new InventarioId(newId, metalId);
                        inventario = new Inventario();
                        inventario.setInventarioId(newInventarioId);
                        inventario.setFechaIni(new Date());
                        inventario.setStock(calculo.getPesoAcumulado());
                        inventario.setImporteTotal(calculo.getImporteAcumulado());
                        inventario.setFechaUltAct(new Date());
                        inventarioDAO.saveOrUpdate(inventario);
                    }
                    System.out.println("despues de inventario");
                });
            }
        } catch (Exception e) {
            System.out.println(e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public void calcularVentaByIdVenta(Long idVenta) {
        System.out.println("idVenta = " + idVenta);
        System.out.println("calculo de ventas");
        Optional<Venta> optionalVenta = ventaDAO.findByIdAndChildren(idVenta);
        if (optionalVenta.isPresent()) {
            Venta venta = optionalVenta.get();

            List<DetalleVenta> detalles = detalleVentaDAO.findAllAndChildren(venta.getId());
            List<DetalleCompraPromDTO> prom;
            if (venta.isVentaIndividual()) {
                prom = detalleCompraDAO.findAVGDetallesCompraByIdVentaAndIsIndividual(venta.getId());
            } else {
                prom = detalleCompraDAO.findAVGDetallesCompraByIdVenta(venta.getId());
            }

            System.out.println(" prom size " + prom.size());

            Ticket ticket = venta.getTicket();
            List<DetalleTicket> detalleTicketList = venta.getTicket().getDetalleTicket();
            System.out.println("detalleTicketList size " + detalleTicketList.size());

            AtomicInteger i = new AtomicInteger();
            prom.forEach(elemento -> {
                i.getAndIncrement();
                System.out.println("i = " + i);
                System.out.println("prom.getMetal().id() = " + elemento.getMetalId());
                System.out.println("prom.getPrecioPromedio() = " + elemento.getAvgMetalCompra());

                detalles.forEach(detalleVenta -> {
                    if (detalleVenta.getMetal().getMetalId().getId()
                            .equals(elemento.getMetalId())
                    ) {
                        System.out.println("encontro");
                        DetalleTicket dTicket = detalleTicketList.stream()
                                .filter(detalle ->
                                        detalle.getMetal().getMetalId().getId().equals(detalleVenta.getMetal().getMetalId().getId())
                                                && detalle.getMetalAsociadoTicket().getMetalVentaId()
                                                .equals(detalleVenta.getMetalAsociadoVenta().getMetalVentaId())
                                )
                                .findFirst()
                                .orElse(null);
                        BigDecimal calculoTicket = dTicket.getPrecioVenta().multiply(dTicket.getPesoVendido());
                        BigDecimal calculoVenta = BigDecimal.valueOf(elemento.getAvgMetalCompra()).multiply(dTicket.getPesoVendido());
                        BigDecimal gananciaUnitario = calculoTicket.subtract(calculoVenta);
                        System.out.println("gananciaUnitario = " + gananciaUnitario);


                        detalleVenta.setPrecioPromedio(BigDecimal.valueOf(elemento.getAvgMetalCompra()));
                        detalleVenta.setGananciaUnitaria(gananciaUnitario);
                        detalleVentaDAO.saveOrUpdate(detalleVenta);

                        //Actualizar inventario
                        BigDecimal subtractPeso = new BigDecimal("0");
                        System.out.println("venta.isVentaIndividual() = " + venta.isVentaIndividual());
                        if (venta.isVentaIndividual()) {
                            subtractPeso = detalleVenta.getPesoVendido();
                        }
                        System.out.println("subtractPeso = " + subtractPeso);
                        subtractStockBeforeVenta(detalleVenta.getMetal().getMetalId().getId(), subtractPeso);
                    }
                });
            });
            ticket.setUsed(true);
            ticketDAO.saveOrUpdate(ticket);
            calcularGananciasTotales(idVenta);
        }
    }

    public void subtractStockBeforeVenta(String idMetal, BigDecimal subtractPeso) {
        Optional<Inventario> inventarioOptional = inventarioDAO.findByIdMetal(idMetal);
        if (inventarioOptional.isPresent()) {
            Inventario inventario = inventarioOptional.get();
            BigDecimal pesoActual = inventario.getStock();
            System.out.println("pesoActual = " + pesoActual);
            BigDecimal pesoVendido = new BigDecimal("0");
            if (subtractPeso.doubleValue() > 0) {
                pesoVendido = subtractPeso;
            } else {
                pesoVendido = pesoActual;
            }
            System.out.println("pesoVendido = " + pesoVendido);
            //BigDecimal nuevoPesoStock = BigDecimal.valueOf((pesoActual.doubleValue() - pesoVendido.doubleValue()));
            BigDecimal nuevoPesoStock = pesoActual.subtract(pesoVendido);
            System.out.println("nuevoPesoStock = " + nuevoPesoStock);


            BigDecimal newImporteTotal = nuevoPesoStock.multiply(
                    BigDecimal.valueOf(inventario.getMetal().getPrecio()));
            inventario.setImporteTotal(newImporteTotal);
            inventario.setStock(nuevoPesoStock);
            inventarioDAO.saveOrUpdate(inventario);
        }
    }


    public void calcularGananciasTotales(Long idVenta) {
        Optional<Venta> ventaOptional = ventaDAO.findByIdAndChildren(idVenta);
        Double gt = 0D;
        if (ventaOptional.isPresent()) {
            Venta venta = ventaOptional.get();
            //List<DetalleVenta> detalleVentaList = venta.getDetalleVenta();
            List<DetalleVenta> detalleVentaList = detalleVentaDAO.findAllAndChildren(venta.getId());
            if (!detalleVentaList.isEmpty()) {
                gt = detalleVentaList.stream()
                        .mapToDouble(detalle -> detalle.getGananciaUnitaria()!=null?detalle.getGananciaUnitaria().doubleValue():0)
                        .sum();
                venta.setGananciaTotal(BigDecimal.valueOf(gt));
                ventaDAO.saveOrUpdate(venta);
            } else {
                venta.setGananciaTotal(null);
                ventaDAO.saveOrUpdate(venta);
            }
        }
    }


    @Override
    public void calcularImporteTotalTicketByIdTicket(Long idTicket) {
        Double importeTotal = 0D;
        Optional<Ticket> optionalTicket = ticketDAO.findById(idTicket);
        if (optionalTicket.isPresent()) {
            Ticket ticket = optionalTicket.get();
            List<DetalleTicket> detalleTicketList = DetalleTicketDAO.findAllAndChildren(idTicket);
            if (!detalleTicketList.isEmpty()) {
                importeTotal = detalleTicketList.stream()
                        .mapToDouble(detalle -> detalle.getImporte().doubleValue())
                        .sum();

                ticket.setImporteTotal(BigDecimal.valueOf(importeTotal));
                ticketDAO.saveOrUpdate(ticket);
            } else {
                ticket.setImporteTotal(null);
                ticketDAO.saveOrUpdate(ticket);
            }
        }
    }

}
