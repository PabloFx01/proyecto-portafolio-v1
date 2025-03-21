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
import { NavWishListComponent } from '../nav/nav-wish-list.component';
import { WishListService } from '../../../services/wishList/wishList.service';
import { WishListDetailService } from '../../../services/wishList/wishListDetails.service';
import { ICuenta } from '../../../models/ctrlEfectivo/cuenta.models';
import { IMovimiento, ITipoMovimiento } from '../../../models/ctrlEfectivo/movimiento.models';
import { ISobre } from '../../../models/ctrlEfectivo/sobre.models';
import { ITransaccion } from '../../../models/ctrlEfectivo/transaccion.models';
import { ILoginResponse } from '../../../models/login.models';
import { ICoutasPay, IDetallePrestamo, IPrestamo } from '../../../models/prestamos/prestamo.models';
import { IResponse } from '../../../models/response.models';
import { IUser } from '../../../models/user.models';
import { IWishList, IWishListDetail } from '../../../models/wishList/wishList.models';
import { CuentaService } from '../../../services/ctrlEfectivo/cuenta.service';
import { MovimientoService } from '../../../services/ctrlEfectivo/movimiento.service';
import { LoginService } from '../../../services/login.service';
import { AnimacionFinPrestamoComponent } from '../../prestamos/prestamo/detalle-prestamo/form/animacion-fin-prestamo/animacion-fin-prestamo.component';
import { DetallePrestamoFormComponent } from '../../prestamos/prestamo/detalle-prestamo/form/detalle-prestamo-form/detalle-prestamo-form.component';
import { WishListDetailFormComponent } from './form/wish-list-detail-form/wish-list-detail-form.component';
import { NavServiciosComponent } from "../../servicios/nav/nav-servicios.component";
import { aC, aW } from '@fullcalendar/core/internal-common';
import { AnimacionFinwishListComponent } from './animacion-fin-wishList/animacion-fin-wishList.component';
import { SpinnerComponent } from "../../../shared/spinner/spinner.component";


@Component({
  selector: 'app-wish-list-detail',
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
    NavWishListComponent, NavServiciosComponent, SpinnerComponent],
  templateUrl: './wish-list-detail.component.html',
  styleUrl: './wish-list-detail.component.css'
})
export class WishListDetailComponent implements OnInit {
  private _wishListService = inject(WishListService);
  private _wishListDetailService = inject(WishListDetailService);
  private _route = inject(ActivatedRoute);
  _cuentaService = inject(CuentaService);
  _movimientoService = inject(MovimientoService);
  public loginServices = inject(LoginService);
  private _toastr = inject(ToastrService)
  prestamoActiva: boolean = false;
  username: string | null = '';
  role: String | null = '';
  userLoginOn: boolean = false;
  title: string = 'Mi lista de deseo: ';
  paramIdWishList: number | null = null;
  pagoSinProcesar: boolean = false;
  diasVto: number = 0;
  diasIniVto: number = 0;
  diasFinVto: number = 0;
  paid: boolean = false;
  totValorList: number = 0;
  pcjeActual: number = 0;
  startMovFilter: string | null = null;
  endMovFilter: string | null = null;
  fechaEstimada: Date | null = null;

  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }
  wishListData: IWishList = {
    id: null,
    wishListDetails: null,
    titulo: null,
    fechaCreacion: null,
    meta: null,
    cuentaOrigen: null,
    estado: null,
    fechaFin: null,
    procesarWish: null,
    usuario: null
  };

  wishListDetailData: IWishListDetail = {
    wishDetailId: null,
    fechaDetail: null,
    itemName: null,
    precio: null,
    comentario: null,
    link: null,
    procesarDetail: null,
    wishList: null
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

  listMovimiento: IMovimiento[] = [];
  listTipoMov: ITipoMovimiento[] = [
    { id: 'Agregar fondo', descripcion: 'Agregar fondo' },
    { id: 'Retirar fondo', descripcion: 'Retirar fondo' },
    { id: 'Transferir fondo', descripcion: 'Transferir fondo' }
  ];

  dataSource: MatTableDataSource<IWishListDetail> = new MatTableDataSource<IWishListDetail>([]);
  displayedColumns: string[] = ['fechaCreacion', 'itemName', 'precio', 'link', 'comentario', 'cumplido', 'acciones'];

  isLoading: boolean = false;

  spinnerShow(): void {
    this.isLoading = true
  }

  spinnerHide(): void {
    this.isLoading = false
  }
  constructor(public dialog: MatDialog) { }

  async ngOnInit(): Promise<void> {

    this.isUserLogin();

    this._route.params.subscribe(params => {
      this.paramIdWishList = params['idWish'];
    })

    await this.loadItemData(this.paramIdWishList!)


  }

  async loadItemData(idWishList: number) {

    this.wishListData = await this.getWishList(idWishList);
    if (this.wishListData) {
      this.dataSource.data = this.wishListData.wishListDetails!;
      if (this.dataSource.data.length > 0) {
        this.totValorList = this.getTotValorList()!;
        this.pcjeActual = Number(this.getPcjeTotList()!.toFixed(2));
        let fecha: Date = await this.obtenerFechaEstimada(this.wishListData.cuentaOrigen?.sobre?.id!);
        if (fecha) {
          this.fechaEstimada = fecha;
        }
      }
    }
  }

  async getWishList(idWishList: number): Promise<IWishList> {
    try {
      const wishList: IWishList =
        await firstValueFrom(this._wishListService.getWishList(idWishList));
      return wishList;
    } catch (error) {
      console.error('Error al obtener la lista:', error);
      throw error;
    }
  }

  async reloadData() {
    await this.loadItemData(this.paramIdWishList!);

  }


  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }



  editar(IdDetalle: number, idWishList: number) {
    this.newOrUpdate('Actualizar', IdDetalle, idWishList)
  }

  addRegister(): void {
    this.newOrUpdate('Nuevo', null, this.wishListData.id)
  }

  finWishList(): void {
    this.openFormAnimation(this.paramIdWishList!);
  }

  getTotValorList(): number | null {
    return this.dataSource.data
      .filter(item => item.procesarDetail != true)
      .map(item => item.precio).reduce((acc, value) => acc! + value!, 0);
  }
  getPcjeTotList(): number | null {

    if (this.totValorList > 0) {
      if (this.wishListData.cuentaOrigen != null) {
        let v1: number = this.wishListData.cuentaOrigen.saldo!;
        let v2: number = this.totValorList;
        let pcje = ((v1 * 100) / v2);

        return pcje > 100 ? 100 : pcje;
      }
      return 0;
    }
    return 0;
  }

  async cumplirDeseos(): Promise<void> {
    if (window.confirm('Al cumplir los deseos, se descontará el monto exacto a su cuenta asociada y la lista se dará por finalizado. ¿Seguro que deseas continuar?')) {
      this.spinnerShow();

      this.wishListData.wishListDetails?.forEach(async items => {
        if (!items.procesarDetail) {
          await this.procesarWishDetails(items.wishDetailId?.id!, items.wishDetailId?.idWish!, items.precio!, items.itemName!)
        }
      })

      let ok: string = await this.procesarWish(this.wishListData.id!, this.wishListData);

      if (ok) {
        this.showSuccess(this.wishListData.titulo + ": Cumplido!", "Lista de deseos")
        this.spinnerHide();
        this.reloadData();
        this.finWishList();
      }
    }
  }

  async procesarWishDetails(IdDetalle: number, idWish: number, precio: number, itemName: string): Promise<void> {
    await this.transferirFondos(precio, itemName);
  }

  async procesarWish(idWish: number, wishList: IWishList): Promise<string> {

    const user: IUser = {
      id: null,
      username: this.username!
    }

    let wishList_ = wishList;

    let sobreDataOrigen: ISobre = {
      id: null,
      descripcion: null,
      usuario: null
    };

    let cuentaOrigenData: ICuenta = {
      id: 0,
      saldo: 0,
      sobre: sobreDataOrigen
    };

    cuentaOrigenData.id = wishList.cuentaOrigen!.id;

    wishList_.cuentaOrigen = cuentaOrigenData;
    wishList_.estado = true;
    wishList_.fechaFin = new Date;
    wishList_.procesarWish = true;
    wishList_.usuario = user;

    let detalle: IWishListDetail[] = [];
    wishList_.wishListDetails = detalle;


    let response: IResponse = await this.finalizarWish(idWish, this.wishListData)

    if (response) {
      this.showSuccess(wishList.titulo + ": Cumplido!", "Lista de deseos")
      return ('True')
    }
    return ('False')
  }


  async update(idWishList: number, wishList?: IWishList): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._wishListService.updateWishList(idWishList, wishList!));
      return response;
    } catch (error) {
      console.error('Error al actualizar lista de deseo:', error);
      throw error;
    }
  }

  async finalizarWish(idWishList: number, wishList?: IWishList): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._wishListService.finalWish(idWishList, wishList!));
      return response;
    } catch (error) {
      console.error('Error al actualizar lista de deseo:', error);
      throw error;
    }
  }



  newOrUpdate(titulo: String, idDetalle: number | null, idWishList: number | null): void {
    this.openForm(titulo, idDetalle, idWishList);
  }

  async eliminarDetalleWish(IdDetalle: number, idWishList: number) {

    if (window.confirm('¿Seguro que deseas eliminar este elemento?')) {

      let response: IResponse = await this.wishListDetailDelete(IdDetalle, idWishList)

      if (response) {
        this.showSuccess(response.message, "Lista de deseos")
        this.reloadData();
      }
    }
  }

  async wishListDetailDelete(IdDetalle: number, idWishList: number): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._wishListDetailService.deleteWishListDetail(IdDetalle, idWishList));
      return response;
    } catch (error) {
      console.error('Error detalle:', error);
      throw error;
    }
  }



  openForm(titulo: String, idDetalle: number | null, idWishList: number | null) {
    const dialogRef = this.dialog.open(WishListDetailFormComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '350px',
        height: '550px',
        data: {
          titulo: titulo,
          idDetalle: idDetalle,
          idWishList: idWishList,
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.reloadData();
    });
  }

  openFormAnimation(idWishList: number) {
    const dialogRef = this.dialog.open(AnimacionFinwishListComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '99%',
        height: '100%',
        data: {
          idWishList: idWishList,
          wishListData: this.wishListData
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.reloadData();
    });
  }


  getShortDate(fecha: Date): string {
    let ahora = new Date(fecha);
    let fechaActual = ahora.getFullYear() + '-'
      + ('0' + (ahora.getMonth() + 1)).slice(-2) + '-'
      + ('0' + ahora.getDate()).slice(-2)
    return fechaActual;
  }




  async cumplirItemWish(IdDetalle: number, idWish: number, precio: number, itemName: string) {
    if (window.confirm('Al cumplir el deseo, se descontará el monto exacto a su cuenta asociada. ¿Seguro que deseas continuar?')) {
      this.spinnerShow();

      let response: IResponse = await this.updateProcesarWishDetails(IdDetalle, idWish, this.wishListDetailData)

      if (response) {
        await this.transferirFondos(precio, itemName);
        await this.reloadData();
        this.showSuccess(itemName + ": Cumplido!", "Lista de deseos")
        this.spinnerHide();
        // await this.checkEndPrestamo();
      }
    }
  }


  async updateProcesarWishDetails(idDetalle: number, idPrestamo: number, detalleWish?: IWishListDetail): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._wishListDetailService.updateProcesarWish(idDetalle, idPrestamo, detalleWish!));
      return response;
    } catch (error) {
      console.error('Error al actualizar el detalle del prestamo:', error);
      throw error;
    }
  }

  async transferirFondos(pago: number, itemName: string): Promise<void> {
    const user: IUser = {
      id: null,
      username: this.username!
    }
    //origen es beneficiario
    //destino es el origen
    let idSobreOrigen = this.wishListData.cuentaOrigen?.sobre?.id;

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


        //Crea movimiento
        const tipoMovimiento = this.listTipoMov[1].id;
        this.movimientoData.usuario = user;
        this.movimientoData.fecha = new Date();
        this.movimientoData.cuenta = this.cuentaOrigenData;
        this.movimientoData.tipoMovimiento = tipoMovimiento;
        this.movimientoData.monto = monto;
        this.movimientoData.comentario = tipoMovimiento + ": compra de " + itemName + " - (Desde lista de deseos!) ";
        this.movimientoData.transaccion = null;
        // this.movimientoData.transaccion = null;

        let responseMovimiento = await this.saveMovimiento(this.movimientoData);
        if (responseMovimiento) {
          this.showSuccess('Se ha guardado correctamente.', tipoMovimiento)
        }
      }
    }
  }

  async getAllMovimientosByCuenta(cuenta: number): Promise<IMovimiento[]> {
    try {
      const movimientos: IMovimiento[] =
        await firstValueFrom(this._movimientoService.getAllConsultaADDMovByUsername(
          this.startMovFilter,
          this.endMovFilter,
          cuenta,
          this.listTipoMov[0].id,
          this.username!
        ));
      return movimientos;
    } catch (error) {
      console.error('Error al buscar movimientos:', error);
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
        await firstValueFrom(this._movimientoService.saveMovimiento(movimiento!));
      return response;
    } catch (error) {
      console.error('Error al guardar Movimiento:', error);
      throw error;
    }
  }

  async obtenerFechaEstimada(idCuenta: number): Promise<Date> {

    let nuevaFecha = new Date();
    let startDate: Date = new Date();
    let endDate: Date = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    startDate.setDate(1);
    endDate.setDate(0);

    this.startMovFilter = this.getShortDate(startDate);
    this.endMovFilter = this.getShortDate(endDate);

    this.listMovimiento = await this.getAllMovimientosByCuenta(idCuenta);


    if (this.listMovimiento.length > 0) {

      let prom = 0;
      let sum = this.listMovimiento.map(item => item.monto).reduce((acc, value) => acc! + value!, 0);
      let saldoActualCuenta: number = this.wishListData.cuentaOrigen?.saldo!;

      let valorActLista = this.getTotValorList();
      let dif = valorActLista! - saldoActualCuenta;


      if (dif > 0) {
        prom = sum / this.listMovimiento.length;
        let mesesAprox: number = Number((dif! / prom).toFixed(2));

        let dias = Math.floor(mesesAprox * 30.44); // Convierte meses a días aproximados
        nuevaFecha.setDate(nuevaFecha.getDate() + dias);

      }

    }

    return nuevaFecha;
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
