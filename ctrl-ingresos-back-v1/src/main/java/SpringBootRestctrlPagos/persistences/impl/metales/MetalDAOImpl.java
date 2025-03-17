package SpringBootRestctrlPagos.persistences.impl.metales;

import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.persistences.metales.*;
import SpringBootRestctrlPagos.repositories.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class MetalDAOImpl implements IMetalDAO {
    @Autowired
    private MetalRepository metalRepository;

    @Override
    public List<Metal> findAll(String username) {
        return (List<Metal>) metalRepository.findAllByUsername(username);
    }

    @Override
    public List<Metal> findAllAct(String username) {
        return (List<Metal>) metalRepository.findAllAct(username);
    }

    @Override
    public List<Metal> findAllInact(String username) {
        return metalRepository.findAllInact(username);
    }


    @Override
    public Optional<Metal> findById(MetalId metalId) {
        return Optional.ofNullable(metalRepository.findMetalById(metalId.getId()));
    }

    @Override
    public void saveOrUpdate(Metal metal) {
        metalRepository.save(metal);
    }

    @Override
    public void deleteById(MetalId metalId) {
        metalRepository.deleteById(metalId);
    }
}
