package SpringBootRestctrlPagos.persistences.impl.metales;

import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.persistences.metales.*;
import SpringBootRestctrlPagos.repositories.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
@Component
public class CompraDAOImpl implements ICompraDAO {
    @Autowired
    private CompraRepository compraRepository;

    @Override
    public List<Compra> findAll() {
        return (List<Compra>) compraRepository.findAll();
    }
    @Override
    public List<Compra>findAllAndChildren(){return compraRepository.findAllAndChildren("");}

    @Override
    public List<Compra> findAllAndChildrenByIdVenta(Long idVenta,String username) {
        return compraRepository.findAllAndChildrenByIdVenta(idVenta, username);
    }

    @Override
    public List<Compra> findAllAndChildrenNotIdVenta(String username) {
        return compraRepository.findAllAndChildrenNotIdVenta(username);
    }

    @Override
    public List<Compra> findAllAndChildrenWithVenta(String username) {
        return compraRepository.findAllAndChildrenWithVenta(username);
    }

    @Override
    public Optional<Compra> findByIdAndChildren(Long id) {
        return Optional.ofNullable(compraRepository.findByIdAndChildren(id));
    }

    @Override
    public Optional<Compra> findById(Long id) {
        return compraRepository.findById(id);
    }

    @Override
    public Long findMaxId(String username) {
        return compraRepository.findMaxId(username);
    }

    @Override
    public void saveOrUpdate(Compra compra) {
        compraRepository.save(compra);
    }

    @Override
    public void deleteById(Long id) {
        compraRepository.deleteById(id);
    }
}
