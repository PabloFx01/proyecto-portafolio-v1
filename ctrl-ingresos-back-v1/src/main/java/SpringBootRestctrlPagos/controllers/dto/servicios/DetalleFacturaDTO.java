package SpringBootRestctrlPagos.controllers.dto.servicios;

import SpringBootRestctrlPagos.models.entities.servicios.DetalleFacturaId;
import SpringBootRestctrlPagos.models.entities.servicios.Factura;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class DetalleFacturaDTO {

    private DetalleFacturaId detalleFacturaId;
    private Date fechaPago;
    private Double pago;
    @JsonIgnore
    private Factura factura;
}
