import { Component, HostListener, OnInit, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { CompraFormComponent } from './form/compra-form/compra-form.component';
import { ILoginResponse } from '../../../models/login.models';
import { ICompra, ICompras } from '../../../models/metales/compra.models';
import { IResponse } from '../../../models/response.models';
import { CompraService } from '../../../services/metales/compra.service';
import { DataService } from '../../../shared/data.service';
import { MetalesNavComponent } from "../metales-nav/metales-nav.component";
import { LoginService } from '../../../services/login.service';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'app-compra',
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
    CurrencyPipe,
    MatCheckboxModule, MetalesNavComponent, RouterOutlet, MatMenuModule],

  templateUrl: './compra.component.html',
  styleUrl: './compra.component.css'
})
export class CompraComponent implements OnInit {



  private _ApiService = inject(CompraService);
  private _DataService = inject(DataService);
  private _router = inject(Router)
  private _toastr = inject(ToastrService)
  private compras: ICompra[] = [];

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

  totalComprado: number = 0;
  listComprasNotVenta: ICompra[] = [];

  //responsive
  screenWidth: number | null = null;
  screenHeight: number | null = null;
  responsive: boolean = false;

  dataSource: MatTableDataSource<ICompra> = new MatTableDataSource<ICompra>([]);
  displayedColumns: string[] = ['id', 'fechaCompra', 'totalComprado', 'cierre', 'ficticio', 'comentario', 'acciones'];
  filtroSeleccionado: string = 'ACT';

  seleccionarFiltro(filtro: string) {
    this.getScreenSize();
    this.filtroSeleccionado = filtro;
    this.getTotalComprado()
  }

  constructor(public dialog: MatDialog) {
    this.isUserLogin();
  }

  ngOnInit(): void {
    this.getScreenSize();
    this.allCompraInDataSourcePaginador();
    this._DataService.dataUpdated$.subscribe(() => {
      this.reloadData();
    })

    if (this.role == 'ADMIN') {
      this.displayedColumns.push('editadoPor');
      this.displayedColumns.push('modificadoEl');
    }

    this.getTotalComprado()
  }

  private reloadData() {
    this.allCompraInDataSourcePaginador();
    this.getTotalComprado()
  }

  getUsuario(): void {
    this._DataService.userLoginData$.subscribe(
      (userLoginResponse: ILoginResponse) => {
        if (userLoginResponse) {
          this.userLoginResponse = userLoginResponse;
        }

      })
  }

  cambiarPagina(event: PageEvent) {
    this.cantidadPorPagina = event.pageSize;
    this.numeroDePagina = event.pageIndex;
    this.allCompraInDataSourcePaginador();
  }

  addRegister(): void {
    let encontro = this.getCompraAbierta();
    if (encontro) {
      if (window.confirm('Aún hay compras sin cerrar ¿Seguro que deseas empezar una nueva compra?')) {
        this.nuevaCompra(null);
      }
    } else {
      this.nuevaCompra(null);
    }
  }

  getCompraAbierta(): boolean {
    let encontro: boolean = false;
    this.compras.forEach((elemento: ICompra) => {
      if (elemento.cierre == false) {
        encontro = true;
      }
    })
    return encontro;
  }

  // async empezarDia() {  
  //   let compra: ICompra = {
  //     id: null,
  //     fechaCompra: new Date(),
  //     totalComprado: 0,
  //     cierre: false,
  //     venta: null,
  //     editadoPor: this.userLoginResponse.username,
  //     detalleCompra: [],
  //     modificadoEl: null
  //   };

  //   let response: any = await this.initCompra(compra);
  //   let maxIdCompra: number = await this.getMaxIdCompra();
  //   console.log("maxid" + maxIdCompra);

  //   if (maxIdCompra == null) {
  //     maxIdCompra = 1;

  //   }
  //   this._DataService.setSelectedCompraItemId(maxIdCompra)
  //   this._router.navigate(["/detallesCompra", maxIdCompra])
  // }

  async getMaxIdCompra(): Promise<number> {
    try {
      const maxId: number =
        await firstValueFrom(this._ApiService.getMaxIdCompra(this.username!));
      return maxId;
    } catch (error) {
      console.error('Error al obtener el detalleId:', error);
      throw error;
    }
  }

  async initCompra(compra: ICompra): Promise<IResponse> {
    try {
      const response: any =
        await firstValueFrom(this._ApiService.saveCompra(compra));
      return response;
    } catch (error) {
      console.error('Error al obtener el detalleId:', error);
      throw error;
    }
  }

  // getTotalComprado() {
  //   return this.dataSource.data.map(g => g.totalComprado).reduce((acc, value) => acc! + value!, 0);
  // }

  async getTotalComprado(): Promise<void> {
    this.listComprasNotVenta = await this.getComprasNotVenta()
    if (this.listComprasNotVenta.length > 0) {
      if (this.filtroSeleccionado == 'ACT') {
        this.totalComprado = this.listComprasNotVenta
          .filter(s => !s.ficticio)
          .filter(s => s.comentario != 'Generado automáticamente')
          .map(s => s.totalComprado)
          .reduce((acc, value) => acc! + value!, 0)
      } else {
        this.totalComprado = this.listComprasNotVenta
          .filter(s => !s.ficticio)
          .map(s => s.totalComprado)
          .reduce((acc, value) => acc! + value!, 0)
      }
    }


  }

  async getComprasNotVenta(): Promise<ICompra[]> {
    try {
      const compras = await firstValueFrom(this._ApiService.getComprasNotVenta(this.username!));
      return compras;
    } catch (error) {
      console.error('Error al buscar compras no vendidas:', error);
      throw error;
    }
  }
  editar(itemId: number) {
    this._DataService.setSelectedCompraItemId(itemId)
    this._router.navigate(["/detallesCompra", itemId])
  }

  irADetalles(itemId: number) {
    this._DataService.setSelectedCompraItemId(itemId)
    this._router.navigate(["/detallesCompraOnlyRead", itemId, 'onlyRead'])
  }


  allCompraInDataSourcePaginador(): void {
    this._ApiService.getComprasPaginador(this.cantidadPorPagina, this.numeroDePagina, this.username!)
      .subscribe((compras: ICompras) => {
        this.dataSource.data = compras.elementos;
        this.cantidadTotal = compras.cantidadTotal;
        this.compras = compras.elementos;
      });
  }

  nuevaCompra(idItem: number | null) {
    this.openForm('Nueva compra', null);

  }

  editarCompra(idItem: number) {
    this.openForm('Actualizar compra', idItem);

  }

  openForm(titulo: String, idItem: number | null) {
    const dialogRef = this.dialog.open(CompraFormComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '500px',
        height: '450px',
        data: {
          titulo: titulo,
          idItem: idItem
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.reloadData();
    });
  }

  async eliminar(id: number) {
    if (window.confirm('¿Seguro que deseas eliminar este elemento?')) {
      const response = await this.eliminarCompra(id);
      if (response.idMessage == '200') {
        console.log(response.message);
      }
      this._DataService.dataUpdated$.next();
    }
  }

  async eliminarCompra(id: number): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._ApiService.deleteCompra(id));
      return response;
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      throw error;
    }
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
