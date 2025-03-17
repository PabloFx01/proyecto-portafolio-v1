package SpringBootRestctrlPagos.controllers.dto.ctrlEfectivo;

import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Cuenta;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransaccionDTO {
    private Long id;
    private Double cantidad;
    private Date fecha;
    private Cuenta cuentaOrigen;
    private Cuenta cuentaDestino;
}
