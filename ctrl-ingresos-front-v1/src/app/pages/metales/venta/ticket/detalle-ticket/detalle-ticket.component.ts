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
import { Observable, firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DetalleTicketFormComponent } from "./form/detalle-ticket-form/detalle-ticket-form.component";
import { IDetallesTicket, IDetalleTicket, DetalleTicketId } from '../../../../../models/metales/ticket.models';
import { IResponse } from '../../../../../models/response.models';
import { DetalleTicketService } from '../../../../../services/metales/detalle-ticket.service';
import { DataService } from '../../../../../shared/data.service';
import { MetalesNavComponent } from "../../../metales-nav/metales-nav.component";
import { MatMenuModule } from '@angular/material/menu';
import { SpinnerComponent } from "../../../../../shared/spinner/spinner.component";

@Component({
  selector: 'app-detalle-ticket',
  standalone: true,
  templateUrl: './detalle-ticket.component.html',
  styleUrl: './detalle-ticket.component.css',
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
    DetalleTicketFormComponent,
    CurrencyPipe, MetalesNavComponent,
    RouterOutlet,
    MatMenuModule, SpinnerComponent]
})
export class DetalleTicketComponent implements OnInit {


  private _ApiService = inject(DetalleTicketService);
  private _DataService = inject(DataService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router)
  private _toastr = inject(ToastrService)
  public detalleTicketData$!: Observable<IDetallesTicket>;
  paramIdTicket: number = 0;
  paramAccion: string = '';

  //filtro
  filter: string = '';

  //Paginador
  cantidadTotal: number = 0;
  cantidadPorPagina: number = 5;
  numeroDePagina: number = 0;
  opcionesDePaginado: number[] = [1, 5, 10, 25, 100];

  //responsive
  screenWidth: number | null = null;
  screenHeight: number | null = null;
  responsive: boolean = false;

  dataSource: MatTableDataSource<IDetalleTicket> = new MatTableDataSource<IDetalleTicket>([]);
  displayedColumns: string[] = ['idTicket', 'id', 'metalNombre', 'metalDescripcionTicket', 'pesoVendido', 'precioVenta', 'importe', 'acciones'];
  isLoading: boolean = false;
  
  spinnerShow(): void {
    this.isLoading = true
  }
  
    spinnerHide(): void {
    this.isLoading = false
  }
  ngOnInit(): void {
    this.getScreenSize();
    this._route.params.subscribe(params => {
      this.paramIdTicket = params['id'];
      this.paramAccion = params['accion'];
    })


    this.allDetalleTicketInDataSourcePaginador(this.paramIdTicket, null);
    this._DataService.dataUpdated$.subscribe(() => {
      this.reloadData();
      this.verPrimerRegistro();
    })
  }
  async eliminar(idTicket: number, idDetalle: number) {
    if (window.confirm('¿Seguro que deseas eliminar este elemento?')) {
      this.spinnerShow();
      let detalleId: DetalleTicketId = {
        idTicket: idTicket,
        id: idDetalle
      }
      const response = await this.eliminarDetalle(detalleId);
      if (response.idMessage == '200') {
        console.log(response.message);
      }
      this.spinnerHide();
      this._DataService.dataUpdated$.next();
    }
  }

  async eliminarDetalle(detalleId: DetalleTicketId): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._ApiService.deleteDetalleTicket(detalleId.id, detalleId.idTicket));
      return response;
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      throw error;
    }
  }

  editar(idTicket: number, idDetalle: number) {
    let detalleId: DetalleTicketId = {
      idTicket: idTicket,
      id: idDetalle
    }
    this._DataService.setSelectedDetalleTicketItemId(detalleId);
    this.irAlInicio();
  }





  private reloadData() {
    this.allDetalleTicketInDataSourcePaginador(this.paramIdTicket, this.filter);
  }

  allDetalleTicketInDataSourcePaginador(idTicket: number, filter: string | null): void {
    this.detalleTicketData$ = this._ApiService.getDetallesTicketPaginador(idTicket,
      this.cantidadPorPagina,
      this.numeroDePagina,
      filter);

    this.detalleTicketData$.subscribe((info: IDetallesTicket) => {
      this.dataSource.data = info.elementos
      this.cantidadTotal = info.cantidadTotal;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter = filterValue;
    this.allDetalleTicketInDataSourcePaginador(this.paramIdTicket, filterValue);

  }

  cambiarPagina(event: PageEvent) {
    this.cantidadPorPagina = event.pageSize;
    this.numeroDePagina = event.pageIndex;
    this.allDetalleTicketInDataSourcePaginador(this.paramIdTicket, this.filter);
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

  verPrimerRegistro() {
    window.scrollTo(0, 70);
  }

  irAlInicio() {
    window.scrollTo(0, 0); // Esto hace que la página se vaya a la posición (0, 0)
  }

}
