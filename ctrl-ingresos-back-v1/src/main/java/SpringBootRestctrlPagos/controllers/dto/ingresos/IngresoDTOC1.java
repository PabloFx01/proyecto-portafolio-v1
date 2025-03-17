package SpringBootRestctrlPagos.controllers.dto.ingresos;

import SpringBootRestctrlPagos.models.entities.ingresos.TipoMoneda;
import SpringBootRestctrlPagos.models.entities.Usuario;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngresoDTOC1 {

    private Long id;
    private Double montoIngreso;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date fechaDeposito;
    @Enumerated(EnumType.STRING)
    private TipoMoneda tMoneda;
    private String comentario;
    private boolean asociarConceptos;
    private Usuario usuario;

}
