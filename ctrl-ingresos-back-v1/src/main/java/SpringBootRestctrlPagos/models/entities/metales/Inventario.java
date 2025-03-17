package SpringBootRestctrlPagos.models.entities.metales;

import SpringBootRestctrlPagos.models.entities.Usuario;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tbl_inventario")
public class Inventario {
    @EmbeddedId
    private InventarioId inventarioId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "metal_id", referencedColumnName = "id",  nullable = false, insertable=false, updatable=false)
    private Metal metal;
    private BigDecimal stock;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name = "fecha_ini")
    private Date fechaIni;
    @Column(name = "importe_total")
    private BigDecimal importeTotal;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name= "fecha_ult_act")
    private Date fechaUltAct;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id", nullable = false)
    private Usuario usuario;
}
