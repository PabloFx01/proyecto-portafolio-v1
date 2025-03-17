package SpringBootRestctrlPagos.services.impl.projectManagement;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.prestamos.Prestamo;
import SpringBootRestctrlPagos.models.entities.projectManagement.ProjectManagement;
import SpringBootRestctrlPagos.persistences.projectManagement.IProjectManagementDAO;
import SpringBootRestctrlPagos.services.projectManagement.IProjectManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class ProjectManagerImpl implements IProjectManagementService {
    @Autowired
    private IProjectManagementDAO pmDao;

    @Override
    public List<ProjectManagement> findAllAndChildrenByUser(String username) {
        return pmDao.findAllAndChildrenByUser(username);
    }

    @Override
    public List<ProjectManagement> findAllEndAndChildrenByUser(String username) {
        return pmDao.findAllEndAndChildrenByUser(username);
    }

    @Override
    public List<ProjectManagement> findAllNotEndAndChildrenByUser(String username) {
        return pmDao.findAllNotEndAndChildrenByUser(username);
    }

    @Override
    public ListadoPaginador<ProjectManagement> findAllWithPaginationByUsername(Long cantidad, int pagina, String filter, String username, String state) {
        ListadoPaginador<ProjectManagement> resultado = new ListadoPaginador<>();
        List<ProjectManagement> pmList;

        if (state.equals("END")) {
            pmList = this.findAllEndAndChildrenByUser(username);
        } else if (state.equals("NOT-END")) {
            pmList = this.findAllNotEndAndChildrenByUser(username);
        } else {
            pmList = this.findAllAndChildrenByUser(username);
        }

        Long cantidadTotal = 0L;
        if (!filter.equals("not")) {
            resultado.elementos = pmList.stream()
                    .filter(pm -> pm.getNombre().toLowerCase().contains(filter.toLowerCase()))
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = pmList.stream()
                    .filter(pm -> pm.getNombre().toLowerCase().contains(filter.toLowerCase()))
                    .count();
        } else if (cantidad == 0) {
            resultado.elementos = pmList.stream()
                    .filter(pm -> pm.getNombre().toLowerCase().contains(filter.toLowerCase()))
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(pmList.size());
        } else {

            resultado.elementos = pmList.stream()
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(pmList.size());

        }
        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }

    @Override
    public Optional<ProjectManagement> findPMAndChildrenById(Long id) {
        return pmDao.findPMAndChildrenById(id);
    }

    @Override
    public Long findMaxId() {
        return pmDao.findMaxId();
    }

    @Override
    public void saveOrUpdate(ProjectManagement pm) {
        pmDao.saveOrUpdate(pm);
    }

    @Override
    public void deleteById(Long id) {
        pmDao.deleteById(id);
    }
}
