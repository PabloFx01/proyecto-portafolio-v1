package SpringBootRestctrlPagos.models.entities.wishList;

import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Cuenta;
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
@Table(name = "tbl_wish_list")
public class WishList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "wishList", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WishListDetail> wishListDetails;
    private String titulo;
    @Column(name = "fecha_creacion")
    private Date fechaCreacion;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String meta;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cuenta_origen", referencedColumnName = "id")
    private Cuenta cuentaOrigen;
    private boolean estado;
    @Column(name = "fecha_fin")
    private Date fechaFin;
    @Column(name = "procesar_wish")
    private boolean procesarWish;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id", nullable = false)
    private Usuario usuario;
}
