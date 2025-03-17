package SpringBootRestctrlPagos.controllers.projectManagement;


import SpringBootRestctrlPagos.controllers.dto.projectManagement.TaskDTO;
import SpringBootRestctrlPagos.models.entities.projectManagement.Task;

public class TaskController {
    private TaskDTO taskToTaskDTO(Task task) {
        return TaskDTO.builder()
                .taskId(task.getTaskId())
                .nombre(task.getNombre())
                .taskDetails(task.getTaskDetails())
                .horaEstimada(task.getHoraEstimada())
                .pm(task.getPm())
                .build();
    }

    private Task taskDTOToTask(TaskDTO taskDTO) {
        return Task.builder()
                .taskId(taskDTO.getTaskId())
                .nombre(taskDTO.getNombre())
                .taskDetails(taskDTO.getTaskDetails())
                .horaEstimada(taskDTO.getHoraEstimada())
                .pm(taskDTO.getPm())
                .build();

    }
}
