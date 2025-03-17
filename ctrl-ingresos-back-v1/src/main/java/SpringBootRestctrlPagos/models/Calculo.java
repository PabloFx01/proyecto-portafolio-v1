package SpringBootRestctrlPagos.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class Calculo {
    private List<Item> items;
    private BigDecimal precioAcumulado;//Precio del metal a la compra
    private BigDecimal pesoAcumulado;
    private Long cantidadQueAparece;
    private BigDecimal precioPromedio;
    private BigDecimal importeAcumulado;

    public Calculo() {
        this.items = new ArrayList<>();
        this.cantidadQueAparece = 0L;
        this.precioPromedio = new BigDecimal("0");
        this.precioAcumulado = new BigDecimal("0");
        this.pesoAcumulado = new BigDecimal("0");
        this.importeAcumulado = new BigDecimal("0");
    }

    public List<Item> addItems(Item item) {
        this.items.add(item);
        return this.items;
    }

    public void calcularAtributos() {
        this.items.forEach(item -> {
            if (item.getPrecioCompra() != null) {
                this.precioAcumulado = this.precioAcumulado.add(item.getPrecioCompra());
            }
            if (item.getPeso() != null) {
                this.pesoAcumulado = this.pesoAcumulado.add(item.getPeso());
            }
            if (item.getImporte() != null) {
                this.importeAcumulado = this.importeAcumulado.add(item.getImporte());
            }
        });
        this.cantidadQueAparece = (long) this.items.size();
        if(this.cantidadQueAparece > 0) {
            this.precioPromedio =
                    this.precioAcumulado.divide(BigDecimal.valueOf(this.cantidadQueAparece), 2);
        }
    }


}
