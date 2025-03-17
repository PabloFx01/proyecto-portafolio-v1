package SpringBootRestctrlPagos.models.entities.projectManagement;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Embeddable
public class TaskId {
    private Long id;
    @Column(name = "id_pm")
    private Long idPm;
}

