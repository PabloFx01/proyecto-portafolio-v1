package SpringBootRestctrlPagos.models.entities.metales;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tbl_detalles_compra")
public class DetalleCompra {

    @EmbeddedId
    DetalleCompraId detalleId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "metal_id", referencedColumnName = "id")
    private Metal metal;
    private BigDecimal peso;
    @Column(name = "precio_compra")
    private BigDecimal precioCompra;
    private BigDecimal importe;
    @ManyToOne
    @JoinColumn(name = "id_compra", nullable = false, insertable = false, updatable = false)
    @JsonIgnore
    private Compra compra;


}
