package SpringBootRestctrlPagos.services.metales;

import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.metales.*;


import java.util.List;
import java.util.Optional;

public interface ICompraService {
    List<Compra> findAll();

    ListadoPaginador<Compra> findAllWithPagination(Long cantidad, int pagina, String username);

    ListadoPaginador<Compra> findAllWithVentaPagination(Long cantidad, int pagina,
                                                        String startBuyFilter,
                                                        String endBuyFilter,
                                                        String startSaleFilter,
                                                        String endSaleFilter,
                                                        String descriptionSaleFilter,
                                                        String username);

    List<Compra> findAllWithVenta(Long cantidad, int pagina,
                                  String startBuyFilter,
                                  String endBuyFilter,
                                  String startSaleFilter,
                                  String endSaleFilter,
                                  String descriptionSaleFilter,
                                  String username);

    public List<Compra> findAllAndChildren();

    List<Compra> findAllAndChildrenByIdVenta(Long idVenta, String username);

    List<Compra> findAllAndChildrenNotIdVenta(String username);

    List<Compra> findAllAndChildrenWithVenta(String username);

    Optional<Compra> findById(Long id);

    Optional<Compra> findByIdAndChildren(Long id);

    Long findMaxId(String username);

    void cerrarDia(Long id);

    void saveOrUpdate(Compra compra);

    void update(Long id, Compra compra);

    void deleteById(Long id);

}
