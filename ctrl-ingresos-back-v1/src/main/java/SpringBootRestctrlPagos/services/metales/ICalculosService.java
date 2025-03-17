package SpringBootRestctrlPagos.services.metales;

public interface ICalculosService {
    void calcularInventarioByIdCompra(Long idCompra);
    void calcularVentaByIdVenta(Long idVenta);
    void calcularImporteTotalTicketByIdTicket(Long idTicket);
}
