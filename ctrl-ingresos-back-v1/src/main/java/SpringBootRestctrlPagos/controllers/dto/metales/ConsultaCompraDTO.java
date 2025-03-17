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
public class ConsultaCompraDTO {

    private Long id;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")

    private Date fechaCompra;
    private List<DetalleCompra> detalleCompra;
    private BigDecimal totalComprado;
    private boolean cierre;
    private boolean ficticio;
    private String comentario;
    private String editadoPor;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date modificadoEl;
    private Venta venta;
    private Usuario usuario;



}
