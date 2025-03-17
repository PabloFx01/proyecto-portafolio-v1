package SpringBootRestctrlPagos.models;


import SpringBootRestctrlPagos.models.entities.metales.Metal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Item {
    private Metal metal;
    private BigDecimal precioCompra;
    private BigDecimal importe;
    private BigDecimal Peso;
}
