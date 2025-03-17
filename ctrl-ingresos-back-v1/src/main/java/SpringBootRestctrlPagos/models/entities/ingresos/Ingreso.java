package SpringBootRestctrlPagos.models.entities.ingresos;

import SpringBootRestctrlPagos.models.entities.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "tbl_ingresos")
public class Ingreso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "monto_ingreso")
    private Double montoIngreso;
    @Column(name = "fecha_deposito")
    private Date fechaDeposito;
    @Enumerated(EnumType.STRING)
    private TipoMoneda tMoneda;
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "ingreso", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleIngreso> detallesIngreso;
    private String comentario;
    private boolean asociarConceptos;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id", nullable = false)
    private Usuario usuario;

}
