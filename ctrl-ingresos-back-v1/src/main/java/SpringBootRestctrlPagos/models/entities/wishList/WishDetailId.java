package SpringBootRestctrlPagos.models.entities.wishList;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Embeddable
public class WishDetailId {
    private Long id;
    @Column(name = "id_wish")
    private Long idWish;
}
