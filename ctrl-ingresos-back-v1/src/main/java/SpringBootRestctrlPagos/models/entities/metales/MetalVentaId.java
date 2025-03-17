package SpringBootRestctrlPagos.models.entities.metales;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class MetalVentaId implements Serializable {

    private Long id;
    @Column(name = "id_metal_compra")
    private String idMetalCompra;

}
