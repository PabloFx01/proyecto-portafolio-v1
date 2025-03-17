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
@Table(name = "tbl_detalles_ventas")
public class DetalleVenta {

    @EmbeddedId
    DetalleVentaId detalleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "metal_id", referencedColumnName = "id")
    private Metal metal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "m_venta_id", referencedColumnName = "id"),
            @JoinColumn(name = "m_venta_m_compra_id", referencedColumnName = "id_metal_compra")
    })
    private MetalVenta metalAsociadoVenta;

    @Column(name = "peso_vendido")
    private BigDecimal pesoVendido;

    @Column(name = "precio_promedio")
    private BigDecimal precioPromedio;
    @Column(name = "ganancia_unitaria")
    private BigDecimal gananciaUnitaria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_venta", nullable = false, insertable = false, updatable = false)
    @JsonIgnore
    private Venta venta;
}
