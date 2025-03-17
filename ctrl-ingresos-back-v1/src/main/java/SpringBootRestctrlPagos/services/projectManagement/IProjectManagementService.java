package SpringBootRestctrlPagos.services.projectManagement;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.prestamos.Prestamo;
import SpringBootRestctrlPagos.models.entities.projectManagement.ProjectManagement;

import java.util.List;
import java.util.Optional;

public interface IProjectManagementService {
    List<ProjectManagement> findAllAndChildrenByUser(String username);
    List<ProjectManagement> findAllEndAndChildrenByUser(String username);

    List<ProjectManagement> findAllNotEndAndChildrenByUser(String username);

    public ListadoPaginador<ProjectManagement> findAllWithPaginationByUsername(Long cantidad, int pagina, String filter, String username, String state);

    Optional<ProjectManagement> findPMAndChildrenById(Long id);

    Long findMaxId();

    void saveOrUpdate(ProjectManagement pm);

    void deleteById(Long id);
}
