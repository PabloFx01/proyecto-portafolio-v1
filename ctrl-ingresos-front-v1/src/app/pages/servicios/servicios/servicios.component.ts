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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NavServiciosComponent } from "../nav/nav-servicios.component";
import { ServicioService } from '../../../services/servicios/servicio.service';
import { DataService } from '../../../shared/data.service';
import { LoginService } from '../../../services/login.service';
import { IPeriodPay, IServicio, IServicios } from '../../../models/servicios/servicio.models';
import { ILoginResponse } from '../../../models/login.models';
import { IResponse } from '../../../models/response.models';
import { ServicioFormComponent } from './form/servicio-form/servicio-form.component';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'app-servicios',
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
    NavServiciosComponent,
    MatMenuModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent implements OnInit {
  private _servicioService = inject(ServicioService);
  private _DataService = inject(DataService);
  private _router = inject(Router)
  public loginServices = inject(LoginService);
  private _toastr = inject(ToastrService)
  username: string | null = '';
  role: String | null = '';
  userLoginOn: boolean = false;
  filtroSeleccionado: string = '';
  title: string = 'Servicios';
  servicios: IServicio[] = [];
  totValorServAct: number = 0;
  //filtro
  filter: string = '';
  state: string = 'ALL';
  //Paginador
  cantidadTotal: number = 0;
  cantidadPorPagina: number = 5;
  numeroDePagina: number = 0;
  opcionesDePaginado: number[] = [1, 5, 10, 25, 100];

  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }

  //Periodo de pago

  listPeriodPay: IPeriodPay[] = [
    { id: 0.5, descripcion: 'Quincenal' },
    { id: 1, descripcion: 'Mensual' },
    { id: 2, descripcion: 'Bimestral' },
    { id: 3, descripcion: 'Trimestral' },
    { id: 6, descripcion: 'Semestral ' },
    { id: 12, descripcion: 'Anual' }
  ];

  //responsive
  screenWidth: number | null = null;
  screenHeight: number | null = null;
  responsive: boolean = false;

  dataSource: MatTableDataSource<IServicio> = new MatTableDataSource<IServicio>([]);
  displayedColumns: string[] = ['nombre', 'valor', 'periodoPago',
    'fechaIniVto', 'fechaFinVto', 'comentario',
    'activo', 'acciones'];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getScreenSize();
    this.isUserLogin();
    this.allServiciosInDataSourcePaginador(null);
    this._DataService.dataUpdated$.subscribe(() => {
      this.reloadData();
    })
  }

  seleccionarFiltro(filtro: string) {
    this.state = filtro
    this.reloadData();
  }

  private reloadData() {
    this.allServiciosInDataSourcePaginador(this.filter);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter = filterValue;
    this.allServiciosInDataSourcePaginador(filterValue);
  }

  cambiarPagina(event: PageEvent) {
    this.cantidadPorPagina = event.pageSize;
    this.numeroDePagina = event.pageIndex;
    this.allServiciosInDataSourcePaginador(this.filter);
  }

  addRegister() {
    this.newOrUpdate("Nuevo", null);
  }

  getTotValorServAct(): number | null {
    return this.servicios.map(s => s.valor).reduce((acc, value) => acc! + value!, 0);
  }

  async eliminar(itemId: number) {

    if (window.confirm('¿Seguro que deseas desactivar este elemento?')) {

      let response: IResponse = await this.softDelete(itemId)

      if (response) {
        this.showSuccess(response.message, "Servicio")
        this.reloadData();
      }
    }
  }

  async softDelete(id: number): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._servicioService.softDeleteServicio(id));
      return response;
    } catch (error) {
      console.error('Error softDelete concepto:', error);
      throw error;
    }
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }


  async getAllServiciosAct(username: string): Promise<IServicio[]> {
    try {
      const servicio: IServicio[] =
        await firstValueFrom(this._servicioService.getAllServiciosAct(username));
      return servicio;
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
      throw error;
    }
  }

  editar(itemId: number) {
    this.newOrUpdate('Actualizar', itemId)
  }

  newOrUpdate(titulo: String, itemId: number | null): void {
    this.openForm(titulo, itemId);
  }

  openForm(titulo: String, itemId: number | null) {
    const dialogRef = this.dialog.open(ServicioFormComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '650px',
        height: '450px',
        data: {
          titulo: titulo,
          id: itemId
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.reloadData();
    });
  }

  async allServiciosInDataSourcePaginador(filter: string | null): Promise<void> {

    this._servicioService.getServicioPaginador
      (
        this.cantidadPorPagina,
        this.numeroDePagina,
        this.state, this.username!, filter
      )
      .subscribe((servicio: IServicios) => {
        this.dataSource.data = servicio.elementos;
        this.cantidadTotal = servicio.cantidadTotal;
      });
    this.servicios = await this.getAllServiciosAct(this.username!)
    if (this.servicios.length > 0) {
      this.totValorServAct = this.getTotValorServAct()!;
    }
  }

  getDescriptionPeriodPay(id: number): string {
    return this.listPeriodPay.find(periodo => periodo.id === id)?.descripcion || 'sin descripcion';
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
