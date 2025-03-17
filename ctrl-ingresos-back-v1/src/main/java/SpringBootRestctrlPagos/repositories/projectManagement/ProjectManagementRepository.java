package SpringBootRestctrlPagos.repositories.projectManagement;

import SpringBootRestctrlPagos.models.entities.projectManagement.ProjectManagement;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectManagementRepository extends CrudRepository<ProjectManagement, Long> {
    @Query("select pm from ProjectManagement pm " +
            "left join fetch pm.tasks ts " +
            "left join fetch ts.taskDetails td " +
            "inner join fetch pm.usuario usu " +
            "where usu.username =?1 " +
            "order by pm.id desc")
    List<ProjectManagement> findAllAndChildrenByUser(String username);

    @Query("select pm from ProjectManagement pm " +
            "left join fetch pm.tasks ts " +
            "left join fetch ts.taskDetails td " +
            "inner join fetch pm.usuario usu " +
            "where usu.username =?1 " +
            "and pm.estado = false " +
            "order by pm.id desc")
    List<ProjectManagement> findAllNotEndAndChildrenByUser(String username);

    @Query("select pm from ProjectManagement pm " +
            "left join fetch pm.tasks ts " +
            "left join fetch ts.taskDetails td " +
            "inner join fetch pm.usuario usu " +
            "where usu.username =?1 " +
            "and pm.estado = true " +
            "order by pm.id desc")
    List<ProjectManagement> findAllEndAndChildrenByUser(String username);
    @Query("select pm from ProjectManagement pm " +
            "left join fetch pm.tasks ts " +
            "left join fetch ts.taskDetails td " +
            "inner join fetch pm.usuario usu " +
            "where pm.id =?1 " +
            "order by pm.id desc")
    ProjectManagement findPMAndChildrenById(Long id);

    @Query("SELECT max(pm.id) from ProjectManagement pm ")
    Long findMaxId() ;
}
