package SpringBootRestctrlPagos.services.ctrlEfectivo;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Sobre;

import java.util.List;
import java.util.Optional;

public interface ISobreService {
    List<Sobre> findAll();
    List<Sobre> findAllActByUsername(String username);
    List<Sobre> findAllInacByUsername(String username);
    List<Sobre> findAllByUsername(String username);
    ListadoPaginador<Sobre> findAllWithPaginationByUsername(Long cantidad, int pagina, String filter, String username, String state);
    Optional<Sobre> findById(Long id);
    Long findNextId();
    void saveOrUpdate(Sobre sobre);
    void deleteById(Long id);
}
