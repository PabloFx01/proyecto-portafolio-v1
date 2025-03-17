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
public class DetalleTicketId {

    private Long id;
    @Column(name = "id_ticket", insertable=false, updatable=false)
    private Long idTicket;
}
