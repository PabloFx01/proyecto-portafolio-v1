import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../../../services/login.service';
import { ILoginResponse } from '../../../models/login.models';
import { DataService } from '../../../shared/data.service';
import { IResponse } from '../../../models/response.models';
import { PrestamoService } from '../../../services/prestamos/prestamo.service';
import { IPrestamo, IPrestamos } from '../../../models/prestamos/prestamo.models';
import { NavPrestamoComponent } from "../nav/nav-prestamo.component";
import { PrestamoFormComponent } from './form/prestamo-form/prestamo-form.component';
import { IUser } from '../../../models/user.models';
import { ISobre } from '../../../models/ctrlEfectivo/sobre.models';
import { ICuenta } from '../../../models/ctrlEfectivo/cuenta.models';
import { ITransaccion } from '../../../models/ctrlEfectivo/transaccion.models';
import { IMovimiento } from '../../../models/ctrlEfectivo/movimiento.models';
import { CuentaService } from '../../../services/ctrlEfectivo/cuenta.service';
import { MovimientoService } from '../../../services/ctrlEfectivo/movimiento.service';

@Component({
  selector: 'app-prestamo',
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatButtonToggleModule,
    RouterOutlet, NavPrestamoComponent],
  templateUrl: './prestamo.component.html',
  styleUrl: './prestamo.component.css'
})
export class PrestamoComponent implements OnInit{
  private _prestamoService = inject(PrestamoService);
  private _DataService = inject(DataService);
  _cuentaService = inject(CuentaService);
  _movimientoService = inject(MovimientoService);
  private _router = inject(Router)
  private _toastr = inject(ToastrService)
  prestamoData: IPrestamo = {
    id: null,
    detallePrestamo:  null,
    titulo: null,
    fechaCreacion: null,
    monto:  null,
    interes: null,
    cuotas:  null,
    totAPagar: null,
    cuentaOrigen: null,
    cuentaBeneficiario: null,
    saldoRest:  null,
    totPag:  null,
    estado:  null,
    procesarPrestamo: null,
    fechaTotPagado: null,
    usuario:  null
  };
  //filtro
  filter: string = '';
  state: string = 'NOT-PAID';
  //Paginador
  cantidadTotal: number = 0;
  cantidadPorPagina: number = 5;
  numeroDePagina: number = 0;
  opcionesDePaginado: number[] = [1, 5, 10, 25, 100];

  dataSource: MatTableDataSource<IPrestamo> = new MatTableDataSource<IPrestamo>([]);
  displayedColumns: string[] = ['titulo','monto','interes','cuotas','totAPagar'
                                ,'cuentas','totPag','saldoRest','estado', 'acciones'];

  loginServices = inject(LoginService);

  username: string | null = '';
  role: String | null = '';
  userLoginOn: boolean = false;

  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
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


  constructor(public dialog: MatDialog) {
    this.isUserLogin();
  }

  ngOnInit(): void {
    this.allPrestamoInDataSourcePaginador(null);
    this._DataService.dataUpdated$.subscribe(() => {
      this.reloadData();
    })
  }

  allPrestamoInDataSourcePaginador(filter: string | null): void {
    this._prestamoService.getPrestamoPaginadorByUsername(this.cantidadPorPagina,
      this.numeroDePagina,
      this.state,
      filter,
      this.username!)
      .subscribe((prestamos: IPrestamos) => {
        this.dataSource.data = prestamos.elementos;
        this.cantidadTotal = prestamos.cantidadTotal;
      });
  }

  private reloadData() {
    this.allPrestamoInDataSourcePaginador(this.filter);
  }

  seleccionarFiltro(filtro: string) {
    this.state = filtro
    this.reloadData();
  }

  cambiarPagina(event: PageEvent) {
    this.cantidadPorPagina = event.pageSize;
    this.numeroDePagina = event.pageIndex;
    this.allPrestamoInDataSourcePaginador(this.filter);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter = filterValue;
    this.allPrestamoInDataSourcePaginador(filterValue);

  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }

  async eliminar(id: number) {
    if (window.confirm('¿Seguro que deseas eliminar este elemento?')) {
      const response = await this.eliminarPrestamo(id);
      if (response) {
        this._DataService.dataUpdated$.next();
        this.showSuccess("Elemento eliminado con éxito.", "Eliminar")
      }
    }
  }

  async eliminarPrestamo(id: number): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._prestamoService.deletePrestamo(id));
      return response;
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      throw error;
    }
  }

  editar(id: number) {
    this.openForm('Update', 'Actualizar', id);
  }

  addRegister() {
    this.openForm('Add', 'Crear', null);
  }

  irDetalles(idPrestamo: number | null) {
    this._router.navigate(["/detallePrestamo", idPrestamo])
  }

  openForm(accion: string, titulo: String, idPrestamo: number | null) {
    const dialogRef = this.dialog.open(PrestamoFormComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '700px',
        height: '650px',
        data: {
          tipoAccion: accion,
          titulo: titulo,
          idPrestamo: idPrestamo
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadData();
    });
  }

  async procesarPago(idPrestamo: number, pago: number) {
    if (window.confirm('¿Seguro que deseas procesar el prestamo?')) {
      let response: IResponse = await this.updatePagoEfectuado(idPrestamo, this.prestamoData)
      this.prestamoData = await this.getPrestamo(idPrestamo);
      if (response) {
        await this.transferirFondos(pago);
        await this.reloadData();
        // await this.checkEndPrestamo();
      }
    }
  }

  async updatePagoEfectuado(idPrestamo: number, prestamo?: IPrestamo): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._prestamoService.procesarPrestamo( idPrestamo, prestamo!));
      return response;
    } catch (error) {
      console.error('Error al actualizar el detalle del prestamo:', error);
      throw error;
    }
  }

  async getPrestamo(idPrestamo: number): Promise<IPrestamo> {
    try {
      const prestamo: IPrestamo =
        await firstValueFrom(this._prestamoService.getPrestamo(idPrestamo));
      return prestamo;
    } catch (error) {
      console.error('Error al obtener la prestamo:', error);
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
    let idSobreOrigen = this.prestamoData.cuentaOrigen?.sobre?.id;

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
        let idSobreDestino = this.prestamoData.cuentaBeneficiario?.sobre?.id;
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
