package SpringBootRestctrlPagos.services.impl.metales;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.persistences.metales.*;
import SpringBootRestctrlPagos.services.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MetalServiceImpl implements IMetalService {

    @Autowired
    private IMetalDAO metalDAO;
    @Autowired
    IMetalVentaDAO metalVentaDAO;
    @Autowired
    IInventarioDAO inventarioDAO;

    @Override
    public List<Metal> findAll(String username) {
        return metalDAO.findAll(username);
    }

    @Override
    public List<Metal> findAllAct(String username) {
        return metalDAO.findAllAct(username);
    }

    @Override
    public List<Metal> findAllInact(String username) {
        return metalDAO.findAllInact(username);
    }

    @Override
    public ListadoPaginador<Metal> findAllWithPagination(Long cantidad, int pagina, String state, String filter, String username) {
        ListadoPaginador<Metal> resultado = new ListadoPaginador<>();
        List<Metal> metalList;
        if (state.equals("ACT")) {
            metalList = this.findAllAct(username);
        } else if (state.equals("INACT")) {
            metalList = this.findAllInact(username);
        } else {
            metalList = this.findAll(username);
        }
        Long cantidadTotal = 0L;
        if (!filter.equals("not")) {
            resultado.elementos = metalList.stream()
                    .filter(metal -> metal.getNombre().toLowerCase().contains(filter.toLowerCase()))
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = metalList.stream()
                    .filter(metal -> metal.getNombre().toLowerCase().contains(filter.toLowerCase()))
                    .count();
        } else {
            resultado.elementos = metalList.stream()
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(metalList.size());
        }
        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }


    @Override
    public Optional<Metal> findById(MetalId metalId) {
        return metalDAO.findById(metalId);
    }

    @Override
    public void saveOrUpdate(Metal metal) {
        metalDAO.saveOrUpdate(metal);
    }

    @Override
    public void update(MetalId id, Metal metalFrond) {
        Optional<Metal> metalOptional = this.findById(id);
        if (metalOptional.isPresent()) {
            Metal metalBBDD = metalOptional.get();
                metalBBDD.setPrecio(metalFrond.getPrecio());
                metalBBDD.setNombre(metalFrond.getNombre());
                metalBBDD.setEditadoPor(metalFrond.getEditadoPor());
                metalBBDD.setModificadoEl(new Date());
                this.saveOrUpdate(metalBBDD);

        }
    }

    @Override
    public void softDelete(Metal metal) {
        metal.setFechaFin(new Date());
        this.saveOrUpdate(metal);
    }

    @Override
    public void restaurar(Metal metal) {
        metal.setFechaFin(null);
        this.saveOrUpdate(metal);
    }

    @Override
    public void deleteById(MetalId metalId) {
        metalDAO.deleteById(metalId);
    }
}
