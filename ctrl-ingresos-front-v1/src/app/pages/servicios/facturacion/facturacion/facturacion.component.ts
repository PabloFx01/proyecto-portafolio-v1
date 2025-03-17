import { Component, HostListener, OnInit, inject } from '@angular/core';
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
import { NavServiciosComponent } from '../../nav/nav-servicios.component';
import { FacturaService } from '../../../../services/servicios/factura.service';
import { LoginService } from '../../../../services/login.service';
import { ILoginResponse } from '../../../../models/login.models';
import { IDetalleFactura, IFactura } from '../../../../models/servicios/factura.models';
import { IResponse } from '../../../../models/response.models';
import { DetalleFacturaService } from '../../../../services/servicios/detalleFactura.service';
import { IPeriodPay, IServicio } from '../../../../models/servicios/servicio.models';
import { IUser } from '../../../../models/user.models';
import { FormDetalleFacturaComponent } from './form/form-detalle-factura/form-detalle-factura.component';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'app-facturacion',
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
  templateUrl: './facturacion.component.html',
  styleUrl: './facturacion.component.css'
})
export class FacturacionComponent implements OnInit {

  private _facturaService = inject(FacturaService);
  private _detalleFacturaService = inject(DetalleFacturaService);
  private _route = inject(ActivatedRoute);
  public loginServices = inject(LoginService);
  private _toastr = inject(ToastrService)
  facturaActiva: boolean = false;
  username: string | null = '';
  role: String | null = '';
  userLoginOn: boolean = false;
  title: string = 'Facturación';
  idFactura: number | null = null;
  paramIdServicio: number | null = null;
  paramServicioName: String | null = null;
  diasVto: number = 0;
  diasIniVto: number = 0;
  diasFinVto: number = 0;
  paid: boolean = false;
  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }
  servicioData: IServicio = {
    id: null,
    nombre: null,
    valor: null,
    periodoPago: null,
    fechaIniVto: null,
    fechaFinVto: null,
    comentario: null,
    activo: null,
    usuario: null
  };
  facturaData: IFactura = {
    id: null,
    detallesFactura: null,
    estado: null,
    fecha: null,
    saldoRest: null,
    servicio: null,
    totPag: null,
    fechaPagoTotVto: null,
    usuario: null
  };

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

  dataSource: MatTableDataSource<IDetalleFactura> = new MatTableDataSource<IDetalleFactura>([]);
  displayedColumns: string[] = ['fechaPago', 'pago', 'acciones'];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getScreenSize();
    this.isUserLogin();

    this._route.params.subscribe(params => {
      this.paramIdServicio = params['idServicio'];
      this.paramServicioName = params['servicioName'];
    })

    this.loadItemData(this.paramIdServicio!)

  }

  async loadItemData(idServicio: number) {
    try {
      //solo trae la factura sin pagar
      //solo puede haber una sola factura sin pagar por servicio

      this.facturaData = await this.getFactura(idServicio);
      if (this.facturaData) {
        this.dataSource.data = this.facturaData.detallesFactura!;
        this.facturaActiva = true;
      }

      this.diasIniVto = this.calDiasFaltantesVto(this.facturaData.servicio!.fechaIniVto!,
        this.facturaData.servicio!.fechaFinVto!);
      this.diasFinVto = this.calDiasFaltantesVto(this.facturaData.servicio!.fechaFinVto!,
        this.facturaData.servicio!.fechaFinVto!);

      this.findFacturaPagada();

    } catch (error) {
      this.findFacturaPagada();

      this.facturaData = {
        id: null,
        detallesFactura: null,
        estado: null,
        fecha: null,
        saldoRest: null,
        servicio: null,
        totPag: null,
        fechaPagoTotVto: null,
        usuario: null
      };
      this.facturaActiva = false;
    }
  }

  async findFacturaPagada(): Promise<void> {
    this.paid = false;
    try {
      let factura: IFactura = await this.getFacturaPagada(this.paramIdServicio!);
      if (factura) {
        this.paid = true;

      }
    } catch (error) {
      this.paid = false;
    }
  }
  calDiasFaltantesVto(fechaDesde: Date, fechaHasta: Date): number {

    let fechaInicio = new Date();
    let fechaFin = new Date(this.getShortDate(fechaDesde));

    // Convierte las fechas a milisegundos
    var tiempoInicio = fechaInicio.getTime();
    var tiempoFin = fechaFin.getTime();

    // Calcula la diferencia en milisegundos
    var diferenciaMilisegundos = tiempoFin - tiempoInicio;

    // Convierte la diferencia a días
    var diferenciaDias = diferenciaMilisegundos / (1000 * 60 * 60 * 24);

    return Math.ceil(diferenciaDias);
  }

  async getFactura(idServicio: number): Promise<IFactura> {
    try {
      const factura: IFactura =
        await firstValueFrom(this._facturaService.getFacturaNotPaidByUserAndService(idServicio, this.username!));
      return factura;
    } catch (error) {
      console.error('Error al obtener la Factura:', error);
      throw error;
    }
  }

  async getFacturaPagada(idServicio: number): Promise<IFactura> {
    try {
      const factura: IFactura =
        await firstValueFrom(this._facturaService.getFacturaPaidByUserAndService(idServicio, this.username!));
      return factura;
    } catch (error) {
      console.error('Error al obtener la Factura:', error);
      throw error;
    }
  }

  getDescriptionPeriodPay(id: number): string {
    return this.listPeriodPay.find(periodo => periodo.id === id)?.descripcion || 'sin descripcion';
  }

  private reloadData() {
    this.loadItemData(this.paramIdServicio!);
  }



  async saveFactura() {

    this.servicioData.id = this.paramIdServicio;
    this.facturaData.fecha = new Date();
    this.facturaData.servicio = this.servicioData;
    const user: IUser = {
      id: null,
      username: this.username!
    }
    this.facturaData.usuario = user;
    let response: IResponse = await this.save(this.facturaData);
    if (response) {
      this.showSuccess(response.message, "Factura")
      this.reloadData();
    }

  }

  async save(factura?: IFactura): Promise<IResponse> {
    try {
      const response: any =
        await firstValueFrom(this._facturaService.saveFactura(factura!));
      return response;
    } catch (error) {
      console.error('Error al guardar la factura:', error);
      throw error;
    }
  }

  async eliminarFactura(itemId: number) {

    if (window.confirm('¿Seguro que deseas eliminar este elemento?')) {

      let response: IResponse = await this.facturaDelete(itemId)

      if (response) {
        this.showSuccess(response.message, "Factura")
        this.reloadData();
      }
    }
  }

  async facturaDelete(id: number): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._facturaService.deleteFactura(id));
      return response;
    } catch (error) {
      console.error('Error facturaDelete:', error);
      throw error;
    }
  }

  async eliminarDetalleFactura(IdDetalle: number, idFactura: number) {

    if (window.confirm('¿Seguro que deseas eliminar este elemento?')) {

      let response: IResponse = await this.detalleFacturaDelete(IdDetalle, idFactura)

      if (response) {
        this.showSuccess(response.message, "Factura")
        this.reloadData();
      }
    }
  }

  async detalleFacturaDelete(IdDetalle: number, idFactura: number): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._detalleFacturaService.deleteDetalleFactura(IdDetalle, idFactura));
      return response;
    } catch (error) {
      console.error('Error detalleFacturaDelete:', error);
      throw error;
    }
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }



  editar(IdDetalle: number, idFactura: number, idServicio: number) {
    this.newOrUpdate('Actualizar', IdDetalle, idFactura, idServicio)
  }

  nuevoPago() {
    this.newOrUpdate('Nuevo', null, this.facturaData.id, this.facturaData.servicio?.id!)
  }

  newOrUpdate(titulo: String, idDetalle: number | null, idFactura: number | null, idServicio: number | null): void {
    this.openForm(titulo, idDetalle, idFactura, idServicio);
  }



  openForm(titulo: String, idDetalle: number | null, idFactura: number | null, idServicio: number | null) {
    const dialogRef = this.dialog.open(FormDetalleFacturaComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '350px',
        height: '450px',
        data: {
          titulo: titulo,
          idDetalleFactura: idDetalle,
          idFactura: idFactura,
          idServicio: idServicio
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
      + ('0' + ahora.getDate()).slice(-2) + ' '
    return fechaActual;
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
