package SpringBootRestctrlPagos.controllers.dto.ctrlEfectivo;

import SpringBootRestctrlPagos.models.entities.Usuario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SobreDTO {
    private Long id;
    private String descripcion;
    private boolean activo;
    private Usuario usuario;

}
