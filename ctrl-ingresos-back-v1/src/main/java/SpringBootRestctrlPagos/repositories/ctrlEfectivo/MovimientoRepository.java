package SpringBootRestctrlPagos.repositories.ctrlEfectivo;


import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Movimiento;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimientoRepository extends CrudRepository<Movimiento, Long> {

    @Query("SELECT m from Movimiento m inner join fetch m.cuenta c inner join fetch c.sobre " +
            "left join fetch m.transaccion t " +
            "left join fetch t.cuentaOrigen co " +
            "left join fetch co.sobre " +
            "left join fetch t.cuentaDestino cd " +
            "left join fetch cd.sobre " +
            "inner join fetch m.usuario " +
            "where m.usuario.username =?1 " +
            "order by m.fecha desc")
    List<Movimiento> findAllAndChildrenByUsername(String username);

    @Query("SELECT m from Movimiento m inner join fetch m.cuenta c inner join fetch c.sobre " +
            "left join fetch m.transaccion t " +
            "left join fetch t.cuentaOrigen co " +
            "left join fetch co.sobre " +
            "left join fetch t.cuentaDestino cd " +
            "left join fetch cd.sobre " +
            "inner join fetch m.usuario " +
            "where m.usuario.username =?1 " +
            "order by m.fecha asc")
    List<Movimiento> findAllAndChildrenByUsernameAsc(String username);

    @Query("SELECT m from Movimiento m inner join fetch m.cuenta c inner join fetch c.sobre " +
            "left join fetch m.transaccion t " +
            "left join fetch t.cuentaOrigen co " +
            "left join fetch co.sobre " +
            "left join fetch t.cuentaDestino cd " +
            "left join fetch cd.sobre " +
            "inner join fetch m.usuario " +
            "where m.id =?1")
    Movimiento findByIdAndChildren(Long id);

    @Query("SELECT m from Movimiento m inner join fetch m.cuenta c inner join fetch c.sobre s " +
            "left join fetch m.transaccion t " +
            "left join fetch t.cuentaOrigen co " +
            "left join fetch co.sobre " +
            "left join fetch t.cuentaDestino cd " +
            "left join fetch cd.sobre " +
            "inner join fetch m.usuario " +
            "where s.id =?1")
    List<Movimiento> findByIdSobreAndChildren(Long id);
}
