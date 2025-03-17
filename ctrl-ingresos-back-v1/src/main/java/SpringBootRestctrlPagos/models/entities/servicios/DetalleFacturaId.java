package SpringBootRestctrlPagos.models.entities.servicios;

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
public class DetalleFacturaId {
    private Long id;
    @Column(name = "id_factura")
    private Long idFactura;
}
