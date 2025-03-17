package SpringBootRestctrlPagos.persistences.projectManagement;
import SpringBootRestctrlPagos.models.entities.projectManagement.ProjectManagement;
import java.util.List;
import java.util.Optional;


public interface IProjectManagementDAO {

    List<ProjectManagement> findAllAndChildrenByUser(String username);
    List<ProjectManagement> findAllNotEndAndChildrenByUser(String username);
    List<ProjectManagement> findAllEndAndChildrenByUser(String username);
    Optional<ProjectManagement> findPMAndChildrenById(Long id);
    Long findMaxId();
    void saveOrUpdate(ProjectManagement pm);
    void deleteById(Long id);
}
