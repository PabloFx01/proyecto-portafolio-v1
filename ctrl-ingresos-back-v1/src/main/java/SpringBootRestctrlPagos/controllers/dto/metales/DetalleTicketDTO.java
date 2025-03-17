package SpringBootRestctrlPagos.controllers.dto.metales;

import com.fasterxml.jackson.annotation.JsonIgnore;
import SpringBootRestctrlPagos.models.entities.metales.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DetalleTicketDTO {

    DetalleTicketId detalleId;

    private Metal metal;

    private MetalVenta metalAsociadoTicket;

    private BigDecimal pesoVendido;

    private BigDecimal precioVenta;

    private BigDecimal importe;
    @JsonIgnore
    private Ticket ticket;

}
