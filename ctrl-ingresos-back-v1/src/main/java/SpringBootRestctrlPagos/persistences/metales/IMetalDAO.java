package SpringBootRestctrlPagos.persistences.metales;

import SpringBootRestctrlPagos.models.entities.metales.Metal;
import SpringBootRestctrlPagos.models.entities.metales.MetalId;

import java.util.List;
import java.util.Optional;

public interface IMetalDAO {
    List<Metal> findAll(String username);
    List<Metal> findAllAct(String username);
    List<Metal> findAllInact(String username);
    Optional<Metal> findById(MetalId metalId);
    void saveOrUpdate(Metal metal);
    void deleteById(MetalId metalId);

}
