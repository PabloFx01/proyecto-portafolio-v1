package SpringBootRestctrlPagos.persistences.ctrlEfectivo;


import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Sobre;
import java.util.List;
import java.util.Optional;

public interface ISobreDAO {

    List<Sobre> findAll();
    List<Sobre> findAllActByUsername(String username);
    List<Sobre> findAllInacByUsername(String username);
    List<Sobre> findAllByUsername(String username);
    Optional<Sobre> findById( Long id);

    Long findMaxId();
    void saveOrUpdate(Sobre sobre);
    void deleteById(Long id);

}
