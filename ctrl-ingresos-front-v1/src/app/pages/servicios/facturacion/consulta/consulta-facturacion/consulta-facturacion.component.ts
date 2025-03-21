import { Component, OnInit, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { CommonModule, } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NavServiciosComponent } from '../../../nav/nav-servicios.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ILoginResponse } from '../../../../../models/login.models';
import { LoginService } from '../../../../../services/login.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioGroup, MatRadioModule } from '@angular/material/radio';
import { IServicio } from '../../../../../models/servicios/servicio.models';
import { ServicioService } from '../../../../../services/servicios/servicio.service';
import { IDetalleFactura, IEstados, IFactura, IFacturas } from '../../../../../models/servicios/factura.models';
import { FacturaService } from '../../../../../services/servicios/factura.service';
import { SpinnerComponent } from "../../../../../shared/spinner/spinner.component";


@Component({
  selector: 'app-consulta-facturacion',
  standalone: true,
  imports: [CommonModule,
    RouterOutlet,
    MatTableModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    NavServiciosComponent,
    MatRadioModule,
    MatRadioGroup, SpinnerComponent],
  templateUrl: './consulta-facturacion.component.html',
  styleUrl: './consulta-facturacion.component.css'
})
export class ConsultaFacturacionComponent {
  _servicioService = inject(ServicioService);
  _facturaService = inject(FacturaService);
  listServicios: IServicio[] = [];

  loginServices = inject(LoginService);

  consultaFacturaForm!: FormGroup;

  username: string | null = '';
  role: String | null = '';
  userLoginOn: boolean = false;

  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }
  estadosFactura: IEstados[] = [{ nombre: "Pagado", valor: true }, { nombre: "Sin pagar", valor: false }];
  //filtros 
  fechaDesde: string | null = null;
  fechaHasta: string | null = null;
  idServicio: number | null = null;
  estado: boolean | null = null;
  //Paginador
  cantidadTotal: number = 0;
  cantidadPorPagina: number = 5;
  numeroDePagina: number = 0;
  opcionesDePaginado: number[] = [1, 5, 10, 25, 100];

  dataSourceFactura: MatTableDataSource<IFactura> = new MatTableDataSource<IFactura>([]);
  displayedColumnsFactura: string[] = ['fecha', 'sName', 'sFechaIniVto', 'sFechaFinVto', 'sActivo', 'saldoRest', 'totPag'];
  selectedRow: any;
  dataSourceDFactura: MatTableDataSource<IDetalleFactura> = new MatTableDataSource<IDetalleFactura>([]);
  displayedColumnsDFactura: string[] = ['fechaPago', 'pago'];

  isLoading: boolean = false;

  spinnerShow(): void {
    this.isLoading = true
  }

  spinnerHide(): void {
    this.isLoading = false
  }
  constructor(private formBuilder: FormBuilder) {

    this.isUserLogin();
    this.initForm();
    this.loadServicios();
  }

  loadServicios(): void {
    this._servicioService.getAllServiciosAct(this.username!).subscribe((servicios: IServicio[]) => {
      this.listServicios = servicios;
    })
  }


  initForm(): void {
    this.consultaFacturaForm = this.formBuilder.group(
      {
        fechaDesde: [{ value: null, disabled: false }],
        fechaHasta: [{ value: null, disabled: false }],
        servicio: [{ value: null, disabled: false }],
        estado: [{ value: true, disabled: false }],

      }
    )
  }

  allFacturaInDataSourcePaginador(): void {
    this._facturaService.getConsultaFacturaWithPaginador(this.cantidadPorPagina,
      this.numeroDePagina,
      this.username!,
      this.fechaDesde,
      this.fechaHasta,
      this.idServicio,
      this.estado!
    )
      .subscribe((facturas: IFacturas) => {
        this.dataSourceFactura.data = facturas.elementos;
        this.cantidadTotal = facturas.cantidadTotal;
      });
  }

  allDFacturaInDataSourcePaginador(detalles: IDetalleFactura[]): void {
    this.dataSourceDFactura.data = detalles;
  }

  search() {
    this.spinnerShow();
    this.fechaDesde = this.getShortDate(this.consultaFacturaForm.get("fechaDesde")?.value);
    this.fechaHasta = this.getShortDate(this.consultaFacturaForm.get("fechaHasta")?.value);
    this.idServicio = this.consultaFacturaForm.get("servicio")?.value;
    this.estado = this.consultaFacturaForm.get("estado")?.value;

    this.allFacturaInDataSourcePaginador();
    this.spinnerHide();
  }

  cambiarPagina(event: PageEvent) {
    this.cantidadPorPagina = event.pageSize;
    this.numeroDePagina = event.pageIndex;
    this.allFacturaInDataSourcePaginador();
  }



  getShortDate(fecha: Date): string | null {
    if (fecha == null) {
      return null
    }
    let ahora = new Date(fecha);
    let fechaActual = ahora.getFullYear() + '-'
      + ('0' + (ahora.getMonth() + 1)).slice(-2) + '-'
      + ('0' + ahora.getDate()).slice(-2)
    return fechaActual;
  }

  onRowClicked(row: any) {
    this.selectedRow = row;
    this.allDFacturaInDataSourcePaginador(row.detallesFactura)
  }


  limpiar() {
    this.consultaFacturaForm.reset();
    this.consultaFacturaForm.patchValue({
      estado: true
    })
    this.limpiarDataSource();
  }

  limpiarDataSource(): void {
    this.dataSourceFactura.data = [];
    this.dataSourceDFactura.data = [];
    this.cantidadTotal = 0;
    this.cantidadPorPagina = 5;
    this.numeroDePagina = 0;
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
