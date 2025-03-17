package SpringBootRestctrlPagos.models.entities.ingresos;

import SpringBootRestctrlPagos.models.entities.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tbl_conceptos")
public class Concepto {
    @EmbeddedId
    private ConceptoId conceptoId;
    private String nombre;
    private Long porcentaje;
    private boolean activo;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    private Usuario usuario;
}
