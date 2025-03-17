package SpringBootRestctrlPagos.models.entities.metales;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class DetalleVentaId {

    private Long id;
    @Column(name = "id_venta", insertable=false, updatable=false)
    private Long idVenta;
}
