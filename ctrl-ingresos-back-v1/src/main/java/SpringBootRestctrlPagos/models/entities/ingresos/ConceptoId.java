package SpringBootRestctrlPagos.models.entities.ingresos;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Embeddable
public class ConceptoId {
    @Column(name = "id")
    private Long idConcepto;
    @Column(name="id_usuario")
    private Long idUsuario;
}
