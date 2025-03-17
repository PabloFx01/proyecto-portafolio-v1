package SpringBootRestctrlPagos.services.wishList;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.wishList.WishList;

import java.util.List;
import java.util.Optional;

public interface IWishListService {
    List<WishList> findAllAndChildrenByUser(String username);
    List<WishList> findFinWithChildrenByUser(String username);
    List<WishList> findNotFinWithChildrenByUser(String username);

    ListadoPaginador<WishList> findAllWithPaginationByUsername(Long cantidad, int pagina, String filter, String username, String state);
    Optional<WishList> findWLAndChildrenById(Long id);

    Long findMaxId();

    void saveOrUpdate(WishList wishList);

    void deleteById(Long id);
}
