package SpringBootRestctrlPagos.persistences.servicios;

import SpringBootRestctrlPagos.models.entities.servicios.Servicio;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IServicioDAO {
    List<Servicio> findAll();

    List<Servicio> findAllByUser(String username);

    List<Servicio> findAllActByUser(String username);

    List<Servicio> findAllInacByUser(String username);

    Optional<Servicio> findById(Long idServicio);
    Optional<Servicio> findIdAndChildren(Long id);

    void saveOrUpdate(Servicio servicio);
    public void updateComentario( String newComentario, Long id);

    void deleteById(Long idServicio);
}
