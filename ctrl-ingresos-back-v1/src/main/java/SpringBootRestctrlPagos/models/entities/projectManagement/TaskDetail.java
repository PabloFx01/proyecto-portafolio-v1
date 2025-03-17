package SpringBootRestctrlPagos.models.entities.projectManagement;

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
@Entity
@Table(name = "tbl_task_detail")
public class TaskDetail {
    @EmbeddedId
    private TaskDetailId id;
    private String nombre;
    @Column(name = "hora_estimada")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private Time horaEstimada;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    @Column(name = "horas_utilizadas")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private Time horasUtilizadas;
    private boolean estado;
    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "id_task", referencedColumnName = "id", nullable = false, insertable = false, updatable = false),
            @JoinColumn(name = "id_pm", referencedColumnName = "id_pm", nullable = false, insertable = false, updatable = false)
    })
    @JsonIgnore
    private Task task;
}
