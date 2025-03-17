package SpringBootRestctrlPagos.services.metales;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.metales.*;

import java.util.List;
import java.util.Optional;
//Aquí se realiza toda la lógica requerida para la app web(cálculos y demás)
public interface IMetalService {
    List<Metal> findAll(String username);
    List<Metal> findAllAct(String username);
    List<Metal> findAllInact(String username);
    ListadoPaginador<Metal> findAllWithPagination(Long cantidad, int pagina, String state, String filter, String username);
    Optional<Metal> findById(MetalId metalId);
    void saveOrUpdate(Metal metal);
    void update(MetalId id, Metal metal);
    void softDelete(Metal metal);
    void restaurar(Metal metal);
    void deleteById(MetalId metalId);
}
