package SpringBootRestctrlPagos.services.impl.metales;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.persistences.metales.*;
import SpringBootRestctrlPagos.services.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class InventarioServiceImpl implements IInventarioService {
    @Autowired
    private IInventarioDAO inventarioDAO;
    @Autowired
    private ICalculosService calculosService;

    @Override
    public List<Inventario> findAll() {
        return inventarioDAO.findAll();
    }

    @Override
    public List<Inventario> findAllAndChildren(String username) {
        return inventarioDAO.findAllAndChildren(username);
    }

    @Override
    public ListadoPaginador<Inventario> findAllWithPagination(Long cantidad, int pagina, String filter,String username) {
        ListadoPaginador<Inventario> resultado = new ListadoPaginador<>();
        try {
            List<Inventario> inventarioList = this.findAllAndChildren(username);

            Long cantidadTotal = 0L;
            if (!filter.equals("not")) {
                resultado.elementos = inventarioList.stream()
                        .filter(inventario -> inventario.getMetal().getNombre().toLowerCase().contains(filter.toLowerCase()))
                        .skip(pagina * cantidad)
                        .limit(cantidad)
                        .collect(Collectors.toList());
                cantidadTotal = inventarioList.stream()
                        .filter(inventario -> inventario.getMetal().getNombre().toLowerCase().contains(filter.toLowerCase()))
                        .count();
            } else {
                resultado.elementos = inventarioList.stream()
                        .skip(pagina * cantidad)
                        .limit(cantidad)
                        .collect(Collectors.toList());
                cantidadTotal = Long.valueOf(inventarioList.size());
            }
            resultado.cantidadTotal = cantidadTotal;
        } catch (Exception e) {
            System.out.println(e);
            throw new RuntimeException(e);
        }
        return resultado;
    }

    @Override
    public Optional<Inventario> findByIdAndChildren(Long id, String metalId) {
        return inventarioDAO.findByIdAndChildren(id, metalId);
    }

    @Override
    public Optional<Inventario> findById(InventarioId inventarioId) {
        return inventarioDAO.findById(inventarioId);
    }

    @Override
    public Optional<Inventario> findByIdMetal(String metalId) {
        return inventarioDAO.findByIdMetal(metalId);
    }

    @Override
    public Long nextInventarioId(String username) {
        return inventarioDAO.nextInventarioId(username);
    }

    @Override
    public void saveOrUpdate(Inventario inventario) {
        inventarioDAO.saveOrUpdate(inventario);
    }


    @Override
    public void deleteById(InventarioId inventarioId) {
        inventarioDAO.deleteById(inventarioId);
    }

    @Override
    public void update(Long id, String metalId, Inventario inventario) {

    }

    @Override
    public void calcularInventario(Long idCompra) {

    }


}
