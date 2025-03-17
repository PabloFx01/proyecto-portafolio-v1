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
import { MatDialog } from '@angular/material/dialog';
import { VentaFormComponent } from './form/venta-form/venta-form.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { firstValueFrom } from 'rxjs';
import { ILoginResponse } from '../../../models/login.models';
import { IVenta, IVentas } from '../../../models/metales/venta.models';
import { IResponse } from '../../../models/response.models';
import { VentaService } from '../../../services/metales/venta.service';
import { DataService } from '../../../shared/data.service';
import { MetalesNavComponent } from "../metales-nav/metales-nav.component";
import { LoginService } from '../../../services/login.service';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-venta',
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
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css'
})
export class VentaComponent implements OnInit {

  private _ApiVentaService = inject(VentaService);
  private _DataService = inject(DataService);
  private _router = inject(Router)
  private _toastr = inject(ToastrService)
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
  //responsive
  screenWidth: number | null = null;
  screenHeight: number | null = null;
  responsive: boolean = false;

  dataSource: MatTableDataSource<IVenta> = new MatTableDataSource<IVenta>([]);
  displayedColumns: string[] = ['id', 'descripcion', 'fechaVenta', 'ventaIndividual', 'gananciaTotal', 'ticketDescripcion', 'acciones'];
  constructor(public dialog: MatDialog) {
    this.getScreenSize();
    this.isUserLogin();

  }
  ngOnInit(): void {
    this.allVentaInDataSourcePaginador(null);
    this._DataService.dataUpdated$.subscribe(() => {
      this.reloadData();
    })


    // if (this.role == 'ADMIN') {
    //   this.displayedColumns.push('editadoPor');
    //   this.displayedColumns.push('modificadoEl');
    // }
  }

  allVentaInDataSourcePaginador(filter: string | null): void {
    this._ApiVentaService.getVentaPaginador(this.cantidadPorPagina, this.numeroDePagina, filter, this.username!)
      .subscribe((ventas: IVentas) => {
        this.dataSource.data = ventas.elementos;
        this.cantidadTotal = ventas.cantidadTotal;
      });
  }
  private reloadData() {
    this.allVentaInDataSourcePaginador(this.filter);
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
    this.allVentaInDataSourcePaginador(this.filter);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter = filterValue;
    this.allVentaInDataSourcePaginador(filterValue);

  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }

  async eliminar(id: number) {
    if (window.confirm('¿Seguro que deseas eliminar este elemento?')) {
      const response = await this.eliminarVenta(id);
      if (response.idMessage == '200') {
        console.log(response.message);
      }
      this._DataService.dataUpdated$.next();
    }
  }

  async eliminarVenta(id: number): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._ApiVentaService.deleteVenta(id));
      return response;
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      throw error;
    }
  }
  editar(id: number) {
    this.openForm('Update', 'Actualizar', id);
  }
  irADetalles(id: number) {
    this._DataService.setSelectedVentaItemId(id)
    this._router.navigate(["/detalleVenta", id])
  }

  verDetalles(id: number) {
    this._DataService.setSelectedVentaItemId(id)
    this._router.navigate(["/detalleVentaOnlyRead", id, 'onlyRead'])
  }

  addRegister() {
    this.openForm('Add', 'Crear', null);
  }

  openForm(accion: string, titulo: String, idVenta: number | null) {
    const dialogRef = this.dialog.open(VentaFormComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '500px',
        height: '450px',
        data: {
          tipoAccion: accion,
          titulo: titulo,
          idVenta: idVenta
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.reloadData();
    });
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
