package SpringBootRestctrlPagos.models.entities.prestamos;

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
@Table(name = "tbl_prestamos")
public class Prestamo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "prestamo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePrestamo> detallePrestamo;
    private String titulo;
    @Column(name = "fecha_creacion")
    private Date fechaCreacion;
    private Double monto;
    private Double interes;
    private Integer cuotas;
    @Column(name = "total_a_pagar")
    private Double totAPagar;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cuenta_origen", referencedColumnName = "id")
    private Cuenta cuentaOrigen;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cuenta_beneficiario", referencedColumnName = "id")
    private Cuenta cuentaBeneficiario;
    @Column(name = "saldo_restante")
    private Double saldoRest;
    @Column(name = "total_pagado")
    private Double totPag;
    private boolean estado;
    @Column(name = "fecha_tot_pagado")
    private Date fechaTotPagado;
    @Column(name = "procesar_prestamo")
    private boolean procesarPrestamo;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id", nullable = false)
    private Usuario usuario;


}
