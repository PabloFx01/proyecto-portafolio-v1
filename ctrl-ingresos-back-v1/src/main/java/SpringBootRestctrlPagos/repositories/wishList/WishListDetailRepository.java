package SpringBootRestctrlPagos.repositories.wishList;

import SpringBootRestctrlPagos.models.entities.wishList.WishDetailId;
import SpringBootRestctrlPagos.models.entities.wishList.WishListDetail;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishListDetailRepository extends CrudRepository<WishListDetail, WishDetailId> {
    @Query("select wd from WishListDetail wd " +
            "where wd.wishDetailId.idWish =?1")
    List<WishListDetail> findAllByIdWish(Long idWish);


    @Query("select wd from WishListDetail wd " +
           "where wd.wishDetailId.id =?1 and wd.wishDetailId.idWish =?2")
    WishListDetail findWDByIdAndIdWish(Long id, Long idWish);


    @Query("SELECT COALESCE(max(wd.wishDetailId.id),0) + 1  from WishListDetail wd " +
            "where wd.wishDetailId.idWish =?1")
    Long findNextIdByIdWish(Long idWish);

}
