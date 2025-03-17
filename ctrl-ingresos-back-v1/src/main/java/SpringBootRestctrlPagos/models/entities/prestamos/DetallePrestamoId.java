package SpringBootRestctrlPagos.models.entities.prestamos;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Embeddable
public class DetallePrestamoId {
    private Long id;
    @Column(name = "id_prestamo")
    private Long idPrestamo;
}
