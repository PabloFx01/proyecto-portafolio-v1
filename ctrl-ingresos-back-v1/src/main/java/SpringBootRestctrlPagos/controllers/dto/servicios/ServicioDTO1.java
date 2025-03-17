package SpringBootRestctrlPagos.controllers.dto.servicios;

import SpringBootRestctrlPagos.models.entities.Usuario;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ServicioDTO1 {
    private Long id;
    private String nombre;
    private Double valor;
    private Double periodoPago;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date fechaIniVto;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date fechaFinVto;
    private String comentario;
    private boolean activo;
    private Usuario usuario;
}
