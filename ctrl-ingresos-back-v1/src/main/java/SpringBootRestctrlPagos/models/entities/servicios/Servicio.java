package SpringBootRestctrlPagos.models.entities.servicios;

import SpringBootRestctrlPagos.models.entities.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tbl_servicios")
public class Servicio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private Double valor;
    @Column(name = "periodo_pago")
    private Double periodoPago;
    @Column(name = "fecha_ini_vto")
    private Date fechaIniVto;
    @Column(name = "fecha_fin_vto")
    private Date fechaFinVto;
    private String comentario;
    private boolean activo;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id", nullable = false)
    private Usuario usuario;

}
