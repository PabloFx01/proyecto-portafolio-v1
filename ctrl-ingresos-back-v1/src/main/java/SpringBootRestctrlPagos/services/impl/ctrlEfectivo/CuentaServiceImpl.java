package SpringBootRestctrlPagos.services.impl.ctrlEfectivo;

import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Cuenta;
import SpringBootRestctrlPagos.persistences.ctrlEfectivo.ICuentaDAO;
import SpringBootRestctrlPagos.services.ctrlEfectivo.ICuentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import SpringBootRestctrlPagos.models.ListadoPaginador;

import java.util.List;
import java.util.Optional;

@Service
public class CuentaServiceImpl implements ICuentaService {
    @Autowired
    private ICuentaDAO cuentaDAO;

    @Override
    public List<Cuenta> findAll() {
        return cuentaDAO.findAll();
    }

    @Override
    public List<Cuenta> findAllFromSobreActByUsername(String username) {
        return cuentaDAO.findAllFromSobreActByUsername(username);
    }

    @Override
    public ListadoPaginador<Cuenta> findAllWithPaginationByUsername(Long cantidad, int pagina, String filter, String username) {
/*        ListadoPaginador<Cuenta> resultado = new ListadoPaginador<>();
        List<Cuenta> cuentaList = this.findAll();

        Long cantidadTotal = 0L;
        if (filter != null) {
            resultado.elementos = cuentaList.stream()
                    .filter(cuenta -> cuenta.get().toLowerCase().contains(filter.toLowerCase()))
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = cuentaList.stream()
                    .filter(cuenta -> cuenta.getDescripcion().toLowerCase().contains(filter.toLowerCase()))
                    .count();
        } else {
            resultado.elementos = cuentaList.stream()
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(cuentaList.size());
        }
        resultado.cantidadTotal = cantidadTotal;
        return resultado;*/
        return null;
    }

    @Override
    public Optional<Cuenta> findById(Long id) {
        return cuentaDAO.findById(id);
    }

    @Override
    public Optional<Cuenta> findByIdSobre(Long id) {
        return cuentaDAO.findByIdSobre(id);
    }

    @Override
    public Long findMaxId() {
        return cuentaDAO.findMaxId();
    }

    @Override
    public void saveOrUpdate(Cuenta cuenta) {
        cuentaDAO.saveOrUpdate(cuenta);
    }

    @Override
    public void deleteById(Long id) {
        cuentaDAO.deleteById(id);
    }
}
