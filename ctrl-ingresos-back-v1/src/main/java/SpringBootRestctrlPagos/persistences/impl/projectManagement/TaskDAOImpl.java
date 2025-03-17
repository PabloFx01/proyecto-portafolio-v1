package SpringBootRestctrlPagos.persistences.impl.projectManagement;

import SpringBootRestctrlPagos.models.entities.projectManagement.Task;
import SpringBootRestctrlPagos.models.entities.projectManagement.TaskId;
import SpringBootRestctrlPagos.persistences.projectManagement.ITaskDAO;
import SpringBootRestctrlPagos.repositories.projectManagement.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
@Component
public class TaskDAOImpl implements ITaskDAO {
    @Autowired
    private TaskRepository taskRepository;

    @Override
    public List<Task> findAllByIdPM(Long idPM) {
        return taskRepository.findAllByIdPm(idPM);
    }

    @Override
    public Optional<Task> findTByIdAndIdPM(Long id, Long idPM) {
        return Optional.ofNullable(taskRepository.findTByIdAndIdPm(id, idPM));
    }

    @Override
    public Long findNextIdByIdPM(Long idPM) {
        return taskRepository.findNextIdByIdPm(idPM);
    }

    @Override
    public void saveOrUpdate(Task task) {
        taskRepository.save(task);
    }

    @Override
    public void deleteById(TaskId id) {
        taskRepository.deleteById(id);
    }
}
