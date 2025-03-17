package SpringBootRestctrlPagos.repositories.prestamos;

import SpringBootRestctrlPagos.models.entities.prestamos.Prestamo;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrestamoRepository extends CrudRepository<Prestamo, Long> {
    @Query("select p from Prestamo p " +
            "left join fetch p.detallePrestamo dp " +
            "inner join fetch p.cuentaOrigen co " +
            "inner join fetch co.sobre " +
            "inner join fetch p.cuentaBeneficiario cb " +
            "inner join fetch cb.sobre " +
            "inner join fetch p.usuario usu " +
            "where usu.username =?1 " +
            "order by p.id desc")
    List<Prestamo> findAllAndChildrenByUser(String username);
    @Query("select p from Prestamo p " +
            "left join fetch p.detallePrestamo dp " +
            "inner join fetch p.cuentaOrigen co " +
            "inner join fetch co.sobre " +
            "inner join fetch p.cuentaBeneficiario cb " +
            "inner join fetch cb.sobre " +
            "inner join fetch p.usuario usu " +
            "where p.estado = true and usu.username =?1 " +
            "order by p.id desc")
    List<Prestamo> findAllPaidAndChildrenByUser(String username);

    @Query("select p from Prestamo p " +
            "left join fetch p.detallePrestamo dp " +
            "inner join fetch p.cuentaOrigen co " +
            "inner join fetch co.sobre " +
            "inner join fetch p.cuentaBeneficiario cb " +
            "inner join fetch cb.sobre " +
            "inner join fetch p.usuario usu " +
            "where p.estado = false and usu.username =?1 " +
            "order by p.id desc")
    List<Prestamo> findAllNotPaidAndChildrenByUser(String username);

    @Query("select p from Prestamo p " +
            "left join fetch p.detallePrestamo dp " +
            "inner join fetch p.cuentaOrigen co " +
            "inner join fetch co.sobre " +
            "inner join fetch p.cuentaBeneficiario cb " +
            "inner join fetch cb.sobre " +
            "inner join fetch p.usuario usu " +
            "where p.id =?1 " +
            "order by p.id desc")
    Prestamo findPAndChildrenById(Long id);

    @Query("select p from Prestamo p " +
            "inner join fetch p.cuentaOrigen co " +
            "inner join fetch co.sobre " +
            "inner join fetch p.cuentaBeneficiario cb " +
            "inner join fetch cb.sobre " +
            "inner join fetch p.usuario usu " +
            "where p.id =?1 " +
            "order by p.id desc")
    Prestamo findPById(Long id);

    @Query("SELECT max(p.id) from Prestamo p ")
    Long findMaxId() ;
}
