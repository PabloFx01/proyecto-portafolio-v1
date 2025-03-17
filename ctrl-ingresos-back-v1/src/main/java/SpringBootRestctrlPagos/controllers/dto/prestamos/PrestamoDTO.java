package SpringBootRestctrlPagos.controllers.dto.prestamos;

import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Cuenta;
import SpringBootRestctrlPagos.models.entities.prestamos.DetallePrestamo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PrestamoDTO {
    private Long id;
    private List<DetallePrestamo> detallePrestamo;
    private String titulo;
    private Date fechaCreacion;
    private Double monto;
    private Double interes;
    private Integer cuotas;
    private Double totAPagar;
    private Cuenta cuentaOrigen;
    private Cuenta cuentaBeneficiario;
    private Double saldoRest;
    private Double totPag;
    private boolean estado;
    private boolean procesarPrestamo;
    private Date fechaTotPagado;
    private Usuario usuario;


}
