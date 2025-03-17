package SpringBootRestctrlPagos.services.impl.ctrlEfectivo;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Transaccion;
import SpringBootRestctrlPagos.persistences.ctrlEfectivo.ITransaccionDAO;
import SpringBootRestctrlPagos.services.ctrlEfectivo.ITransaccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransaccionServiceImpl implements ITransaccionService {
    @Autowired
    private ITransaccionDAO transaccionDAO;

    @Override
    public List<Transaccion> findAll() {
        return transaccionDAO.findAll();
    }

    @Override
    public ListadoPaginador<Transaccion> findAllWithPagination(Long cantidad, int pagina, String filter) {
        ListadoPaginador<Transaccion> resultado = new ListadoPaginador<>();
        List<Transaccion> transaccionList = this.findAllAndChildren();

        Long cantidadTotal = 0L;
        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }

    @Override
    public List<Transaccion> findAllAndChildren() {
        return transaccionDAO.findAllAndChildren();
    }

    @Override
    public Optional<Transaccion> findById(Long id) {
        return transaccionDAO.findById(id);
    }

    @Override
    public Optional<Transaccion> findByIdAndChildren(Long id) {
        return transaccionDAO.findByIdAndChildren(id);
    }

    @Override
    public Long findMaxId() {
        return transaccionDAO.findMaxId();
    }

    @Override
    public void saveOrUpdate(Transaccion transaccion) {
        transaccionDAO.saveOrUpdate(transaccion);
    }

    @Override
    public void deleteById(Long id) {
        transaccionDAO.deleteById(id);
    }
}
