package SpringBootRestctrlPagos.services.wishList;

import SpringBootRestctrlPagos.models.entities.wishList.WishDetailId;
import SpringBootRestctrlPagos.models.entities.wishList.WishListDetail;

import java.util.List;
import java.util.Optional;

public interface IWishListDetailService {
    List<WishListDetail> findAllByIdWish(Long idWish);

    Optional<WishListDetail> findWDByIdAndIdWish(Long id, Long idWish);
    Long findNextIdByIdWish(Long idWish);

    void saveOrUpdate(WishListDetail wishListDetail);

    void deleteById(WishDetailId id);
}
