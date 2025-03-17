package SpringBootRestctrlPagos.persistences.impl.servicios;

import SpringBootRestctrlPagos.models.entities.servicios.Factura;
import SpringBootRestctrlPagos.persistences.servicios.IFacturaDAO;
import SpringBootRestctrlPagos.repositories.servicios.FacturaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
@Component
public class FacturaDAOImpl implements IFacturaDAO {
    @Autowired
    private FacturaRepository fRepo;
    @Override
    public List<Factura> findAllAndChildrenByUser(String username) {
        return fRepo.findAllAndChildrenByUser(username);
    }
    @Override
    public List<Factura> findAllByUser(String username) {
        return fRepo.findAllByUser(username);
    }
    @Override
    public List<Factura> findAllAndChildrenPaidByUser(String username) {
        return fRepo.findAllAndChildrenPaidByUser(username);
    }
    @Override
    public List<Factura> findAllAndChildrenNotPaidByUser(String username) {
        return fRepo.findAllAndChildrenNotPaidByUser(username);
    }
    @Override
    public List<Factura> findAllPaidByUser(String username) {
        return fRepo.findAllPaidByUser(username);
    }

    @Override
    public List<Factura> findAllNotPaidByUser(String username) {
        return fRepo.findAllNotPaidByUser(username);
    }

    @Override
    public List<Factura> findAllAndChildrenByUserAndService(String username, Long idService) {
        return fRepo.findAllAndChildrenByUserAndService(username, idService);
    }

    @Override
    public List<Factura> findAllByUserAndService(String username, Long idService) {
        return fRepo.findAllByUserAndService(username, idService);
    }

    @Override
    public List<Factura> findAllAndChildrenPaidByUserAndService(String username, Long idService) {
        return fRepo.findAllAndChildrenPaidByUserAndService(username, idService);
    }

    @Override
    public List<Factura> findAllAndChildrenNotPaidByUserAndService(String username, Long idService) {
        return fRepo.findAllAndChildrenNotPaidByUserAndService(username, idService);
    }

    @Override
    public List<Factura> findAllPaidByUserAndService(String username, Long idService) {
        return findAllPaidByUserAndService(username, idService);
    }

    @Override
    public List<Factura> findAllNotPaidByUserAndService(String username, Long idService) {
        return fRepo.findAllNotPaidByUserAndService(username, idService);
    }

    @Override
    public Optional<Factura> findFAndChildrenById(Long id) {
        return Optional.ofNullable(fRepo.findFAndChildrenById(id));
    }

    @Override
    public Optional<Factura> findFById(Long id) {
        return fRepo.findById(id);
    }

    @Override
    public Long findMaxId() {
        return fRepo.findMaxId();
    }

    @Override
    public void saveOrUpdate(Factura factura) {
        fRepo.save(factura);
    }

    @Override
    public void deleteById(Long idFactura) {
        fRepo.deleteById(idFactura);
    }
}
