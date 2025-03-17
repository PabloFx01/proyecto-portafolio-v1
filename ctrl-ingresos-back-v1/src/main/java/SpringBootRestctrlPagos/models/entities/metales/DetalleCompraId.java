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
public class DetalleCompraId implements Serializable {

    private Long id;
    @Column(name = "id_compra", insertable=false, updatable=false)
    private Long idCompra;
}
