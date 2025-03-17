import { Routes } from '@angular/router';
import { HomeComponent } from './pages/metales/home/home.component';
import { IngresosComponent } from './pages/ingresos/ingresos.component';
import { DetallesIngresoComponent } from './pages/ingresos/detalles/detalles-ingreso/detalles-ingreso.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './login/user/user.component';
import { FormUserPasswordComponent } from './login/user/form-user-password/form-user-password.component';
import { ConceptosComponent } from './pages/ingresos/conceptos/conceptos/conceptos.component';
import { ServiciosComponent } from './pages/servicios/servicios/servicios.component';
import { FacturaComponent } from './pages/servicios/factura.component';
import { FacturacionComponent } from './pages/servicios/facturacion/facturacion/facturacion.component';
import { ConsultaFacturacionComponent } from './pages/servicios/facturacion/consulta/consulta-facturacion/consulta-facturacion.component';
import { ControlEfectivoComponent } from './pages/ctrlEfectivo/control-efectivo.component';
import { SobresComponent } from './pages/ctrlEfectivo/sobres/sobres.component';
import { ConsultaDetalleMovimientoComponent } from './pages/ctrlEfectivo/movimiento/consulta/consulta-detalle-movimiento/consulta-detalle-movimiento.component';
import { ConsultaIngresoComponent } from './pages/ingresos/consulta/consulta-ingreso/consulta-ingreso.component';
import { PrestamoComponent } from './pages/prestamos/prestamo/prestamo.component';
import { DetallePrestamoComponent } from './pages/prestamos/prestamo/detalle-prestamo/detalle-prestamo.component';
import { MetalCompraComponent } from './pages/metales/metal-compra/metal-compra.component';
import { CompraComponent } from './pages/metales/compra/compra.component';
import { ConsultaComprasComponent } from './pages/metales/compra/consultas/consulta-compras/consulta-compras.component';
import { DetallesCompraComponent } from './pages/metales/compra/detalles-compra/detalles-compra.component';
import { InventarioComponent } from './pages/metales/compra/inventario/inventario.component';
import { DetalleMetalCompraComponent } from './pages/metales/metal-compra/detalle-metal-compra/detalle-metal-compra.component';
import { DetalleVentaComponent } from './pages/metales/venta/detalle-venta/detalle-venta.component';
import { DetalleTicketComponent } from './pages/metales/venta/ticket/detalle-ticket/detalle-ticket.component';
import { TicketComponent } from './pages/metales/venta/ticket/ticket.component';
import { VentaComponent } from './pages/metales/venta/venta.component';
import { LayoutComponent } from './pages/muestra/layout/layout.component';
import { WishListComponent } from './pages/wishLists/wish-list.component';
import { WishListDetailComponent } from './pages/wishLists/wish-list-detail/wish-list-detail.component';

export const routes: Routes = [
    {path:'', component: DashboardComponent},
    {path:'home', component: DashboardComponent},
    {path:'ingreso', component: IngresosComponent},
    {path:'detallesIngreso/:idIngreso', component: DetallesIngresoComponent},
    {path:'historialIngresos', component: ConsultaIngresoComponent},
    {path:'concepto', component: ConceptosComponent},
    {path:'factura', component: FacturaComponent},
    {path:'facturacionDetails/:idServicio/:servicioName', component: FacturacionComponent},
    {path:'historialFacturas', component: ConsultaFacturacionComponent},
    {path:'servicios', component: ServiciosComponent},
    {path:'control-efectivo', component: ControlEfectivoComponent},
    {path:'sobres', component: SobresComponent},    
    {path:'consultaMovimientos', component: ConsultaDetalleMovimientoComponent},
    {path:'prestamos', component: PrestamoComponent},
    {path:'detallePrestamo/:idPrestamo', component: DetallePrestamoComponent},    
    {path:'wishList', component: WishListComponent},
    {path:'wishListDetail/:idWish', component: WishListDetailComponent},    
    {path:'muestra', component: LayoutComponent},
    {path:'login', component: LoginComponent},
    {path:'users', component: UserComponent},
    {path:'changePass', component: FormUserPasswordComponent},
    //--------------------------metalesApp-------------------------//
    {path:'metalesHome', component: HomeComponent},
    {path:'metalesCompra', component: MetalCompraComponent},
    {path:'detalleMetaleCompra/:idMetalCompra', component: DetalleMetalCompraComponent},
    {path:'compra', component: CompraComponent},
    {path:'detallesCompra/:id', component: DetallesCompraComponent},
    {path:'detallesCompraOnlyRead/:id/:accion', component: DetallesCompraComponent},
    {path:'consultaCompra', component: ConsultaComprasComponent},
    {path:'venta', component: VentaComponent},
    {path:'detalleVenta/:id', component: DetalleVentaComponent},
    {path:'detalleVentaOnlyRead/:id/:accion', component: DetalleVentaComponent},
    {path:'ticket', component: TicketComponent},
    {path:'detalleTicket/:id', component: DetalleTicketComponent},
    {path:'detalleTicketOnlyRead/:id/:accion', component: DetalleTicketComponent},
    {path:'inventario', component: InventarioComponent},
    {path:'sobres', component: SobresComponent},
    {path:'consultaMovimientos', component: ConsultaDetalleMovimientoComponent},
    {path:'login', component: LoginComponent},
    {path:'users', component: UserComponent},
    {path:'changePass', component: FormUserPasswordComponent},
    
    {path:'**', redirectTo: '', pathMatch:'full'}
];
