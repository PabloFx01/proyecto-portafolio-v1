package SpringBootRestctrlPagos.models;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ListadoPaginador<T>{
    public Long cantidadTotal;
    public List<T> elementos;

    public ListadoPaginador() {
        this.cantidadTotal = 0L;
        this.elementos = new ArrayList<>();
    }
}
