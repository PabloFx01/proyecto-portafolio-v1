package SpringBootRestctrlPagos.models.entities.ctrlEfectivo;

import SpringBootRestctrlPagos.models.entities.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "tbl_movimientos")
public class Movimiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    //@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date fecha;
    @Column(name = "tipo_movimiento")
    private String tipoMovimiento;
    private String comentario;
    private Double monto;
    @ManyToOne(fetch = FetchType.LAZY )
    @JoinColumn(name = "id_cuenta", referencedColumnName = "id")
    private Cuenta cuenta;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_transaccion", referencedColumnName = "id")
    private Transaccion transaccion;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id", nullable = false)
    private Usuario usuario;
}
