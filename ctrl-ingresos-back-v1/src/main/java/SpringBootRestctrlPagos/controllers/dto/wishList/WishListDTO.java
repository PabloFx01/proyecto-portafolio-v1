package SpringBootRestctrlPagos.controllers.dto.wishList;

import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Cuenta;
import SpringBootRestctrlPagos.models.entities.wishList.WishListDetail;
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
public class WishListDTO {
    private Long id;
    private List<WishListDetail> wishListDetails;
    private String titulo;
    private Date fechaCreacion;
    private String meta;
    private Cuenta cuentaOrigen;
    private boolean estado;
    private Date fechaFin;
    private boolean procesarWish;
    private Usuario usuario;
}
