package SpringBootRestctrlPagos.services.impl.wishList;

import SpringBootRestctrlPagos.models.entities.wishList.WishDetailId;
import SpringBootRestctrlPagos.models.entities.wishList.WishListDetail;
import SpringBootRestctrlPagos.persistences.wishList.IWishListDetailDAO;
import SpringBootRestctrlPagos.services.wishList.IWishListDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WishListDetailServiceImpl implements IWishListDetailService {
    @Autowired
    private IWishListDetailDAO dao;

    @Override
    public List<WishListDetail> findAllByIdWish(Long idWish) {
        return dao.findAllByIdWish(idWish);
    }

    @Override
    public Optional<WishListDetail> findWDByIdAndIdWish(Long id, Long idWish) {
        return dao.findWDByIdAndIdWish(id, idWish);
    }

    @Override
    public Long findNextIdByIdWish(Long idWish) {
        return dao.findNextIdByIdWish(idWish);
    }

    @Override
    public void saveOrUpdate(WishListDetail wishListDetail) {
        dao.saveOrUpdate(wishListDetail);
    }

    @Override
    public void deleteById(WishDetailId id) {
        dao.deleteById(id);
    }
}
