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
import { NavWishListComponent } from './nav/nav-wish-list.component';
import { IWishList, IWishLists } from '../../models/wishList/wishList.models';
import { LoginService } from '../../services/login.service';
import { ILoginResponse } from '../../models/login.models';
import { ISobre } from '../../models/ctrlEfectivo/sobre.models';
import { ICuenta } from '../../models/ctrlEfectivo/cuenta.models';
import { IMovimiento } from '../../models/ctrlEfectivo/movimiento.models';
import { WishListService } from '../../services/wishList/wishList.service';
import { DataService } from '../../shared/data.service';
import { CuentaService } from '../../services/ctrlEfectivo/cuenta.service';
import { MovimientoService } from '../../services/ctrlEfectivo/movimiento.service';
import { IResponse } from '../../models/response.models';
import { WishListFormComponent } from './form/wish-list-form/wish-list-form.component';


@Component({
  selector: 'app-wish-list',
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
    RouterOutlet,NavWishListComponent],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent implements OnInit{
  private _wishListService = inject(WishListService);
  private _DataService = inject(DataService);
  _cuentaService = inject(CuentaService);
  _movimientoService = inject(MovimientoService);
  private _router = inject(Router)
  private _toastr = inject(ToastrService)
  
  wishListData: IWishList = {
    id: null,
    wishListDetails: null,
    titulo:  null,
    fechaCreacion: null,
    meta:  null,
    cuentaOrigen:  null,
    estado: null,
    fechaFin:  null,
    procesarWish: null,
    usuario:  null
  };
  //filtro
  filter: string = '';
  state: string = 'NOT-FIN';
  //Paginador
  cantidadTotal: number = 0;
  cantidadPorPagina: number = 5;
  numeroDePagina: number = 0;
  opcionesDePaginado: number[] = [1, 5, 10, 25, 100];

  dataSource: MatTableDataSource<IWishList> = new MatTableDataSource<IWishList>([]);
  displayedColumns: string[] = ['titulo','fechaCreacion','cuenta','estado','fechaFin', 'acciones'];

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


  cuentaOrigenData: ICuenta = {
    id: 0,
    saldo: 0,
    sobre: this.sobreDataOrigen
  };



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
    this.allWishListInDataSourcePaginador(null);
    this._DataService.dataUpdated$.subscribe(() => {
      this.reloadData();
    })
  }

  allWishListInDataSourcePaginador(filter: string | null): void {
    this._wishListService.getWishListPaginadorByUsername(this.cantidadPorPagina,
      this.numeroDePagina,
      this.state,
      filter,
      this.username!)
      .subscribe((wish: IWishLists) => {
        this.dataSource.data = wish.elementos;
        this.cantidadTotal = wish.cantidadTotal;
      });
  }

  private reloadData() {
    this.allWishListInDataSourcePaginador(this.filter);
  }

  seleccionarFiltro(filtro: string) {
    this.state = filtro
    this.reloadData();
  }

  cambiarPagina(event: PageEvent) {
    this.cantidadPorPagina = event.pageSize;
    this.numeroDePagina = event.pageIndex;
    this.allWishListInDataSourcePaginador(this.filter);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter = filterValue;
    this.allWishListInDataSourcePaginador(filterValue);

  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }

  async eliminar(id: number) {
    if (window.confirm('¿Seguro que deseas eliminar este elemento?')) {
      const response = await this.eliminarWishList(id);
      if (response) {
        this._DataService.dataUpdated$.next();
        this.showSuccess("Elemento eliminado con éxito.", "Eliminar")
      }
    }
  }

  async eliminarWishList(id: number): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._wishListService.deleteWishList(id));
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

  irDetalles(idWish: number | null) {
    this._router.navigate(["/wishListDetail", idWish])
  }

  openForm(accion: string, titulo: String, idWish: number | null) {
    const dialogRef = this.dialog.open(WishListFormComponent,
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
          idWish: idWish
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadData();
    });
  }

  // async procesarPago(idPrestamo: number, pago: number) {
  //   if (window.confirm('¿Seguro que deseas procesar el prestamo?')) {
  //     let response: IResponse = await this.updatePagoEfectuado(idPrestamo, this.prestamoData)
  //     this.prestamoData = await this.getPrestamo(idPrestamo);
  //     if (response) {
  //       await this.transferirFondos(pago);
  //       await this.reloadData();
  //       // await this.checkEndPrestamo();
  //     }
  //   }
  // }

  // async updatePagoEfectuado(idPrestamo: number, prestamo?: IPrestamo): Promise<IResponse> {
  //   try {
  //     const response: IResponse =
  //       await firstValueFrom(this._prestamoService.procesarPrestamo( idPrestamo, prestamo!));
  //     return response;
  //   } catch (error) {
  //     console.error('Error al actualizar el detalle del prestamo:', error);
  //     throw error;
  //   }
  // }

  async getWishList(idWish: number): Promise<IWishList> {
    try {
      const wishList: IWishList =
        await firstValueFrom(this._wishListService.getWishList(idWish));
      return wishList;
    } catch (error) {
      console.error('Error al obtener wishList:', error);
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

