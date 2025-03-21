import { Component, OnInit, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { CommonModule, } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FacturaService } from '../../../../services/servicios/factura.service';
import { LoginService } from '../../../../services/login.service';
import { ILoginResponse } from '../../../../models/login.models';
import { IDetalleFactura, IFactura } from '../../../../models/servicios/factura.models';
import { IResponse } from '../../../../models/response.models';
import { DetalleFacturaService } from '../../../../services/servicios/detalleFactura.service';
import { IPeriodPay, IServicio } from '../../../../models/servicios/servicio.models';
import { IUser } from '../../../../models/user.models';
import { NavPrestamoComponent } from '../../nav/nav-prestamo.component';
import { PrestamoService } from '../../../../services/prestamos/prestamo.service';
import { DetallePrestamoService } from '../../../../services/prestamos/detallePrestamo.service';
import { ICoutasPay, IDetallePrestamo, IPrestamo } from '../../../../models/prestamos/prestamo.models';
import { DetallePrestamoFormComponent } from './form/detalle-prestamo-form/detalle-prestamo-form.component';
import { CuentaService } from '../../../../services/ctrlEfectivo/cuenta.service';
import { MovimientoService } from '../../../../services/ctrlEfectivo/movimiento.service';
import { ISobre } from '../../../../models/ctrlEfectivo/sobre.models';
import { ICuenta } from '../../../../models/ctrlEfectivo/cuenta.models';
import { ITransaccion } from '../../../../models/ctrlEfectivo/transaccion.models';
import { IMovimiento } from '../../../../models/ctrlEfectivo/movimiento.models';
import { AnimacionFinPrestamoComponent } from './form/animacion-fin-prestamo/animacion-fin-prestamo.component';
import { SpinnerComponent } from "../../../../shared/spinner/spinner.component";


@Component({
  selector: 'app-detalle-prestamo',
  standalone: true,
  imports: [CommonModule,
    RouterOutlet,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    NavPrestamoComponent, SpinnerComponent],
  templateUrl: './detalle-prestamo.component.html',
  styleUrl: './detalle-prestamo.component.css'
})
export class DetallePrestamoComponent implements OnInit {

  private _prestamoService = inject(PrestamoService);
  private _detallePrestamoService = inject(DetallePrestamoService);
  private _route = inject(ActivatedRoute);
  _cuentaService = inject(CuentaService);
  _movimientoService = inject(MovimientoService);
  _detallePrestamoServices = inject(DetallePrestamoService);
  public loginServices = inject(LoginService);
  private _toastr = inject(ToastrService)
  prestamoActiva: boolean = false;
  username: string | null = '';
  role: String | null = '';
  userLoginOn: boolean = false;
  title: string = 'Pago de prestamo';
  paramIdPrestamo: number | null = null;
  pagoSinProcesar: boolean = false;
  diasVto: number = 0;
  diasIniVto: number = 0;
  diasFinVto: number = 0;
  paid: boolean = false;
  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }
  prestamoData: IPrestamo = {
    id: null,
    detallePrestamo: null,
    titulo: null,
    fechaCreacion: null,
    monto: null,
    interes: null,
    cuotas: null,
    totAPagar: null,
    cuentaOrigen: null,
    cuentaBeneficiario: null,
    saldoRest: null,
    totPag: null,
    estado: null,
    procesarPrestamo:null,
    fechaTotPagado: null,
    usuario: null
  };


  detallePrestamoData: IDetallePrestamo = {
    detallePrestamoId: null,
    fechaPago: null,
    montoPago: null,
    pagoEfectuado: null
  }


  sobreDataOrigen: ISobre = {
    id: null,
    descripcion: null,
    usuario: null
  };

  sobreDataDestino: ISobre = {
    id: null,
    descripcion: null,
    usuario: null
  };

  cuentaOrigenData: ICuenta = {
    id: 0,
    saldo: 0,
    sobre: this.sobreDataOrigen
  };

  cuentaDestinoData: ICuenta = {
    id: 0,
    saldo: 0,
    sobre: this.sobreDataDestino
  };

  transaccionData: ITransaccion = {
    id: null,
    tipoTransaccion: 'Algo',
    cantidad: 0,
    fecha: new Date(),
    cuentaOrigen: this.cuentaOrigenData,
    cuentaDestino: this.cuentaDestinoData
  }


  movimientoData: IMovimiento = {
    id: null,
    tipoMovimiento: '',
    cuenta: this.cuentaOrigenData,
    fecha: new Date,
    monto: 0,
    comentario: '',
    transaccion: null,
    usuario: null
  }

  listCoutasPay: ICoutasPay[] = [
    { id: 1, descripcion: '1 Couta', interes: 0 },
    { id: 2, descripcion: '2 Coutas', interes: 2.5 },
    { id: 3, descripcion: '3 Coutas', interes: 5 },
    { id: 4, descripcion: '4 Coutas', interes: 7 },
    { id: 6, descripcion: '6 Coutas', interes: 10 },
    { id: 12, descripcion: '12 coutas', interes: 15 },
    { id: 24, descripcion: '24 coutas', interes: 30 }
  ];




  dataSource: MatTableDataSource<IDetallePrestamo> = new MatTableDataSource<IDetallePrestamo>([]);
  displayedColumns: string[] = ['fechaPago', 'pago', 'pagoProcesado', 'acciones'];
  isLoading: boolean = false;
  
  spinnerShow(): void {
    this.isLoading = true
  }
  
    spinnerHide(): void {
    this.isLoading = false
  }
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {

    this.isUserLogin();

    this._route.params.subscribe(params => {
      this.paramIdPrestamo = params['idPrestamo'];
    })

    this.loadItemData(this.paramIdPrestamo!)

  }

  async loadItemData(idPrestamo: number) {

    this.prestamoData = await this.getPrestamo(idPrestamo);
    if (this.prestamoData) {
      this.dataSource.data = this.prestamoData.detallePrestamo!;
    }


  }

  async getPrestamo(idPrestamo: number): Promise<IPrestamo> {
    try {
      const prestamo: IPrestamo =
        await firstValueFrom(this._prestamoService.getPrestamo(idPrestamo));
      return prestamo;
    } catch (error) {
      console.error('Error al obtener la Factura:', error);
      throw error;
    }
  }

  getDescriptionCoutasPay(id: number): string {
    return this.listCoutasPay.find(couta => couta.id === id)?.descripcion || 'sin descripcion';
  }

  getInteresCoutasPay(id: number): number {
    return this.listCoutasPay.find(couta => couta.id === id)?.interes || 0;
  }

  async reloadData() {
    await this.loadItemData(this.paramIdPrestamo!);
    
  }

  async getHayPagoSinProcesar(): Promise<void> {
    this.pagoSinProcesar = this.dataSource.data?.some(detalle => detalle.pagoEfectuado === false)!
    
  }

  async checkEndPrestamo(): Promise<void>{
    await this.getHayPagoSinProcesar();     
    if(!this.pagoSinProcesar && this.prestamoData.saldoRest ==0){
        this.finPrestamo();
    }else{
      console.log("prestamo sin finalizar");      
    }
  }



  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }



  editar(IdDetalle: number, idPrestamo: number) {
    this.newOrUpdate('Actualizar', IdDetalle, idPrestamo)
  }

  async nuevoPago() {
    await this.getHayPagoSinProcesar();
    console.log(this.pagoSinProcesar);
    if (this.pagoSinProcesar) {
      if (window.confirm('¿Existen pagos sin procesar, seguro desea registrar otro pago?')) {
        this.newOrUpdate('Nuevo', null, this.prestamoData.id)
      }
    } else {
      this.newOrUpdate('Nuevo', null, this.prestamoData.id)
    }
  }

  finPrestamo():void{
    this.openFormAnimation();
  }

  newOrUpdate(titulo: String, idDetalle: number | null, idPrestamo: number | null): void {
    this.openForm(titulo, idDetalle, idPrestamo);
  }

  async eliminarDetallePrestamo(IdDetalle: number, idPrestamo: number) {

    if (window.confirm('¿Seguro que deseas eliminar este elemento?')) {
      this.spinnerShow();

      let response: IResponse = await this.detallePrestamoDelete(IdDetalle, idPrestamo)

      if (response) {
        this.showSuccess(response.message, "Prestamo")
        this.spinnerHide();
        this.reloadData();
      }
    }
  }

  async detallePrestamoDelete(IdDetalle: number, idPrestamo: number): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._detallePrestamoService.deleteDetallePrestamo(IdDetalle, idPrestamo));
      return response;
    } catch (error) {
      console.error('Error detalleFacturaDelete:', error);
      throw error;
    }
  }



  openForm(titulo: String, idDetalle: number | null, idPrestamo: number | null) {
    const dialogRef = this.dialog.open(DetallePrestamoFormComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '350px',
        height: '500px',
        data: {
          titulo: titulo,
          idDetallePrestamo: idDetalle,
          idPrestamo: idPrestamo,
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadData();
    });
  }

  openFormAnimation() {
    const dialogRef = this.dialog.open(AnimacionFinPrestamoComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '99%',
        height: '100%',
        data: {
        },
        

      });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadData();
    });
  }


  getShortDate(fecha: Date): string {
    let ahora = new Date(fecha);
    let fechaActual = ahora.getFullYear() + '-'
      + ('0' + (ahora.getMonth() + 1)).slice(-2) + '-'
      + ('0' + ahora.getDate()).slice(-2) + ' '
    return fechaActual;
  }

  async procesarPago(IdDetalle: number, idPrestamo: number, pago: number) {
    if (window.confirm('¿Seguro que deseas procesar el pago?')) {
      let response: IResponse = await this.updatePagoEfectuado(IdDetalle, idPrestamo, this.detallePrestamoData)

      if (response) {
        await this.transferirFondos(pago);
        await this.reloadData();
        await this.checkEndPrestamo();
      }
    }
  }


  async updatePagoEfectuado(idDetalle: number, idPrestamo: number, detallePrestamo?: IDetallePrestamo): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._detallePrestamoServices.efectuarPagoDetallePrestamo(idDetalle, idPrestamo, detallePrestamo!));
      return response;
    } catch (error) {
      console.error('Error al actualizar el detalle del prestamo:', error);
      throw error;
    }
  }

  async transferirFondos(pago: number): Promise<void> {
    const user: IUser = {
      id: null,
      username: this.username!
    }
    //origen es beneficiario
    //destino es el origen
    let idSobreOrigen = this.prestamoData.cuentaBeneficiario?.sobre?.id;

    let cuentaOrigen = await this.getCuentaByIdSobre(idSobreOrigen!);
    if (cuentaOrigen) {

      //Actualiza cuenta
      let monto = pago;
      let saldoActual: number = cuentaOrigen.saldo!;

      this.cuentaOrigenData.saldo = monto;
      this.cuentaOrigenData.id = null;
      this.sobreDataOrigen.id = idSobreOrigen!;
      this.sobreDataOrigen.usuario = user;
      this.cuentaOrigenData.sobre = this.sobreDataOrigen;

      let responseCuenta = await this.updateCuentaRestFondo(idSobreOrigen!, this.cuentaOrigenData)
      if (responseCuenta) {
        //Actualizar cuenta destino
        let idSobreDestino = this.prestamoData.cuentaOrigen?.sobre?.id;

        this.cuentaDestinoData.saldo = monto;
        this.cuentaDestinoData.id = null;
        this.sobreDataDestino.id = idSobreDestino!;
        this.sobreDataDestino.usuario = user;
        this.cuentaDestinoData.sobre = this.sobreDataDestino;

        let responseCuentaDestino = await this.updateCuenta(idSobreDestino!, this.cuentaDestinoData)
        if (responseCuentaDestino) {
          //Crea transaccion
          this.transaccionData.cuentaOrigen = this.cuentaOrigenData;
          this.transaccionData.cuentaDestino = this.cuentaDestinoData;
          this.transaccionData.fecha = new Date();
          this.transaccionData.cantidad = monto;

          //Crea movimiento
          const tipoMovimiento = 'Transferir fondo por pago de prestamo';
          this.movimientoData.usuario = user;
          this.movimientoData.fecha = new Date();
          this.movimientoData.cuenta = this.cuentaOrigenData;
          this.movimientoData.tipoMovimiento = tipoMovimiento;
          this.movimientoData.monto = monto;
          this.movimientoData.comentario = "Transferencia por pago de prestamo";
          this.movimientoData.transaccion = this.transaccionData;
          // this.movimientoData.transaccion = null;

          let responseMovimiento = await this.saveMovimiento(this.movimientoData);
          if (responseMovimiento) {
            this.showSuccess('Se ha guardado correctamente.', tipoMovimiento)
          }

        }
      }


    }
  }

  async getCuentaByIdSobre(idSobre: number): Promise<ICuenta> {
    try {
      const cuenta: ICuenta =
        await firstValueFrom(this._cuentaService.getCuentaByIdSobre(idSobre));
      return cuenta;
    } catch (error) {
      console.error('Error al buscar cuenta:', error);
      throw error;
    }
  }
  async updateCuenta(id: number, cuenta: ICuenta): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._cuentaService.updateCuenta(id, cuenta!));
      return response;
    } catch (error) {
      console.error('Error al actualizar cuenta:', error);
      throw error;
    }
  }
  async updateCuentaRestFondo(id: number, cuenta: ICuenta): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._cuentaService.updateCuentaRetirarFondo(id, cuenta!));
      return response;
    } catch (error) {
      console.error('Error al actualizar cuenta:', error);
      throw error;
    }
  }

  async saveMovimiento(movimiento?: IMovimiento): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._movimientoService.saveMovimientoWhithTransaccion(movimiento!));
      return response;
    } catch (error) {
      console.error('Error al guardar Movimiento:', error);
      throw error;
    }
  }


  isUserLogin() {
    this.loginServices.currentUserLoginOn.subscribe(
      {
        next: (userLoginOn) => {
          this.userLoginOn = userLoginOn;
        }
      }
    )

    this.loginServices.currentUsername.subscribe(
      {
        next: (username) => {
          this.username = username;
        }
      }
    )

    this.loginServices.currentUserRole.subscribe(
      {
        next: (role) => {
          this.role = role;
        }
      }
    )
  }
}
