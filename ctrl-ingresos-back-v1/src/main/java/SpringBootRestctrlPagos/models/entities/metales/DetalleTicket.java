package SpringBootRestctrlPagos.models.entities.metales;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tbl_detalles_tickets")
public class DetalleTicket {

    @EmbeddedId
    DetalleTicketId detalleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "metal_id", referencedColumnName = "id")
    private Metal metal;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "m_ticket_id", referencedColumnName = "id"),
            @JoinColumn(name = "m_ticket_m_compra_id", referencedColumnName = "id_metal_compra")
    })
    private MetalVenta metalAsociadoTicket;

    @Column(name = "peso_vendido")
    private BigDecimal pesoVendido;

    @Column(name = "precio_venta")
    private BigDecimal precioVenta;
    @Column(name = "importe")
    private BigDecimal importe;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_ticket", nullable = false, insertable = false, updatable = false)
    private Ticket ticket;
}
