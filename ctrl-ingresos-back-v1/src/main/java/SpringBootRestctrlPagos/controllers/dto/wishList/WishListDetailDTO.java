package SpringBootRestctrlPagos.controllers.dto.wishList;

import SpringBootRestctrlPagos.models.entities.wishList.WishDetailId;
import SpringBootRestctrlPagos.models.entities.wishList.WishList;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WishListDetailDTO {
    private WishDetailId wishDetailId;
    private Date fechaDetail;
    private String itemName;
    private Double precio;
    private String comentario;
    private String link;
    private boolean procesarDetail;
    @JsonIgnore
    private WishList wishList;
}
