package SpringBootRestctrlPagos.persistences.projectManagement;

import SpringBootRestctrlPagos.models.entities.prestamos.DetallePrestamo;
import SpringBootRestctrlPagos.models.entities.prestamos.DetallePrestamoId;
import SpringBootRestctrlPagos.models.entities.projectManagement.Task;
import SpringBootRestctrlPagos.models.entities.projectManagement.TaskId;

import java.util.List;
import java.util.Optional;

public interface ITaskDAO {
    List<Task> findAllByIdPM(Long idPM);

    Optional<Task> findTByIdAndIdPM(Long id, Long idPM);
    Long findNextIdByIdPM(Long idPM);

    void saveOrUpdate(Task task);

    void deleteById(TaskId id);
}
