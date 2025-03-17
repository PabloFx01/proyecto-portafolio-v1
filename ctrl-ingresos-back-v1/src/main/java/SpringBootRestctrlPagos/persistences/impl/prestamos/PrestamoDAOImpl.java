package SpringBootRestctrlPagos.persistences.impl.prestamos;

import SpringBootRestctrlPagos.models.entities.prestamos.Prestamo;
import SpringBootRestctrlPagos.persistences.prestamos.IPrestamoDAO;
import SpringBootRestctrlPagos.repositories.prestamos.PrestamoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
@Component
public class PrestamoDAOImpl implements IPrestamoDAO {
    @Autowired
    private PrestamoRepository prestamoRepository;

    @Override
    public List<Prestamo> findAllAndChildrenByUser(String username) {
        return prestamoRepository.findAllAndChildrenByUser(username);
    }

    @Override
    public List<Prestamo> findAllPaidAndChildrenByUser(String username) {
        return prestamoRepository.findAllPaidAndChildrenByUser(username);
    }

    @Override
    public List<Prestamo> findAllNotPaidAndChildrenByUser(String username) {
        return prestamoRepository.findAllNotPaidAndChildrenByUser(username);
    }

    @Override
    public Optional<Prestamo> findPAndChildrenById(Long id) {
        return Optional.ofNullable(prestamoRepository.findPAndChildrenById(id));
    }

    @Override
    public Optional<Prestamo> findPById(Long id) {
        return prestamoRepository.findById(id);
    }

    @Override
    public Long findMaxId() {
        return prestamoRepository.findMaxId();
    }

    @Override
    public void saveOrUpdate(Prestamo prestamo) {
        prestamoRepository.save(prestamo);
    }

    @Override
    public void deleteById(Long id) {
        prestamoRepository.deleteById(id);
    }
}
