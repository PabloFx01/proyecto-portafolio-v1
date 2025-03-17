package SpringBootRestctrlPagos.controllers.dto.projectManagement;

import SpringBootRestctrlPagos.models.entities.projectManagement.ProjectManagement;
import SpringBootRestctrlPagos.models.entities.projectManagement.TaskDetail;
import SpringBootRestctrlPagos.models.entities.projectManagement.TaskId;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class TaskDTO {

    private TaskId taskId;
    private String nombre;
    List<TaskDetail> taskDetails;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private Time horaEstimada;
    @JsonIgnore
    private ProjectManagement pm;
}
