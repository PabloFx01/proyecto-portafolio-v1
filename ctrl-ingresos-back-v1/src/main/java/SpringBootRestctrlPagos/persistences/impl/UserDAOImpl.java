package SpringBootRestctrlPagos.persistences.impl;


import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.persistences.IUserDAO;
import SpringBootRestctrlPagos.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class UserDAOImpl implements IUserDAO {
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Usuario> findAll() {
        return (List<Usuario>) userRepository.findAll();
    }

    @Override
    public Optional<Usuario> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<Usuario> findByUsernameAndPassword(String username, String password) {
        return Optional.ofNullable(userRepository.findByUsernameAndPassword(username, password));
    }

    @Override
    public Optional<Usuario> findByUsername(String username) {
        return Optional.ofNullable(userRepository.findByUsername(username));
    }

    @Override
    public Long findMaxId() {
        return userRepository.findMaxId();
    }

    @Override
    public void saveOrUpdate(Usuario user) {
        userRepository.save(user);
    }

    @Override
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }
}
