package SpringBootRestctrlPagos.repositories.ingresos;

import SpringBootRestctrlPagos.models.entities.ingresos.DetalleIngreso;
import SpringBootRestctrlPagos.models.entities.ingresos.DetalleIngresoId;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleIngresoRepository extends CrudRepository<DetalleIngreso, DetalleIngresoId> {
    @Query("select di from DetalleIngreso di " +
            "left join fetch di.concepto c " +
            "left join fetch di.pctXCpto pc " +
            "inner join fetch di.usuario usu where di.detalleIngresoId.idIngreso =?1")
    List<DetalleIngreso> findAllAndChildrenByIdIngreso(Long idIngreso);

    @Query("select di from DetalleIngreso di inner join fetch di.usuario usu where " +
            "di.detalleIngresoId.idIngreso =?1")
    List<DetalleIngreso> findAllByIdIngreso( Long idIngreso);

    @Query("select di from DetalleIngreso di " +
            "left join fetch di.concepto c " +
            "left join fetch di.pctXCpto pc " +
            "inner join fetch di.usuario usu where di.detalleIngresoId.id =?1 and di.detalleIngresoId.idIngreso =?2")
    DetalleIngreso findDIAndChildrenByIdAndIdIngreso(Long id, Long idIngreso);

    @Query("select di from DetalleIngreso di " +
            "left join fetch di.concepto c " +
            "left join fetch di.pctXCpto pc " +
            "inner join fetch di.usuario usu where c.nombre =  :concepto and di.detalleIngresoId.idIngreso = :idIngreso")
    DetalleIngreso findDIAndChildrenByConceptoAndIdIngreso(@Param("concepto") String concepto, @Param("idIngreso") Long idIngreso);
    //DetalleIngreso findDIAndChildrenByConceptoAndIdIngreso(@Param("concepto") String concepto, Long idIngreso);

    @Query("SELECT max(di.id) from DetalleIngreso di where di.detalleIngresoId.idIngreso =?1 ")
    Long findMaxIdByIdIngreso(Long idIngreso) ;

    @Modifying
    @Query("UPDATE DetalleIngreso di SET di.pctXCpto.montoAsigRest = 0.0 where di.detalleIngresoId.idIngreso = :idIngreso")
    void updateTotalRestByIdIngreso(@Param("idIngreso") Long idIngreso);
}
