package SpringBootRestctrlPagos.models.entities.ingresos;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tbl_pct_x_concepto")
public class PorcentajeXConcepto {
    @EmbeddedId
    private PctXConceptoId pctXConceptoId;
    @Column(name = "monto_asig_rest")
    private Double montoAsigRest;
    @Column(name = "monto_asig_real_efec")
    private Double montoAsigRealEfec;
    @Column(name = "monto_asig_real_dig")
    private Double montoAsigRealDig;
/*    @OneToOne
    @JoinColumns({
            @JoinColumn(name = "id_detalle_ingreso", referencedColumnName = "id", nullable = false, insertable = false, updatable = false),
            @JoinColumn(name = "id_ingreso", referencedColumnName = "id_ingreso", nullable = false, insertable = false, updatable = false)
    })
    private DetalleIngreso dtIngreso;*/

    public Long generaId(String idSemana, String idIngreso) {
        String sId = idSemana + idIngreso;
        return Long.valueOf(sId);
    }
}
