package SpringBootRestctrlPagos.persistences.impl.servicios;

import SpringBootRestctrlPagos.models.entities.servicios.Servicio;
import SpringBootRestctrlPagos.persistences.servicios.IServicioDAO;
import SpringBootRestctrlPagos.repositories.servicios.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class ServicioDAOImpl implements IServicioDAO {
    @Autowired
    private ServicioRepository servicioRepository;

    @Override
    public List<Servicio> findAll() {
        return (List<Servicio>) servicioRepository.findAll();
    }

    @Override
    public List<Servicio> findAllByUser(String username) {
        return servicioRepository.findAllByUser(username);
    }

    @Override
    public List<Servicio> findAllActByUser(String username) {
        return servicioRepository.findAllActByUser(username);
    }

    @Override
    public List<Servicio> findAllInacByUser(String username) {
        return servicioRepository.findAllInacByUser(username);
    }

    @Override
    public Optional<Servicio> findById(Long idServicio) {
        return servicioRepository.findById(idServicio);
    }

    @Override
    public Optional<Servicio> findIdAndChildren(Long id) {
        return Optional.ofNullable(servicioRepository.findIdAndChildren(id));
    }

    @Override
    public void saveOrUpdate(Servicio servicio) {
        servicioRepository.save(servicio);
    }

    @Override
    public void updateComentario( String newComentario, Long id) {
        servicioRepository.updateComentario(newComentario,id);
    }

    @Override
    public void deleteById(Long idServicio) {
        servicioRepository.deleteById(idServicio);
    }
}
