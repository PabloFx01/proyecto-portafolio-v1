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
public class DetalleVentaDTO {

    DetalleVentaId detalleId;

    private Metal metal;

    private MetalVenta metalAsociadoVenta;

    private BigDecimal pesoVendido;

    private BigDecimal precioPromedio;

    private BigDecimal gananciaUnitaria;

    @JsonIgnore
    private Venta venta;

}
