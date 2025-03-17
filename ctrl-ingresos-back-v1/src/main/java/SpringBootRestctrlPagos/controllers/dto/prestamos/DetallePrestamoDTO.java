package SpringBootRestctrlPagos.controllers.dto.prestamos;

import SpringBootRestctrlPagos.models.entities.prestamos.DetallePrestamoId;
import SpringBootRestctrlPagos.models.entities.prestamos.Prestamo;
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
public class DetallePrestamoDTO {
    private DetallePrestamoId detallePrestamoId;
    private Date fechaPago;
    private Double montoPago;
    private boolean pagoEfectuado;
    @JsonIgnore
    private Prestamo prestamo;
}
