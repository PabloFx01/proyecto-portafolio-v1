package SpringBootRestctrlPagos.models.entities.prestamos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "tbl_detalles_prestamo")
public class DetallePrestamo {
    @EmbeddedId
    private DetallePrestamoId detallePrestamoId;
    @Column(name = "fecha_pago")
    private Date fechaPago;
    @Column(name = "monto_pago")
    private Double montoPago;
    @Column(name = "pago_efectuado")
    private boolean pagoEfectuado;
    @ManyToOne
    @JoinColumn(name = "id_prestamo", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    @JsonIgnore
    private Prestamo prestamo;
}
