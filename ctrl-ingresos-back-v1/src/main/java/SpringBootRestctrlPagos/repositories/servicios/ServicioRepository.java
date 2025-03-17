package SpringBootRestctrlPagos.repositories.servicios;

import SpringBootRestctrlPagos.models.entities.ingresos.Concepto;
import SpringBootRestctrlPagos.models.entities.ingresos.Ingreso;
import SpringBootRestctrlPagos.models.entities.servicios.Servicio;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ServicioRepository extends CrudRepository<Servicio, Long> {
    @Query("select s from Servicio s inner join fetch s.usuario u where u.username =?1 " +
            "order by s.valor desc")
    List<Servicio> findAllByUser(String username);

    @Query("select s from Servicio s inner join fetch s.usuario u where u.username =?1 " +
            "and s.activo = true " +
            "order by s.valor desc")
    List<Servicio> findAllActByUser(String username);

    @Query("select s from Servicio s inner join fetch s.usuario u where u.username =?1 " +
            "and s.activo = false " +
            "order by s.valor desc")
    List<Servicio> findAllInacByUser(String username);

    @Query("select s from Servicio s inner join fetch s.usuario u " +
            "where s.id=?1 " +
            "order by s.valor desc")
    Servicio findIdAndChildren(Long id);

    @Modifying
    @Query("UPDATE Servicio s SET s.comentario =?1 WHERE s.id =?2")
    void updateComentario(String newComentario, Long id );


}
