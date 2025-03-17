package SpringBootRestctrlPagos.services.ctrlEfectivo;


import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Cuenta;

import java.util.List;
import java.util.Optional;

public interface ICuentaService {
    List<Cuenta> findAll();
    List<Cuenta> findAllFromSobreActByUsername(String username);
    ListadoPaginador<Cuenta> findAllWithPaginationByUsername(Long cantidad, int pagina, String filter, String username);
    Optional<Cuenta> findById(Long id);
    Optional<Cuenta> findByIdSobre(Long id) ;
    Long findMaxId() ;
    void saveOrUpdate(Cuenta cuenta);
    void deleteById(Long id);
}
