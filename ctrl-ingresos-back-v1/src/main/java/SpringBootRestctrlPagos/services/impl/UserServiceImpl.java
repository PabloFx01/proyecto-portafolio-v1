package SpringBootRestctrlPagos.services.impl;


import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.persistences.IUserDAO;
import SpringBootRestctrlPagos.services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements IUserService {
    @Autowired
    private IUserDAO userDao;

    @Override
    public List<Usuario> findAll() {
        return (List<Usuario>) userDao.findAll();
    }

    @Override
    public Optional<Usuario> findById(Long id) {
        return userDao.findById(id);
    }

    @Override
    public Optional<Usuario> findByUsernameAndPassword(String username, String password) {
        return userDao.findByUsernameAndPassword(username, password);
    }

    @Override
    public Optional<Usuario> findByUsername(String username) {
        return userDao.findByUsername(username);
    }

    @Override
    public ListadoPaginador<Usuario> findAllWithPagination(Long cantidad, int pagina, String filter) {
        ListadoPaginador<Usuario> resultado = new ListadoPaginador<>();
        List<Usuario> userList = this.findAll();

        Long cantidadTotal = 0L;
        if (filter != null) {
            resultado.elementos = userList.stream()
                    .filter(user -> user.getUsername().toLowerCase().contains(filter.toLowerCase()))
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = userList.stream()
                    .filter(user -> user.getUsername().toLowerCase().contains(filter.toLowerCase()))
                    .count();
        } else {
            resultado.elementos = userList.stream()
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(userList.size());
        }
        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }

    @Override
    public Long findMaxId() {
        return userDao.findMaxId();
    }

    @Override
    public void saveOrUpdate(Usuario user) {
        userDao.saveOrUpdate(user);
    }

    @Override
    public void deleteById(Long id) {
        userDao.deleteById(id);
    }
}
