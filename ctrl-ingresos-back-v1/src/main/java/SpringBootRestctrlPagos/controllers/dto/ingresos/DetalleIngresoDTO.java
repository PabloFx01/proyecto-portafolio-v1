package SpringBootRestctrlPagos.controllers.dto.ingresos;

import SpringBootRestctrlPagos.models.entities.*;
import SpringBootRestctrlPagos.models.entities.ingresos.Concepto;
import SpringBootRestctrlPagos.models.entities.ingresos.DetalleIngresoId;
import SpringBootRestctrlPagos.models.entities.ingresos.Ingreso;
import SpringBootRestctrlPagos.models.entities.ingresos.PorcentajeXConcepto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetalleIngresoDTO {

    private DetalleIngresoId detalleIngresoId;
    private Concepto concepto;
    private Double montoPorcentaje;
    private Double montoPorcentajeRest;
    private PorcentajeXConcepto pctXCpto;
    private Long idPctXCpto;
    private Usuario usuario;
    @JsonIgnore
    private Ingreso ingreso;

}
