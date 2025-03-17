package SpringBootRestctrlPagos.repositories.metales;

import SpringBootRestctrlPagos.models.entities.metales.MetalVenta;
import SpringBootRestctrlPagos.models.entities.metales.MetalVentaId;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MetalVentaRepository extends CrudRepository<MetalVenta, MetalVentaId> {
    @Query("SELECT mv from MetalVenta mv where mv.metalVentaId.idMetalCompra=?1 ")
    List<MetalVenta> findAllByIdMetalCompra(String idMetalCompra);

    @Query( "SELECT COALESCE(max(mv.metalVentaId.id),0)+1 FROM MetalVenta mv WHERE mv.metalVentaId.idMetalCompra=?1 " )
    Long nextMetalVentaIdByIdMetalCompra(String idMetalCompra);


}
