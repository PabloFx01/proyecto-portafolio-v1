package SpringBootRestctrlPagos.models.entities.projectManagement;

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
@Entity
@Table(name = "tbl_tasks")
public class Task {
    @EmbeddedId
    private TaskId taskId;
    private String nombre;
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    List<TaskDetail> taskDetails;
    @Column(name = "hora_estimada")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private Time horaEstimada;
    @ManyToOne
    @JoinColumn(name = "id_pm", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    @JsonIgnore
    private ProjectManagement pm;
}
