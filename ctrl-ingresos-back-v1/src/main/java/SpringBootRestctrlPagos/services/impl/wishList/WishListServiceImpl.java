package SpringBootRestctrlPagos.services.impl.wishList;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.wishList.WishList;
import SpringBootRestctrlPagos.persistences.wishList.IWishListDAO;
import SpringBootRestctrlPagos.services.wishList.IWishListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WishListServiceImpl implements IWishListService {
    @Autowired
    private IWishListDAO dao;

    @Override
    public List<WishList> findAllAndChildrenByUser(String username) {
        return dao.findAllAndChildrenByUser(username);
    }

    @Override
    public List<WishList> findFinWithChildrenByUser(String username) {
        return dao.findFinWithChildrenByUser(username);
    }

    @Override
    public List<WishList> findNotFinWithChildrenByUser(String username) {
        return dao.findNotFinWithChildrenByUser(username);
    }

    @Override
    public ListadoPaginador<WishList> findAllWithPaginationByUsername(Long cantidad, int pagina, String filter, String username, String state) {
        ListadoPaginador<WishList> resultado = new ListadoPaginador<>();
        List<WishList> wishList;

        if (state.equals("FIN")) {
            wishList = this.findFinWithChildrenByUser(username);
        } else if (state.equals("NOT-FIN")) {
            wishList = this.findNotFinWithChildrenByUser(username);
        } else {
            wishList = this.findAllAndChildrenByUser(username);
        }

        Long cantidadTotal = 0L;
        if (!filter.equals("not")) {
            resultado.elementos = wishList.stream()
                    .filter(wish -> wish.getTitulo().toLowerCase().contains(filter.toLowerCase()))
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = wishList.stream()
                    .filter(wish -> wish.getTitulo().toLowerCase().contains(filter.toLowerCase()))
                    .count();
        } else if (cantidad == 0) {
            resultado.elementos = wishList.stream()
                    .filter(wish -> wish.getTitulo().toLowerCase().contains(filter.toLowerCase()))
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(wishList.size());
        } else {

            resultado.elementos = wishList.stream()
                    .skip(pagina * cantidad)
                    .limit(cantidad)
                    .collect(Collectors.toList());
            cantidadTotal = Long.valueOf(wishList.size());

        }
        resultado.cantidadTotal = cantidadTotal;
        return resultado;
    }

    @Override
    public Optional<WishList> findWLAndChildrenById(Long id) {
        return dao.findWLAndChildrenById(id);
    }

    @Override
    public Long findMaxId() {
        return dao.findMaxId();
    }

    @Override
    public void saveOrUpdate(WishList wishList) {
        dao.saveOrUpdate(wishList);
    }

    @Override
    public void deleteById(Long id) {
        dao.deleteById(id);
    }
}
