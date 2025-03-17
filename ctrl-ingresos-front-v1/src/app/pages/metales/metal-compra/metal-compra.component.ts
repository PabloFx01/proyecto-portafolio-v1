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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MetalCompraFormComponent } from './form/metal-compra-form/metal-compra-form.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ILoginResponse } from '../../../models/login.models';
import { IMetalCompra, MetalId, IMetalCompras } from '../../../models/metales/metal-compra.models';
import { IResponse } from '../../../models/response.models';
import { MetalCompraApiService } from '../../../services/metales/metal-compra-api-service';
import { DataService } from '../../../shared/data.service';
import { MetalesNavComponent } from "../metales-nav/metales-nav.component";
import { LoginService } from '../../../services/login.service';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-metal-compra',
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
    MatDialogModule,
    MatButtonToggleModule,
    CurrencyPipe, MetalesNavComponent, RouterOutlet,
    MatMenuModule],
  templateUrl: './metal-compra.component.html',
  styleUrl: './metal-compra.component.css'
})
export class MetalCompraComponent implements OnInit {


  private _ApiService = inject(MetalCompraApiService);
  private _DataService = inject(DataService);
  private _router = inject(Router)
  private _toastr = inject(ToastrService)
  filtroSeleccionado: string = '';

  //filtro
  filter: string = '';
  state: string = 'ACT';
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

  //responsive
  screenWidth: number | null = null;
  screenHeight: number | null = null;
  responsive: boolean = false;

  dataSource: MatTableDataSource<IMetalCompra> = new MatTableDataSource<IMetalCompra>([]);
  displayedColumns: string[] = ['nombre', 'precio',
    'fechaIni', 'fechaFin', 'acciones'];

  constructor(public dialog: MatDialog) {
    this.getScreenSize();
    this.isUserLogin();
  }

  ngOnInit(): void {
    this.allMetalCompraInDataSourcePaginador(null);
    this._DataService.dataUpdated$.subscribe(() => {
      this.reloadData();
    })


  }

  seleccionarFiltro(filtro: string) {
    this.state = filtro
    this.reloadData();
  }

  private reloadData() {
    this.allMetalCompraInDataSourcePaginador(this.filter);

  }

  getUsuario(): void {
    this._DataService.userLoginData$.subscribe(
      (userLoginResponse: ILoginResponse) => {
        if (userLoginResponse) {
          this.userLoginResponse = userLoginResponse;
        }

      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter = filterValue;
    this.allMetalCompraInDataSourcePaginador(filterValue);
  }

  cambiarPagina(event: PageEvent) {
    this.cantidadPorPagina = event.pageSize;
    this.numeroDePagina = event.pageIndex;
    this.allMetalCompraInDataSourcePaginador(this.filter);
  }

  addRegister() {
    this.openForm('ADD', 'Crear', null)
  }



  async eliminar(itemId: string, ItemPeriod: number) {
    let metalCompra: IMetalCompra = {
      metalId: null,
      nombre: '',
      precio: 0,
      fechaIni: null,
      fechaFin: null,
      editadoPor: '',
      modificadoEl: null,
      usuario: null
    };

    if (window.confirm('¿Seguro que deseas desactivar este elemento?')) {
      let response: IResponse = await this.metalDelete(itemId, metalCompra)

      if (response) {
        this.showSuccess(response.message, "Metales")
        this.reloadData();
      }
    }
  }



  async metalDelete(id: string, metal: IMetalCompra): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._ApiService.softDeleteMetalCompra(id, metal));
      return response;
    } catch (error) {
      console.error('Error softDeleteMetalCompra:', error);
      throw error;
    }
  }

  async restaurar(itemId: string, ItemPeriod: number) {
    let metalCompra: IMetalCompra = {
      metalId: null,
      nombre: '',
      precio: 0,
      fechaIni: null,
      fechaFin: null,
      editadoPor: '',
      modificadoEl: null,
      usuario: null
    };

    if (window.confirm('¿Seguro que deseas restaurar este elemento?')) {
      let response: IResponse = await this.metalRestaurar(itemId, metalCompra)

      if (response) {
        this.showSuccess(response.message, "Metales")
        this.reloadData();
      }
    }
  }



  async metalRestaurar(id: string, metal: IMetalCompra): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._ApiService.restaurarSoftDeleteMetalCompra(id, metal));
      return response;
    } catch (error) {
      console.error('Error restaurarSoftDeleteMetalCompra:', error);
      throw error;
    }
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }

  editar(itemId: string) {
    const metalId: MetalId = {
      id: itemId
    };
    this._DataService.setSelectedMetalCompraItemId(metalId);
    this.openForm('UPDATE', 'Actualizar', metalId.id)
  }

  openForm(accion: string, titulo: String, idMetal: string | null) {
    const dialogRef = this.dialog.open(MetalCompraFormComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '500px',
        height: '550px',
        data: {
          tipoAccion: accion,
          idMetal: idMetal,
          titulo: titulo
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.reloadData();
    });
  }

  allMetalCompraInDataSourcePaginador(filter: string | null): void {
    this._ApiService.getMetalComprasPaginador
      (
        this.cantidadPorPagina,
        this.numeroDePagina,
        this.state, filter,
        this.username!
      )
      .subscribe((metales: IMetalCompras) => {
        this.dataSource.data = metales.elementos;
        this.cantidadTotal = metales.cantidadTotal;
      });
  }

  irADetalles(itemId: string) {
    const metalId: MetalId = {
      id: itemId

    };
    this._router.navigate(["/detalleMetaleCompra", metalId.id])
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
