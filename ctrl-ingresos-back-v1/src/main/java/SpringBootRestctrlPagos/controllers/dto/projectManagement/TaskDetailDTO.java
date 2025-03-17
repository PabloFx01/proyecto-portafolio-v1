package SpringBootRestctrlPagos.controllers.dto.projectManagement;

import SpringBootRestctrlPagos.models.entities.projectManagement.TaskDetailId;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class TaskDetailDTO {
    private TaskDetailId id;
    private String nombre;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private Time horaEstimada;
    private String descripcion;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private Time horasUtilizadas;
    private boolean estado;
    @JsonIgnore
    private TaskDTO task;
}
