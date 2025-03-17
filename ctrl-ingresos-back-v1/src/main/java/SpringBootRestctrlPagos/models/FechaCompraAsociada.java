package SpringBootRestctrlPagos.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FechaCompraAsociada {
    private Date fechaIni;
    private Date fechaFin;

}
