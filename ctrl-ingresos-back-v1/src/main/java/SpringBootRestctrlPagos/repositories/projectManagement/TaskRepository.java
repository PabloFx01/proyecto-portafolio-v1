package SpringBootRestctrlPagos.repositories.projectManagement;

import SpringBootRestctrlPagos.models.entities.prestamos.DetallePrestamo;
import SpringBootRestctrlPagos.models.entities.prestamos.DetallePrestamoId;
import SpringBootRestctrlPagos.models.entities.projectManagement.Task;
import SpringBootRestctrlPagos.models.entities.projectManagement.TaskId;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends CrudRepository<Task, TaskId> {
    @Query("select t from Task t " +
            "left join fetch t.taskDetails td " +
            "where t.taskId.idPm =?1")
    List<Task> findAllByIdPm(Long idPm);


    @Query("select t from Task t " +
            "left join fetch t.taskDetails td " +
            "where t.taskId.id =?1 and t.taskId.idPm =?2")
    Task findTByIdAndIdPm(Long id, Long idPm);


    @Query("SELECT COALESCE(max(t.taskId.id),0) + 1  from Task t " +
            "where t.taskId.idPm =?1")
    Long findNextIdByIdPm(Long idPm);

}
