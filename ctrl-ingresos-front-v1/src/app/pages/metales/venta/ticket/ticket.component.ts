import { Component, HostListener, OnInit, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule,CurrencyPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { TicketFormComponent } from './form/ticket-form/ticket-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ILoginResponse } from '../../../../models/login.models';
import { ITicket, ITickets } from '../../../../models/metales/ticket.models';
import { IResponse } from '../../../../models/response.models';
import { CalculosService } from '../../../../services/metales/calculos.service';
import { TicketService } from '../../../../services/metales/ticket.service';
import { DataService } from '../../../../shared/data.service';
import { MetalesNavComponent } from "../../metales-nav/metales-nav.component";
import { LoginService } from '../../../../services/login.service';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-ticket',
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
    MatCheckboxModule, MetalesNavComponent, RouterOutlet,MatMenuModule],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent implements OnInit {

  private _ApiTicketService = inject(TicketService);
  private _DataService = inject(DataService);
  private _router = inject(Router)
  private _toastr = inject(ToastrService)
  private _apiCalculoSerivice = inject(CalculosService);

  //filtro
  filter: string = '';
  //Paginador
  cantidadTotal: number = 0;
  cantidadPorPagina: number = 5;
  numeroDePagina: number = 0;
  opcionesDePaginado: number[] = [1, 5, 10, 25, 100];
  //Usuario
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

  dataSource: MatTableDataSource<ITicket> = new MatTableDataSource<ITicket>([]);
  displayedColumns: string[] = ['id', 'descripcion', 'fechaTicket', 'importeTotal','used', 'acciones'];
  constructor(public dialog: MatDialog) {
    this.getScreenSize();
    this.isUserLogin();
  }

  ngOnInit(): void {
    this.allTicketInDataSourcePaginador(null);
    this._DataService.dataUpdated$.subscribe(() => {
      this.reloadData();
    })    
    // if(this.userLoginResponse.role=='ADMIN'){
    //   this.displayedColumns.push('editadoPor');
    //   this.displayedColumns.push('modificadoEl');
    // }
  }

  allTicketInDataSourcePaginador(filter: string | null): void {
    this._ApiTicketService.getTicketPaginador(this.cantidadPorPagina, this.numeroDePagina, filter, this.username!)
      .subscribe((ticket: ITickets) => {
        this.dataSource.data = ticket.elementos;
        this.cantidadTotal = ticket.cantidadTotal;
      });
  }

  private reloadData() {
    this.allTicketInDataSourcePaginador(this.filter);
  }

  cambiarPagina(event: PageEvent) {
    this.cantidadPorPagina = event.pageSize;
    this.numeroDePagina = event.pageIndex;
    this.allTicketInDataSourcePaginador(this.filter);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter = filterValue;
    this.allTicketInDataSourcePaginador(filterValue);

  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }

  async eliminar(id: number) {
    if (window.confirm('¿Seguro que deseas eliminar este elemento?')) {
      const response = await this.eliminarTicket(id);
      if (response.idMessage == '200') {
        console.log(response.message);
      }
      this._DataService.dataUpdated$.next();
    }
  }

  async eliminarTicket(id: number): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._ApiTicketService.deleteTicket(id));
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
    this._DataService.setSelectedTicketItemId(id)
    this._router.navigate(["/detalleTicket", id])
  }

  verDetalles(id: number) {
    this._DataService.setSelectedTicketItemId(id)
    this._router.navigate(["/detalleTicketOnlyRead", id, 'onlyRead'])
    }

  addRegister() {
    this.openForm('Add', 'Crear', null);
  }

  openForm(accion: string, titulo: String, idTicket: number | null) {
    const dialogRef = this.dialog.open(TicketFormComponent,
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
          idTicket: idTicket
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.reloadData();
    });
  }

  async refresh(id: number) {
    const response: IResponse = await this.actualizarElemento(id);
    if (response) { this.reloadData(); }
  }

  async actualizarElemento(id: number): Promise<IResponse> {
    try {
      const response: IResponse = await firstValueFrom
        (this._apiCalculoSerivice.getCalcularImporteTotalTicketByIdTicket(id))
      return response
    } catch (error) {
      console.error('Error al refrescar el registro:', error);
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
