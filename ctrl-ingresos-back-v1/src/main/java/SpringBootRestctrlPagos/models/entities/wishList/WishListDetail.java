package SpringBootRestctrlPagos.models.entities.wishList;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "tbl_wish_details")
public class WishListDetail {
    @EmbeddedId
    private WishDetailId wishDetailId;
    @Column(name = "fecha_detail")
    private Date fechaDetail;
    @Column(name = "item_name")
    private String itemName;
    private Double precio;
    private String comentario;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String link;
    @Column(name = "procesar_detail")
    private boolean procesarDetail;
    @ManyToOne
    @JoinColumn(name = "id_wish", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    @JsonIgnore
    private WishList wishList;
}
