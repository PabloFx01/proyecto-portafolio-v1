package SpringBootRestctrlPagos.controllers.dto.metales;

import SpringBootRestctrlPagos.models.entities.Usuario;
import com.fasterxml.jackson.annotation.JsonFormat;
import SpringBootRestctrlPagos.models.entities.metales.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.repository.Meta;

import java.util.Arrays;
import java.util.Date;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MetalDTO {

    MetalId metalId;
    private String nombre;
    private Double precio;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date fechaIni;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date fechaFin;
    private String editadoPor;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date modificadoEl;
    private Usuario usuario;

    public void generateId(Long idUsuario){
        //Lógica de la generación del ID:
        //id: el id se generara a partir del nombre, se tomaran las primeras 3 letras
        // ej: nombre = 'Cobre' el id será 'cob'.
        // En caso de una palabra compuesta ej: 'Cobre primera' el id será: 'cob_pri'
        String id = "";
        String[] nombre = this.nombre.toLowerCase().split(" ");
        if(nombre.length > 1) {
            id = Arrays.stream(nombre)
                    .map(palabraIndividual -> palabraIndividual.substring(0, Math.min(3, palabraIndividual.length())))
                    .collect(Collectors.joining("_"));
        }else{
            id = nombre[0].toLowerCase().substring(0, Math.min(3, nombre[0].length()));
        }
        id = id + "_" + idUsuario.toString();
        this.metalId.setId(id);

    }
}
