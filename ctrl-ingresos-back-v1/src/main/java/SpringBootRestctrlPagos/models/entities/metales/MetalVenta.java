package SpringBootRestctrlPagos.models.entities.metales;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tbl_metales_venta")
public class MetalVenta {

    @EmbeddedId
    private MetalVentaId metalVentaId;
    private String descripcion;
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_metal_compra", referencedColumnName = "id", insertable = false, updatable = false)
    private Metal metalCompra;
    @Column(name = "editado_por")
    private String editadoPor;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name = "modificado_el")
    private Date modificadoEl;


}
