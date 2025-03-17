package SpringBootRestctrlPagos.services.impl.prestamos;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Sobre;
import SpringBootRestctrlPagos.models.entities.prestamos.Prestamo;
import SpringBootRestctrlPagos.persistences.prestamos.IPrestamoDAO;
import SpringBootRestctrlPagos.services.prestamos.IPrestamoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PrestamoServiceImpl implements IPrestamoService {
    @Autowired
    private IPrestamoDAO prestamoDAO;

    @Override
    public List<Prestamo> findAllAndChildrenByUser(String username) {
        return prestamoDAO.findAllAndChildrenByUser(username);
    }

    @Override
    public List<Prestamo> findAllPaidAndChildrenByUser(String username) {
        return prestamoDAO.findAllPaidAndChildrenByUser(username);
    }

    @Override
    public List<Prestamo> findAllNotPaidAndChildrenByUser(String username) {
        return prestamoDAO.findAllNotPaidAndChildrenByUser(username);
    }

    public ListadoPaginador<Prestamo> findAllWithPaginationByUsername(Long cantidad, int pagina, String filter, String username, String state) {
        ListadoPaginador<Prestamo> resultado = new ListadoPaginador<>();
        List<Prestamo> prestamoList;
        System.out.println("Estado " + state);
        if (state.equals("PAID")) {
            prestamoList = this.findAllPaidAndChildrenByUser(username);
        } else if (state.equals("NOT-PAID")) {
            prestamoList = this.findAllNotPaidAndChildrenByUser(username);
        } else {
            prestamoList = this.findAllAndChildrenByUser(username);
        }

        Long cantidadTotal = 0L;
        if (!filter.equals("not")) {
            resultado.elementos = prestamoList.stream()
                    .filter(prestamo -> prestamo.getTitulo().toLowerCase().contains(filter.toLowerCase()))
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = prestamoList.stream()
                    .filter(prestamo -> prestamo.getTitulo().toLowerCase().contains(filter.toLowerCase()))
                    .count();
        } else if (cantidad == 0) {
            resultado.elementos = prestamoList.stream()
                    .filter(prestamo -> prestamo.getTitulo().toLowerCase().contains(filter.toLowerCase()))
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(prestamoList.size());
        } else {

            resultado.elementos = prestamoList.stream()
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(prestamoList.size());

        }
        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }

    @Override
    public Optional<Prestamo> findPAndChildrenById(Long id) {
        return prestamoDAO.findPAndChildrenById(id);
    }

    @Override
    public Optional<Prestamo> findPById(Long id) {
        return prestamoDAO.findPById(id);
    }

    @Override
    public Long findMaxId() {
        return prestamoDAO.findMaxId();
    }

    @Override
    public void saveOrUpdate(Prestamo prestamo) {
        prestamoDAO.saveOrUpdate(prestamo);
    }

    @Override
    public void deleteById(Long id) {
        prestamoDAO.deleteById(id);
    }
}
