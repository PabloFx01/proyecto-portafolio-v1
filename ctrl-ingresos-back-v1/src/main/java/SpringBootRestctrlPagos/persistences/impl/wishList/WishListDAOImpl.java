package SpringBootRestctrlPagos.persistences.impl.wishList;

import SpringBootRestctrlPagos.models.entities.wishList.WishList;
import SpringBootRestctrlPagos.persistences.wishList.IWishListDAO;
import SpringBootRestctrlPagos.repositories.wishList.WishListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class WishListDAOImpl implements IWishListDAO {
    @Autowired
    private WishListRepository wishListRepository;

    @Override
    public List<WishList> findAllAndChildrenByUser(String username) {
        return wishListRepository.findAllAndChildrenByUser(username);
    }

    @Override
    public List<WishList> findFinWithChildrenByUser(String username) {
        return wishListRepository.findFinWithChildrenByUser(username);
    }

    @Override
    public List<WishList> findNotFinWithChildrenByUser(String username) {
        return wishListRepository.findNotFinWithChildrenByUser(username);
    }

    @Override
    public Optional<WishList> findWLAndChildrenById(Long id) {
        return Optional.ofNullable(wishListRepository.findWLAndChildrenById(id));
    }

    @Override
    public Long findMaxId() {
        return wishListRepository.findMaxId();
    }

    @Override
    public void saveOrUpdate(WishList wishList) {
        wishListRepository.save(wishList);
    }

    @Override
    public void deleteById(Long id) {
        wishListRepository.deleteById(id);
    }
}
