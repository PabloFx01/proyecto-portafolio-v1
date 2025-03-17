package SpringBootRestctrlPagos.repositories.wishList;

import SpringBootRestctrlPagos.models.entities.wishList.WishList;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishListRepository extends CrudRepository<WishList,Long> {
    @Query("select w from WishList w " +
            "left join fetch w.wishListDetails wd " +
            "inner join fetch w.cuentaOrigen co " +
            "inner join fetch co.sobre " +
            "inner join fetch w.usuario usu " +
            "where usu.username =?1 " +
            "order by w.id desc")
    List<WishList> findAllAndChildrenByUser(String username);
    @Query("select w from WishList w " +
            "left join fetch w.wishListDetails wd " +
            "inner join fetch w.cuentaOrigen co " +
            "inner join fetch co.sobre " +
            "inner join fetch w.usuario usu " +
            "where w.estado = true and usu.username =?1 " +
            "order by w.id desc")
    List<WishList> findFinWithChildrenByUser(String username);

    @Query("select w from WishList w " +
            "left join fetch w.wishListDetails wd " +
            "inner join fetch w.cuentaOrigen co " +
            "inner join fetch co.sobre " +
            "inner join fetch w.usuario usu " +
            "where w.estado = false and usu.username =?1 " +
            "order by w.id desc")
    List<WishList> findNotFinWithChildrenByUser(String username);

    @Query("select w from WishList w " +
            "left join fetch w.wishListDetails wd " +
            "inner join fetch w.cuentaOrigen co " +
            "inner join fetch co.sobre " +
            "inner join fetch w.usuario usu " +
            "where w.id =?1 " +
            "order by w.id desc")
    WishList findWLAndChildrenById(Long id);

    @Query("SELECT max(w.id) from WishList w ")
    Long findMaxId() ;
}
