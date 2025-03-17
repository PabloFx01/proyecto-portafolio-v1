package SpringBootRestctrlPagos.services.impl.projectManagement;

import SpringBootRestctrlPagos.models.entities.projectManagement.Task;
import SpringBootRestctrlPagos.models.entities.projectManagement.TaskId;
import SpringBootRestctrlPagos.persistences.projectManagement.ITaskDAO;
import SpringBootRestctrlPagos.services.projectManagement.ITaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class TaskImpl implements ITaskService {
    @Autowired
    private ITaskDAO taskDAO;

    @Override
    public List<Task> findAllByIdPM(Long idPM) {
        return taskDAO.findAllByIdPM(idPM);
    }

    @Override
    public Optional<Task> findTByIdAndIdPM(Long id, Long idPM) {
        return taskDAO.findTByIdAndIdPM(id, idPM);
    }

    @Override
    public Long findNextIdByIdPM(Long idPM) {
        return taskDAO.findNextIdByIdPM(idPM);
    }

    @Override
    public void saveOrUpdate(Task task) {
        taskDAO.saveOrUpdate(task);
    }

    @Override
    public void deleteById(TaskId id) {
        taskDAO.deleteById(id);
    }
}
