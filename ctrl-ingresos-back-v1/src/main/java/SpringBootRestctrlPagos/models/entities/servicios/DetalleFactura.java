package SpringBootRestctrlPagos.models.entities.servicios;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "tbl_detalles_factura")
public class DetalleFactura {
    @EmbeddedId
    private DetalleFacturaId detalleFacturaId;
    @Column(name = "fecha_pago")
    private Date fechaPago;
    private Double pago;
    @ManyToOne
    @JoinColumn(name = "id_factura", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    @JsonIgnore
    private Factura factura;
}
