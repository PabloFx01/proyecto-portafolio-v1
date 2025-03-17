package SpringBootRestctrlPagos.controllers.dto.metales;

import SpringBootRestctrlPagos.models.entities.metales.Compra;
import SpringBootRestctrlPagos.models.entities.metales.DetalleCompraId;
import SpringBootRestctrlPagos.models.entities.metales.Metal;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DetalleCompraPromDTO {
    private String metalId;
    private Double avgMetalCompra;
}
