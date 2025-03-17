package SpringBootRestctrlPagos.persistences.wishList;

import SpringBootRestctrlPagos.models.entities.prestamos.Prestamo;
import SpringBootRestctrlPagos.models.entities.wishList.WishList;

import java.util.List;
import java.util.Optional;

public interface IWishListDAO {
    List<WishList> findAllAndChildrenByUser(String username);
    List<WishList> findFinWithChildrenByUser(String username);

    List<WishList> findNotFinWithChildrenByUser(String username);

    Optional<WishList> findWLAndChildrenById(Long id);

    Long findMaxId();

    void saveOrUpdate(WishList wishList);

    void deleteById(Long id);


}
