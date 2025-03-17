package SpringBootRestctrlPagos.controllers.dto.ctrlEfectivo;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Sobre;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CuentaDTO {
    private Long id;
    private Double saldo;
    private Sobre sobre;
}
