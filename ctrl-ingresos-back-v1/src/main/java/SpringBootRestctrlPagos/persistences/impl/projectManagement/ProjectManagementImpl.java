package SpringBootRestctrlPagos.persistences.impl.projectManagement;

import SpringBootRestctrlPagos.models.entities.projectManagement.ProjectManagement;
import SpringBootRestctrlPagos.persistences.projectManagement.IProjectManagementDAO;
import SpringBootRestctrlPagos.repositories.projectManagement.ProjectManagementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
@Component
public class ProjectManagementImpl implements IProjectManagementDAO {
    @Autowired
    private ProjectManagementRepository pmRepo;

    @Override
    public List<ProjectManagement> findAllAndChildrenByUser(String username) {
        return pmRepo.findAllAndChildrenByUser(username);
    }

    @Override
    public List<ProjectManagement> findAllNotEndAndChildrenByUser(String username) {
        return pmRepo.findAllNotEndAndChildrenByUser(username);
    }

    @Override
    public List<ProjectManagement> findAllEndAndChildrenByUser(String username) {
        return pmRepo.findAllEndAndChildrenByUser(username);
    }

    @Override
    public Optional<ProjectManagement> findPMAndChildrenById(Long id) {
        return Optional.ofNullable(pmRepo.findPMAndChildrenById(id));
    }

    @Override
    public Long findMaxId() {
        return pmRepo.findMaxId();
    }

    @Override
    public void saveOrUpdate(ProjectManagement pm) {
        pmRepo.save(pm);
    }

    @Override
    public void deleteById(Long id) {
        pmRepo.deleteById(id);
    }
}
