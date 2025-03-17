package SpringBootRestctrlPagos.controllers.dto.ingresos;

import SpringBootRestctrlPagos.models.entities.ingresos.TipoMoneda;
import SpringBootRestctrlPagos.models.entities.ingresos.DetalleIngreso;
import SpringBootRestctrlPagos.models.entities.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngresoDTO {

    private Long id;
    private Double montoIngreso;
    private Date fechaDeposito;
    @Enumerated(EnumType.STRING)
    private TipoMoneda tMoneda;
    private List<DetalleIngreso> detallesIngreso;
    private String comentario;
    private boolean asociarConceptos;
    private Usuario usuario;

}
