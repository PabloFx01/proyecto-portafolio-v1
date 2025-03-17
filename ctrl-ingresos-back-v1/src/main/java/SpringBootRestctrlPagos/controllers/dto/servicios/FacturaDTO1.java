package SpringBootRestctrlPagos.controllers.dto.servicios;

import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.servicios.DetalleFactura;
import SpringBootRestctrlPagos.models.entities.servicios.Servicio;
import com.fasterxml.jackson.annotation.JsonFormat;
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
public class FacturaDTO1 {
    private Long id;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date fecha;
    private Servicio servicio;
    private Double saldoRest;
    private Double totPag;
    private Date fechaPagoTotVto;
    private boolean estado;
    private Usuario usuario;
}
