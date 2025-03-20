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
import { ComponentType, ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AgregarFondoFormComponent } from './form/agregar-fondo-form/agregar-fondo-form.component';
import { RetirarFondosFormComponent } from './form/retirar-fondos-form/retirar-fondos-form.component';
import { TransferirFondosFormComponent } from './form/transferir-fondos-form/transferir-fondos-form.component';
import { DetalleMovimientoFormComponent } from './movimiento/detalle-movimiento-form/detalle-movimiento-form.component';
import { SobreService } from '../../services/ctrlEfectivo/sobre.service';
import { MovimientoService } from '../../services/ctrlEfectivo/movimiento.service';
import { CuentaService } from '../../services/ctrlEfectivo/cuenta.service';
import { ICuenta } from '../../models/ctrlEfectivo/cuenta.models';
import { ISobre } from '../../models/ctrlEfectivo/sobre.models';
import { IMovimiento, IMovimientos } from '../../models/ctrlEfectivo/movimiento.models';
import { ILoginResponse } from '../../models/login.models';
import { LoginService } from '../../services/login.service';
import { NavCtrlEfectivoComponent } from "./nav/nav-ctrl-efectivo.component";
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-repartir-utilidades',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatButtonToggleModule,
    NavCtrlEfectivoComponent,
    RouterOutlet,
    CurrencyPipe
  ],
  templateUrl: './control-efectivo.component.html',
  styleUrl: './control-efectivo.component.css'
})
export class ControlEfectivoComponent implements OnInit {

  _sobreService = inject(SobreService);
  _movimientoService = inject(MovimientoService);
  _cuentaService = inject(CuentaService);
  private _router = inject(Router)
  private _toastr = inject(ToastrService)
  totalSaldo: number | null = 0;
  listCuentasActivas: ICuenta[] = [];

  //sobres
  listSobre: ISobre[] = [];
  sobreFilter: string = '';

  sobreDataSource: MatTableDataSource<ISobre> = new MatTableDataSource<ISobre>([]);
  sobreDisplayedColumns: string[] = ['descripcion'];
  //Fin sobre

  //Movimiento
  //filtro
  filterMovimiento: string | null = null;
  //Paginador
  cantidadTotalMovimiento: number = 0;
  cantidadPorPaginaMovimiento: number = 5;
  numeroDePaginaMovimiento: number = 0;
  opcionesDePaginadoMovimiento: number[] = [1, 5, 10, 25, 100];

  dataSourceMovimiento: MatTableDataSource<IMovimiento> = new MatTableDataSource<IMovimiento>([]);
  displayedColumnsMovimiento: string[] = ['fecha', 'tipoMovimiento', 'monto', 'sobre', 'acciones'];
  selectedRow: any;
  //Fin movimiento
  loginServices = inject(LoginService);

  username: string | null = '';
  role: String | null = '';
  userLoginOn: boolean = false;

  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }


  constructor(public dialog: MatDialog) {
    this.isUserLogin();
  }

  ngOnInit(): void {
    this.allSobreInDataSource(null);
    this.allMovimientoInDataSourcePaginador(null);
    this.getSaldoActual();

  }

  allSobreInDataSource(filter: string | null): void {
    this._sobreService.getSobres(this.username!)
      .subscribe((sobres: ISobre[]) => {
        this.sobreDataSource.data = sobres;
      });
  }

  allMovimientoInDataSourcePaginador(filter: string | null): void {
    this._movimientoService.getMovimientoPaginadorByUsername(this.cantidadPorPaginaMovimiento,
      this.numeroDePaginaMovimiento,
      filter,
      this.username!)
      .subscribe((movimiento: IMovimientos) => {
        this.dataSourceMovimiento.data = movimiento.elementos;
        this.cantidadTotalMovimiento = movimiento.cantidadTotal;
      });
  }

  private reloadData() {
    this.allMovimientoInDataSourcePaginador(this.filterMovimiento);
    // this.allSobreInDataSource(null);
    this.getSaldoActual();
  }



  cambiarPaginaMovimietno(event: PageEvent) {
    this.cantidadPorPaginaMovimiento = event.pageSize;
    this.numeroDePaginaMovimiento = event.pageIndex;
    this.allMovimientoInDataSourcePaginador(this.filterMovimiento);
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }

  filtrarPorSobre(descripcion: string) {
    this.filterMovimiento = descripcion;
    this.allMovimientoInDataSourcePaginador(this.filterMovimiento);
    this.getSaldoActual();
  }

  filtrarPorAllSobre() {
    this.filterMovimiento = null;
    this.selectedRow = null;
    this.reloadData();

  }
  irADetalleMovimiento(id: number) {
    this.openForm("Detalles del movimiento", DetalleMovimientoFormComponent, id)
  }
  transferirFondos() {
    this.openForm("Transferir fondos", TransferirFondosFormComponent)
  }
  retirarFondos() {
    this.openForm("Retirar fondos", RetirarFondosFormComponent)
  }
  agregarFondos() {
    this.openForm("Agregar fondos", AgregarFondoFormComponent)
  }

  async getSaldoActual(): Promise<void> {
    this.listCuentasActivas = await this.getCuentasActivas()

    if (this.listCuentasActivas.length > 0) {
      this.totalSaldo = this.listCuentasActivas.map(s => s.saldo).reduce((acc, value) => acc! + value!, 0)
    }else{
      this.totalSaldo = 0;
    }

  }

  async getCuentasActivas(): Promise<ICuenta[]> {
    try {
      console.log(this.filterMovimiento);

      const cuenta = await firstValueFrom(this._cuentaService.getCuentasActivasByUsername(this.filterMovimiento, this.username!));
      return cuenta;
    } catch (error) {
      console.error('Error al buscar cuentas activas:', error);
      throw error;
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

  openForm(titulo: string, componente: ComponentType<any>, id?: number) {
    const dialogRef = this.dialog.open(componente,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '500px',
        height: '560px',
        data: {
          titulo: titulo,
          id: id
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadData();
    });
  }

  onRowClicked(row: any) {
    this.selectedRow = row;
    this.filtrarPorSobre(row.descripcion);
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

  irAlink(link: string) {
    this._router.navigateByUrl(`/${link}`);
  }

}
