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
public class InventarioId {

    private Long id;
    @Column(name = "metal_id", insertable=false, updatable=false)
    private String metalId;
}
