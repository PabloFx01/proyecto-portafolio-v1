package SpringBootRestctrlPagos.models.entities.ingresos;

import SpringBootRestctrlPagos.models.entities.Usuario;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "tbl_detalles_ingreso")
public class DetalleIngreso {
    @EmbeddedId
    private DetalleIngresoId detalleIngresoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "id_concepto", referencedColumnName = "id", nullable = false, insertable = true, updatable = false),
            @JoinColumn(name = "id_usuario", referencedColumnName = "id_usuario", nullable = false, insertable = true, updatable = false)
    })
    private Concepto concepto;
    @Column(name = "monto_porcentaje")
    private Double montoPorcentaje;
    @Column(name = "monto_porcentaje_rest")
    private Double montoPorcentajeRest;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumns({
            @JoinColumn(name = "id_pct_x_cpto", referencedColumnName = "id",nullable = false, insertable = false, updatable = false),
            @JoinColumn(name = "id", referencedColumnName = "id_detalle_ingreso",nullable = false, insertable = false, updatable = false),
            @JoinColumn(name = "id_ingreso", referencedColumnName = "id_ingreso",nullable = false, insertable = false, updatable = false)
    })
    private PorcentajeXConcepto pctXCpto;

    @Column(name = "id_pct_x_cpto")
    private Long idPctXCpto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_ingreso", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    @JsonIgnore
    private Ingreso ingreso;
}
