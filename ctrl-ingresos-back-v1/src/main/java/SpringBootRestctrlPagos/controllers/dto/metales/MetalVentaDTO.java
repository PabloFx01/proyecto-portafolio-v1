package SpringBootRestctrlPagos.controllers.dto.metales;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import SpringBootRestctrlPagos.models.entities.metales.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MetalVentaDTO {

    private MetalVentaId metalVentaId;

    private String descripcion;
    @JsonIgnore
    private Metal metalCompra;

    private String editadoPor;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date modificadoEl;

}
