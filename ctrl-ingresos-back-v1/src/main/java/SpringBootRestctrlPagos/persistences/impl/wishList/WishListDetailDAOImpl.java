package SpringBootRestctrlPagos.persistences.impl.wishList;

import SpringBootRestctrlPagos.models.entities.wishList.WishDetailId;
import SpringBootRestctrlPagos.models.entities.wishList.WishListDetail;
import SpringBootRestctrlPagos.persistences.wishList.IWishListDetailDAO;
import SpringBootRestctrlPagos.repositories.wishList.WishListDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class WishListDetailDAOImpl implements IWishListDetailDAO {
    @Autowired
    private WishListDetailRepository wishListDetailRepository;

    @Override
    public List<WishListDetail> findAllByIdWish(Long idWish) {
        return wishListDetailRepository.findAllByIdWish(idWish);
    }

    @Override
    public Optional<WishListDetail> findWDByIdAndIdWish(Long id, Long idWish) {
        return Optional.ofNullable(wishListDetailRepository.findWDByIdAndIdWish(id, idWish));
    }

    @Override
    public Long findNextIdByIdWish(Long idWish) {
        return wishListDetailRepository.findNextIdByIdWish(idWish);
    }

    @Override
    public void saveOrUpdate(WishListDetail wishListDetail) {
        wishListDetailRepository.save(wishListDetail);
    }

    @Override
    public void deleteById(WishDetailId id) {
        wishListDetailRepository.deleteById(id);
    }
}
