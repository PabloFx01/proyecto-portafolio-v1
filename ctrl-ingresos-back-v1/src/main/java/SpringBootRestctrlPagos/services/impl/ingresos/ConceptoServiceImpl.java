package SpringBootRestctrlPagos.services.impl.ingresos;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.ingresos.Concepto;
import SpringBootRestctrlPagos.models.entities.ingresos.ConceptoId;
import SpringBootRestctrlPagos.persistences.ingresos.IConceptoDAO;
import SpringBootRestctrlPagos.services.ingresos.IConceptoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConceptoServiceImpl implements IConceptoService {
    @Autowired
    private IConceptoDAO conceptoDAO;
    @Override
    public List<Concepto> findAll() {
        return conceptoDAO.findAll();
    }

    @Override
    public List<Concepto> findAllByUser(String username) {
        return conceptoDAO.findAllByUser(username);
    }

    @Override
    public List<Concepto> findAllActByUser(String username) {
         return conceptoDAO.findAllActByUser(username);
    }

    @Override
    public List<Concepto> findAllInacByUser(String username) {
        return conceptoDAO.findAllInacByUser(username);
    }

    @Override
    public ListadoPaginador<Concepto> findAllWithPagination(Long cantidad, int pagina, String state, String username, String filter) {
        ListadoPaginador<Concepto> resultado = new ListadoPaginador<>();
        List<Concepto> cptoList;
        if (state.equals("ACT")) {
            cptoList = this.findAllActByUser(username);
        } else if (state.equals("INACT")) {
            cptoList = this.findAllInacByUser(username);
        } else {
            cptoList = this.findAllByUser(username);
        }
        Long cantidadTotal = 0L;
        if (filter != null) {
            System.out.println("filter " + filter);
            resultado.elementos = cptoList.stream()
                    .filter(cpto -> cpto.getNombre().toLowerCase().contains(filter.toLowerCase()))
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = cptoList.stream()
                    .filter(cpto -> cpto.getNombre().toLowerCase().contains(filter.toLowerCase()))
                    .count();
        } else {
            resultado.elementos = cptoList.stream()
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(cptoList.size());
        }
        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }

    @Override
    public Optional<Concepto> findById(ConceptoId conceptoId) {
        return conceptoDAO.findById(conceptoId);
    }

    @Override
    public Long findNextIdByUser(Long idUsuario) {
        return conceptoDAO.findNextIdByUser(idUsuario);
    }

    @Override
    public void saveOrUpdate(Concepto concepto) {
        conceptoDAO.saveOrUpdate(concepto);
    }

    @Override
    public void deleteById(ConceptoId conceptoId) {
        conceptoDAO.deleteById(conceptoId);
    }

    @Override
    public void softDeleteById(ConceptoId conceptoId) {

    }

}
