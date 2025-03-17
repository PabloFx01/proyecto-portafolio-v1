package SpringBootRestctrlPagos.controllers.dto.metales;

import com.fasterxml.jackson.annotation.JsonIgnore;
import SpringBootRestctrlPagos.models.entities.metales.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DetalleCompraDTO {

    private DetalleCompraId detalleId;

    private Metal metal;

    private BigDecimal peso;

    private BigDecimal importe;
    private BigDecimal precioCompra;
    @JsonIgnore
    private Compra compra;


}
