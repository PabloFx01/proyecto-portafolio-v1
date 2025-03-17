package SpringBootRestctrlPagos.persistences.ctrlEfectivo;

import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Cuenta;
import java.util.List;
import java.util.Optional;

public interface ICuentaDAO {

    List<Cuenta> findAll();
    List<Cuenta> findAllFromSobreActByUsername(String username);
    Optional<Cuenta> findById( Long id);
    Optional<Cuenta> findByIdSobre(Long id) ;

    Long findMaxId() ;
    void saveOrUpdate(Cuenta cuenta);
    void deleteById(Long id);



}
