package SpringBootRestctrlPagos.services.impl.ctrlEfectivo;


import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Sobre;
import SpringBootRestctrlPagos.persistences.ctrlEfectivo.ISobreDAO;
import SpringBootRestctrlPagos.services.ctrlEfectivo.ISobreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SobreServiceImpl implements ISobreService {
    @Autowired
    private ISobreDAO sobreDAO;

    @Override
    public List<Sobre> findAll() {
        return sobreDAO.findAll();
    }

    @Override
    public List<Sobre> findAllActByUsername(String username) {
        return sobreDAO.findAllActByUsername(username);
    }

    @Override
    public List<Sobre> findAllInacByUsername(String username) {
        return sobreDAO.findAllInacByUsername(username);
    }

    @Override
    public List<Sobre> findAllByUsername(String username) {
        return sobreDAO.findAllByUsername(username);
    }

    @Override
    public ListadoPaginador<Sobre> findAllWithPaginationByUsername(Long cantidad, int pagina, String filter, String username, String state) {
        ListadoPaginador<Sobre> resultado = new ListadoPaginador<>();
        List<Sobre> sobreList;
        if (state.equals("ACT")) {
            sobreList = this.findAllActByUsername(username);
        } else if (state.equals("INACT")) {
            sobreList = this.findAllInacByUsername(username);
        } else {
            sobreList = this.findAllByUsername(username);
        }

        Long cantidadTotal = 0L;
        if (!filter.equals("not")) {
            resultado.elementos = sobreList.stream()
                    .filter(sobre -> sobre.getDescripcion().toLowerCase().contains(filter.toLowerCase()))
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = sobreList.stream()
                    .filter(sobre -> sobre.getDescripcion().toLowerCase().contains(filter.toLowerCase()))
                    .count();
        } else if (cantidad == 0) {
            resultado.elementos = sobreList.stream()
                    .filter(sobre -> sobre.getDescripcion().toLowerCase().contains(filter.toLowerCase()))
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(sobreList.size());
        } else {

            resultado.elementos = sobreList.stream()
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(sobreList.size());

        }
        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }

    @Override
    public Optional<Sobre> findById(Long id) {
        return sobreDAO.findById(id);
    }

    @Override
    public Long findNextId() {
        return sobreDAO.findMaxId();
    }

    @Override
    public void saveOrUpdate(Sobre sobre) {
        sobreDAO.saveOrUpdate(sobre);
    }

    @Override
    public void deleteById(Long id) {
        sobreDAO.deleteById(id);
    }
}
