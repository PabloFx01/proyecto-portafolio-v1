package SpringBootRestctrlPagos.controllers.dto.ctrlEfectivo;
import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Cuenta;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Transaccion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MovimientoDTO {

    private Long id;
    //@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date fecha;
    private String tipoMovimiento;
    private String comentario;
    private Double monto;
    private Cuenta cuenta;
    private Transaccion transaccion;
    private Usuario usuario;
}
