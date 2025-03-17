import { Component, HostListener, OnInit, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Observable, firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DetalleVentaFormComponent } from "./form/detalle-venta-form/detalle-venta-form.component";
import { MatDialog } from '@angular/material/dialog';
import { AsociarTicketFormComponent } from '../asociar-ticket-form/asociar-ticket-form.component';
import { CurrencyPipe } from '@angular/common';
import { IDetalleVenta, IFechasComprasAsociadas, IVenta, DetalleVentaId } from '../../../../models/metales/venta.models';
import { IResponse } from '../../../../models/response.models';
import { CalculosService } from '../../../../services/metales/calculos.service';
import { DetallesVentaService } from '../../../../services/metales/detalles-venta.service';
import { SpinnerService } from '../../../../services/metales/spinner.service';
import { VentaService } from '../../../../services/metales/venta.service';
import { DataService } from '../../../../shared/data.service';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { MetalesNavComponent } from "../../metales-nav/metales-nav.component";
import { ITicket } from '../../../../models/metales/ticket.models';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-detalle-venta',
  standalone: true,
  templateUrl: './detalle-venta.component.html',
  styleUrl: './detalle-venta.component.css',
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
    DetalleVentaFormComponent,
    CurrencyPipe,
    SpinnerComponent,
    MetalesNavComponent,
    RouterOutlet,
    MatMenuModule
]
})
export class DetalleVentaComponent implements OnInit {

  private _ApiService = inject(DetallesVentaService);
  private _ApiVentaService = inject(VentaService);
  private _ApiCalculoService = inject(CalculosService);
  private _DataService = inject(DataService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router)
  private _toastr = inject(ToastrService)
  private _spinnerService = inject(SpinnerService);
  // public detalleVentaData$!: Observable<IDetallesVenta>;
  public detalleVentaData$!: Observable<IDetalleVenta[]>;
  public ticketDescripcion?: string | null = null;
  public isVentaIndividual?: boolean | null = null;
  paramIdVenta: number = 0;
  paramAccion: string = '';
  fechasAsociadasACompras: IFechasComprasAsociadas = {
    fechaIni: null,
    fechaFin: null
  }
  isLoading: boolean = false;
  title:string='';


  //filtro
  filter: string = '';

  //Paginador
  cantidadTotal: number = 0;
  cantidadPorPagina: number = 5;
  numeroDePagina: number = 0;
  opcionesDePaginado: number[] = [1, 5, 10, 25, 100];

  ventaData: IVenta = {
    id: 0,
    descripcion: '',
    fechaVenta: null,
    ventaIndividual: false,
    gananciaTotal: 0,
    editadoPor: null,
    modificadoEl: null,
    ticket: null,
    usuario: null
  };

  ticketData: ITicket = {
    id: 0,
    descripcion: '',
    fechaTicket: null,
    editadoPor: null,
    importTotal: null,
    modificadoEl: null,
    used: false,
    usuario: null
  };

  //responsive
  screenWidth: number | null = null;
  screenHeight: number | null = null;
  responsive: boolean = false;

  dataSource: MatTableDataSource<IDetalleVenta> = new MatTableDataSource<IDetalleVenta>([]);
  displayedColumns: string[] = ['idVenta', 'id', 'metalNombre', 'mentalVentaDescripcion', 'pesoVendido', 'precioPromedio', 'gananciaUnitaria', 'acciones'];

  constructor(public dialog: MatDialog) {
    this.getScreenSize();
  }
  ngOnInit(): void {

    this._route.params.subscribe(params => {
      this.paramIdVenta = params['id'];
      this.paramAccion = params['accion'];
    })
    console.log("params " + this.paramIdVenta);

    this.allDetalleVentaInDataSourcePaginador(this.paramIdVenta, null);
    this._DataService.dataUpdated$.subscribe(() => {
      this.reloadData();
      this.verPrimerRegistro();
    })

    this.preCargaInit(this.paramIdVenta);

  }

  private reloadData() {
    this.allDetalleVentaInDataSourcePaginador(this.paramIdVenta, this.filter);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter = filterValue;
    this.allDetalleVentaInDataSourcePaginador(this.paramIdVenta, filterValue);

  }

  cambiarPagina(event: PageEvent) {
    this.cantidadPorPagina = event.pageSize;
    this.numeroDePagina = event.pageIndex;
    this.allDetalleVentaInDataSourcePaginador(this.paramIdVenta, this.filter);
  }

  allDetalleVentaInDataSourcePaginador(idVenta: number, filter: string | null): void {

    this.detalleVentaData$ = this._ApiService.getDetallesVenta(idVenta,
    );

    this.detalleVentaData$.subscribe((info: IDetalleVenta[]) => {
      this.dataSource.data = info

    })
  }

  getTotalGanancias() {
    return this.dataSource.data.map(g => g.gananciaUnitaria).reduce((acc, value) => acc! + value!, 0);
  }

  async preCargaInit(idVenta: number): Promise<void> {
    let venta: IVenta = await this.getVentaPadre(idVenta);
    if (venta) {
      this.ticketDescripcion = venta.ticket?.descripcion;
      this.isVentaIndividual = venta.ventaIndividual;
      this.title = venta.descripcion;
    }
    this.setFechasComprasAsociadas(idVenta);
    
  }


  async setGananciaTotal(idVenta: number): Promise<void> {
    let venta: IVenta = await this.getVentaPadre(idVenta);
    if (venta) {
      venta.gananciaTotal = this.getTotalGanancias();
      this._ApiVentaService.updateVenta(idVenta, venta)
    }
  }

  async getVentaPadre(idVenta: number): Promise<IVenta> {
    try {
      let venta: IVenta = await firstValueFrom(this._ApiVentaService.getVenta(idVenta))
      return venta;
    } catch (error) {
      console.error('Error al buscar registro padre:', error);
      throw error;
    }
  }

  async eliminar(idVenta: number, idDetalle: number) {
    if (window.confirm('¿Seguro que deseas eliminar este elemento?')) {
      let detalleId: DetalleVentaId = {
        idVenta: idVenta,
        id: idDetalle
      }
      const response = await this.eliminarDetalle(detalleId);
      if (response.idMessage == '200') {
        console.log(response.message);
      }
      this._DataService.dataUpdated$.next();
    }
  }

  async eliminarDetalle(detalleId: DetalleVentaId): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._ApiService.deleteDetalleVenta(detalleId.id, detalleId.idVenta));
      return response;
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      throw error;
    }
  }

  editar(idVenta: number, idDetalle: number) {
    let detalleId: DetalleVentaId = {
      idVenta: idVenta,
      id: idDetalle
    }
    this._DataService.setSelectedDetalleVentaItemId(detalleId);
    this.irAlInicio();
  }

  asociarTicket() {
    this.openForm('Asociar Ticket', 'Asociar Ticket')
  }

  desAsociarTicket() {
    if (window.confirm('¿Seguro que deseas desasociar el ticket?')) {
      this.setTicket(this.paramIdVenta);
      this.ticketDescripcion = null;
    }
  }

  async asociarComprasDiarias() {
    if (window.confirm('¿Seguro que deseas asociar las compras diarias hasta la fecha actual a esta venta?')) {
      try {
        let response: IResponse =
          await this.vincularComprasDiarias(this.paramIdVenta)
        if(response){
          this.setFechasComprasAsociadas(this.paramIdVenta);
          this.spinnerHide();
        }  
      } catch (error) {
        console.error('Error al asociar compras diarias:', error);
        throw error;
      }
    }
  }

  async vincularComprasDiarias(idVenta: number): Promise<IResponse> {
    try {
      this.spinnerShow();
      let response: IResponse =
        await firstValueFrom(this._ApiVentaService.getAsociarComprasDiariasByIdVenta(idVenta));
      return response;

    } catch (error) {
      console.error('Error al vincularComprasDiarias :', error);
      throw error;
    }

  }

  async setFechasComprasAsociadas(idVenta: number) {
    this.fechasAsociadasACompras = await this.getFechasComprasAsociadas(idVenta)
  }

  async getFechasComprasAsociadas(idVenta: number): Promise<IFechasComprasAsociadas> {
    try {
      let fechas: IFechasComprasAsociadas =
        await firstValueFrom(this._ApiVentaService.getFechaComprasDiariasByIdVenta(idVenta));
      return fechas;

    } catch (error) {
      console.error('Error al buscar fechas de compras asociadas:', error);
      throw error;
    }

  }

  async setTicket(idVenta: number): Promise<void> {
    let venta: IVenta = await this.getVentaPadre(idVenta);
    if (venta) {

      this.ventaData!.id = venta.id;
      this.ventaData!.descripcion = venta.descripcion;
      this.ventaData!.fechaVenta = venta.fechaVenta;
      this.ventaData!.ventaIndividual = venta.ventaIndividual;      
      this.ventaData!.modificadoEl = new Date;
      this.ventaData.ticket = this.ticketData;


      let response: IResponse = {
        idMessage: '',
        message: ''
      };
      this._ApiVentaService.updateVenta(idVenta, this.ventaData).subscribe((respuesta: IResponse) => {
        response = respuesta;
      });
      if (response.idMessage != '') {
        console.log(response.message);
      }
    }
  }

  async calcularGanancia() {
    if (window.confirm('¿Seguro que deseas calcular las ganancias asociado a este ticket?')) {
      let response: IResponse = await this.getGanacias(this.paramIdVenta);
      if (response) {
        //this.reloadData();
        this.spinnerHide();
        this.irAVerDetalle(this.paramIdVenta)
      }
    }
  }

  spinnerShow(): void {
    this.irAlInicio();
    this.isLoading = true
  }


  spinnerHide(): void {
    this.isLoading = false
  }


  irAVerDetalle(id: number) {
    this._DataService.setSelectedVentaItemId(id)
    this._router.navigate(["/detalleVentaOnlyRead", id, 'onlyRead'])
  }
  async getGanacias(idVenta: number): Promise<IResponse> {
    try {
      this.spinnerShow();
      let response: IResponse = await
        firstValueFrom(this._ApiCalculoService.getcalcularVentaByIdVenta(idVenta));
      return response;
    } catch (error) {
      console.error('Error al calcular la ganacia:', error);
      throw error;
    }
  }

  openForm(accion: string, titulo: String) {
    const dialogRef = this.dialog.open(AsociarTicketFormComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '500px',
        height: '350px',
        data: {
          tipoAccion: accion,
          titulo: titulo,
          idVenta: this.paramIdVenta
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      this.preCargaInit(this.paramIdVenta);
    });
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
}
