package SpringBootRestctrlPagos.controllers.dto.metales;

import SpringBootRestctrlPagos.models.entities.Usuario;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import SpringBootRestctrlPagos.models.entities.metales.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VentaDTO {

    private Long id;

    private String descripcion;

    private Ticket ticket;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date fechaVenta;
    private boolean isVentaIndividual;
    private BigDecimal gananciaTotal;
    @JsonIgnore
    private List<DetalleVenta> detalleVenta;

    private String editadoPor;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date modificadoEl;
    private Usuario usuario;



}
