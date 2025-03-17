package SpringBootRestctrlPagos.controllers.dto.projectManagement;

import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.projectManagement.Task;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ProjectManagementDTO {
    private Long id;
    private String nombre;
    private Date fechaCreacion;
    private Date fechaIniProject;
    List<Task> tasks;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private Time horaEstimada;
    private boolean estado;
    private Usuario usuario;
}
