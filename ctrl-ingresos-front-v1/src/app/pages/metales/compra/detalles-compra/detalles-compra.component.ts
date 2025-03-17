import { Component, HostListener, OnInit, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DetalleCompraFormComponent } from "./form/detalle-compra-form/detalle-compra-form.component";
import { Observable, firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { IDetalleCompra, DetalleCompraId, ICompra } from '../../../../models/metales/compra.models';
import { IResponse } from '../../../../models/response.models';
import { CalculosService } from '../../../../services/metales/calculos.service';
import { CompraService } from '../../../../services/metales/compra.service';
import { DetallesCompraService } from '../../../../services/metales/detalles-compra.service';
import { DataService } from '../../../../shared/data.service';
import { MetalesNavComponent } from "../../metales-nav/metales-nav.component";
import { ILoginResponse } from '../../../../models/login.models';
import { LoginService } from '../../../../services/login.service';
import { IUser } from '../../../../models/user.models';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'app-detalles-compra',
  standalone: true,
  templateUrl: './detalles-compra.component.html',
  styleUrl: './detalles-compra.component.css',
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
    DetalleCompraFormComponent,
    CurrencyPipe, MetalesNavComponent, RouterOutlet, MatMenuModule]
})
export class DetallesCompraComponent implements OnInit {

  private _ApiService = inject(DetallesCompraService);
  private _ApiCompraService = inject(CompraService);
  private _ApiCalculoService = inject(CalculosService)
  private _DataService = inject(DataService);
  private _route = inject(ActivatedRoute);
  public detalleCompraData$!: Observable<IDetalleCompra[]>;
  private _router = inject(Router)
  private _toastr = inject(ToastrService)
  paramIdCompra: number = 0;
  paramAccion: string = '';

  //filtro
  filter: string = '';

  //Paginador
  cantidadTotal: number = 0;
  cantidadPorPagina: number = 5;
  numeroDePagina: number = 0;
  opcionesDePaginado: number[] = [1, 5, 10, 25, 100];

  loginServices = inject(LoginService);
  username: string | null = '';
  role: String | null = '';
  userLoginOn: boolean = false;

  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }

  compraData: ICompra = {
    id: null,
    fechaCompra: new Date(),
    totalComprado: 0,
    cierre: false,
    venta: null,
    editadoPor: '',
    detalleCompra: [],
    modificadoEl: null,
    usuario: null
  };
  //responsive
  screenWidth: number | null = null;
  screenHeight: number | null = null;
  responsive: boolean = false;

  dataSource: MatTableDataSource<IDetalleCompra> = new MatTableDataSource<IDetalleCompra>([]);
  displayedColumns: string[] = ['id', 'metal.nombre', 'precio', 'peso', 'importe', 'acciones'];

  constructor() {
    this.getScreenSize();
    this.isUserLogin();
  }

  ngOnInit(): void {

    this._route.params.subscribe(params => {
      this.paramIdCompra = params['id'];
      this.paramAccion = params['accion'];

    })

    this.allDetalleCompraInDataSourcePaginador(this.paramIdCompra, null);
    this._DataService.dataUpdated$.subscribe(() => {
      this.reloadData();
      this.verPrimerRegistro();
    })
  }


  private reloadData() {
    this.allDetalleCompraInDataSourcePaginador(this.paramIdCompra, null);
  }

  addRegister() {

  }

  async eliminar(idCompra: number, idDetalle: number) {
    if (window.confirm('¿Seguro que deseas eliminar este elemento?')) {
      let detalleId: DetalleCompraId = {
        idCompra: idCompra,
        id: idDetalle
      }
      const response = await this.eliminarDetalle(detalleId);
      if (response.idMessage == '200') {
        console.log(response.message);
      }
      this._DataService.dataUpdated$.next();
    }
  }

  async eliminarDetalle(detalleId: DetalleCompraId): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._ApiService.deleteDetalleCompra(detalleId.id, detalleId.idCompra));
      return response;
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      throw error;
    }
  }

  editar(idCompra: number, idDetalle: number) {
    let detalleId: DetalleCompraId = {
      idCompra: idCompra,
      id: idDetalle
    }
    this._DataService.setSelectedDetalleCompraItemId(detalleId);
    this.irAlInicio();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter = filterValue;
    this.allDetalleCompraInDataSourcePaginador(this.paramIdCompra, filterValue);

  }

  cambiarPagina(event: PageEvent) {
    this.cantidadPorPagina = event.pageSize;
    this.numeroDePagina = event.pageIndex;
    this.allDetalleCompraInDataSourcePaginador(this.paramIdCompra, this.filter);
  }


  allDetalleCompraInDataSourcePaginador(idCompra: number, filter: string | null): void {
    this.detalleCompraData$ = this._ApiService.getDetallesCompra(idCompra);

    this.detalleCompraData$.subscribe((info: IDetalleCompra[]) => {
      this.dataSource.data = info
    })


  }

  async cerrarDia() {
    let totalComprado: number = 0;
    if (window.confirm('¿Seguro que deseas cerrar el día?')) {

      if (this.paramIdCompra != null) {
        const detalleCompraList: IDetalleCompra[] = await this.findAllDetalle(this.paramIdCompra);
        detalleCompraList.forEach(detalle => {
          totalComprado += detalle.importe;
        })


        let compra: ICompra = await this.findCompraById(this.paramIdCompra)

        let usuario: IUser = {
          id: compra.usuario?.id!,
          username: this.username!
        }
        this.compraData.id = this.paramIdCompra;
        this.compraData.fechaCompra = compra.fechaCompra;
        this.compraData.totalComprado = totalComprado;
        this.compraData.cierre = true;
        this.compraData.venta = null;
        this.compraData.editadoPor = this.username!;
        this.compraData.ficticio = compra.ficticio;
        //this.compraData.detalleCompra= ;
        this.compraData.modificadoEl = new Date();
        this.compraData.usuario = usuario;


        let response: IResponse = await this.actualizarCompra(this.paramIdCompra, this.compraData)
        if (response) {
          if (compra.ficticio == false) {
            let responseCalculo = await this.calcularInventarioByIdCompra(this.paramIdCompra)
            if (responseCalculo) {
              this.showSuccess("Se ha actualizado correctamente.", "Inventario")
            }
          }
          this._DataService.dataUpdated$.next();
          this._router.navigate(["/compra"])

        }
      }
    }
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }

  async calcularInventarioByIdCompra(idCompra: number): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._ApiCalculoService.getCalcularInventarioByIdCompra(idCompra));
      return response;
    } catch (error) {
      console.error('Error al obtener el detalleId:', error);
      throw error;
    }
  }

  async findAllDetalle(idCompra: number): Promise<IDetalleCompra[]> {
    try {
      const detalleList: IDetalleCompra[] =
        await firstValueFrom(this._ApiService.getDetallesCompra(idCompra));
      return detalleList;
    } catch (error) {
      console.error('Error al obtener el detalleId:', error);
      throw error;
    }
  }

  async findCompraById(idCompra: number): Promise<ICompra> {
    try {
      const compraActual: ICompra =
        await firstValueFrom(this._ApiCompraService.getCompra(idCompra));
      return compraActual;
    } catch (error) {
      console.error('Error al obtener el detalleId:', error);
      throw error;
    }
  }

  async actualizarCompra(idCompra: number, compra: ICompra): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._ApiCompraService.updateCompra(idCompra, compra));
      return response;
    } catch (error) {
      console.error('Error al obtener el detalleId:', error);
      throw error;
    }
  }

  getTotalComprado() {
    return this.dataSource.data.map(c => c.importe).reduce((acc, value) => acc! + value!, 0);
  }

  irAlInicio() {
    window.scrollTo(0, 0); // Esto hace que la página se vaya a la posición (0, 0)
  }
  verPrimerRegistro() {
    window.scrollTo(0, 70);
  }

  //responsive
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    if (this.screenWidth <= 750) {
      this.responsive = true;

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
