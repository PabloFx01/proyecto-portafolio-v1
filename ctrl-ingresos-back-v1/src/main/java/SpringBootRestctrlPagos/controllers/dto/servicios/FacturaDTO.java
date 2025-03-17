package SpringBootRestctrlPagos.controllers.dto.servicios;

import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.servicios.DetalleFactura;
import SpringBootRestctrlPagos.models.entities.servicios.Servicio;
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
public class FacturaDTO {
    private Long id;
    private Date fecha;
    private List<DetalleFactura> detallesFactura;
    private Servicio servicio;
    private Double saldoRest;
    private Double totPag;
    private boolean estado;
    private Date fechaPagoTotVto;
    private Usuario usuario;
}
