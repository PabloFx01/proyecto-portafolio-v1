package SpringBootRestctrlPagos.controllers.dto.ingresos;

import SpringBootRestctrlPagos.models.entities.ingresos.ConceptoId;
import SpringBootRestctrlPagos.models.entities.Usuario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class ConceptoDTO {
    private ConceptoId conceptoId;
    private String nombre;
    private Long porcentaje;
    private boolean activo;
    private Usuario usuario;
}