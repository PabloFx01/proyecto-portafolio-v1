package SpringBootRestctrlPagos.services.servicios;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.servicios.Servicio;

import java.util.List;
import java.util.Optional;

public interface IServicioService {
    List<Servicio> findAll();

    List<Servicio> findAllByUser(String username);

    List<Servicio> findAllActByUser(String username);

    List<Servicio> findAllInacByUser(String username);

    ListadoPaginador<Servicio> findAllWithPagination(Long cantidad, int pagina, String state, String username, String filter);

    Optional<Servicio> findById(Long idServicio);
    Optional<Servicio> findIdAndChildren(Long id);

    void saveOrUpdate(Servicio servicio);

    public void updateComentario( String newComentario, Long id);
    public void updateServicios(String username);

    void deleteById(Long idServicio);

    void softDeleteById(Long idServicio);
}
