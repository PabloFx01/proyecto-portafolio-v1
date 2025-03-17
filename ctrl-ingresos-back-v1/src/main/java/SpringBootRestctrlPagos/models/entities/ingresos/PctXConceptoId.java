package SpringBootRestctrlPagos.models.entities.ingresos;

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
public class PctXConceptoId {
    private Long id;
    @Column(name = "id_detalle_ingreso")
    private Long detalleIngresoId;
    @Column(name = "id_ingreso")
    private Long idIngreso;

}
