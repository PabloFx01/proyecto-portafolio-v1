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
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioGroup, MatRadioModule } from '@angular/material/radio';
import { IngresoService } from '../../../../services/ingresos/ingreso.service';
import { LoginService } from '../../../../services/login.service';
import { ILoginResponse } from '../../../../models/login.models';
import { IIngreso, IIngresos, IInfoIngreso } from '../../../../models/ingresos/ingreso.models';
import { IDetalleIngreso } from '../../../../models/ingresos/detalleIngreso.models';
import { NavComponent } from '../../nav/nav.component';
import { NgxEchartsDirective } from 'ngx-echarts';
import { firstValueFrom } from 'rxjs';
import type { ECElementEvent, EChartsOption } from 'echarts';
import type { ECActionEvent } from 'echarts/types/src/util/types';
import LinearGradient from 'zrender/lib/graphic/LinearGradient';
import { SpinnerComponent } from "../../../../shared/spinner/spinner.component";



@Component({
  selector: 'app-consulta-ingreso',
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
    MatRadioModule,
    MatRadioGroup,
    NavComponent,
    NgxEchartsDirective, SpinnerComponent],
  templateUrl: './consulta-ingreso.component.html',
  styleUrl: './consulta-ingreso.component.css'
})
export class ConsultaIngresoComponent implements OnInit {



  _ingresoService = inject(IngresoService);
  loginServices = inject(LoginService);

  consultaIngresoForm!: FormGroup;
  estadisticas: boolean = false;
  promedio: boolean = true;
  suma: boolean = false;
  cantidad: boolean = false;

  username: string | null = '';
  role: String | null = '';
  userLoginOn: boolean = false;

  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }
  listIngreso: IIngreso[] = [];
  //filtros 
  fechaDesde: string | null = null;
  fechaHasta: string | null = null;
  titulo: string | null = null;

  //Paginador
  cantidadTotal: number = 0;
  cantidadPorPagina: number = 5;
  numeroDePagina: number = 0;
  opcionesDePaginado: number[] = [1, 5, 10, 25, 100];

  //graficos
  dataXAxis: string[] = [];
  dataCounters: number[] = [];

  dataSourceIngreso: MatTableDataSource<IIngreso> = new MatTableDataSource<IIngreso>([]);
  displayedColumnsIngreso: string[] = ['titulo', 'monto', 'fechaDeposito', 'tipoMoneda'];
  selectedRow: any;
  dataSourceDIngreso: MatTableDataSource<IDetalleIngreso> = new MatTableDataSource<IDetalleIngreso>([]);
  displayedColumnsDIngreso: string[] = ['nConcepto', 'montoPct', 'montoReasig', 'montoEfect', 'montoDig'];


  ngOnInit(): void {
  }
  isLoading: boolean = false;
  
  spinnerShow(): void {
    this.isLoading = true
  }
  
    spinnerHide(): void {
    this.isLoading = false
  }
  onChartEvent(event: ECElementEvent | ECActionEvent, type: string) {
    // console.log('chart event:', type, event);
  }


  initOpts = {
    renderer: 'svg',
    width: 300,
    height: 300,
  };

  options: EChartsOption = {
    title: {
      // text: 'Promedio mensual de los ingresos consultados',
      text: 'Sin datos',
    },
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    dataZoom: [
      {
        type: 'inside',
      },
    ],
    series: [
      {
        name: 'Counters',
        type: 'bar',
        barWidth: '60%',
        data: [10, 52, 200, 334, 390, 330, 220],
      },
      {
        emphasis: {
          itemStyle: {
            color: new LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' },
            ]),
          },
        },
      }
    ],
  };


  constructor(private formBuilder: FormBuilder) {

    this.isUserLogin();
    this.initForm();
  }



  initForm(): void {
    this.consultaIngresoForm = this.formBuilder.group(
      {
        fechaDesde: [{ value: null, disabled: false }],
        fechaHasta: [{ value: null, disabled: false }],
        titulo: [{ value: null, disabled: false }]
      }
    )
  }

  allIngresoInDataSourcePaginador(): void {
    this._ingresoService.getConsultaIngresoWithPaginador(this.cantidadPorPagina,
      this.numeroDePagina,
      this.username!,
      this.fechaDesde,
      this.fechaHasta,
      this.titulo
    )
      .subscribe((ingreso: IIngresos) => {
        this.dataSourceIngreso.data = ingreso.elementos;
        this.cantidadTotal = ingreso.cantidadTotal;
      });
  }

  allDIngresoInDataSourcePaginador(detalles: IDetalleIngreso[]): void {
    this.dataSourceDIngreso.data = detalles;
  }


  async search() {
    this.spinnerShow();
    this.fechaDesde = this.getShortDate(this.consultaIngresoForm.get("fechaDesde")?.value);
    this.fechaHasta = this.getShortDate(this.consultaIngresoForm.get("fechaHasta")?.value);
    this.titulo = this.consultaIngresoForm.get("titulo")?.value;

    this.allIngresoInDataSourcePaginador();
    await this.actualizarGrafico();
    this.spinnerHide();

  }

  cambiarPagina(event: PageEvent) {
    this.cantidadPorPagina = event.pageSize;
    this.numeroDePagina = event.pageIndex;
    this.allIngresoInDataSourcePaginador();
  }

  async getAllIngresos(): Promise<IIngreso[]> {
    try {
      const ingresos: IIngreso[] =
        await firstValueFrom(this._ingresoService.getConsultaIngreso(this.cantidadPorPagina,
          this.numeroDePagina,
          this.username!,
          this.fechaDesde,
          this.fechaHasta,
          this.titulo
        ))
      return ingresos;
    } catch (error) {
      console.error('Error al buscar ingresos:', error);
      throw error;
    }
  }


  onRowClicked(row: any) {
    this.selectedRow = row;
    this.allDIngresoInDataSourcePaginador(row.detallesIngreso)
  }


  limpiar() {
    this.consultaIngresoForm.reset();
    this.limpiarDataSource();
    this.visibleInfo();
    this.visiblePromedio();
  }

  limpiarDataSource(): void {
    this.dataSourceIngreso.data = [];
    this.dataSourceDIngreso.data = [];
    this.cantidadTotal = 0;
    this.cantidadPorPagina = 5;
    this.numeroDePagina = 0;
  }

  visibleInfo() {
    this.estadisticas = false;
  }

  async visibleEstadisticas() {
    this.estadisticas = true;
  }

  async visiblePromedio() {
    this.promedio = true;
    this.suma = false;
    this.cantidad = false;
  }

  async visibleSuma() {
    this.promedio = false;
    this.suma = true;
    this.cantidad = false;
  }

  async visibleCantidad() {
    this.promedio = false;
    this.suma = false;
    this.cantidad = true;
  }

  cancel() {
    throw new Error('Method not implemented.');
  }

  updateChartData(info: IInfoIngreso[]) {
    this.dataXAxis = [];
    this.dataCounters = [];
    info.forEach(i => {
      this.dataXAxis.push(i.descripcion);
      this.dataCounters.push(i.valor)
    })
    let titulo: string = '';

    if (this.promedio) {
      titulo = 'Promedio mensual de los ingresos consultados';
    } else  if(this.suma){
      titulo = 'Suma mensual de los ingresos consultados';
    } else if(this.cantidad){
      titulo = 'Cantidad mensual de los ingresos consultados';
    }

    this.options = {
      ...this.options,
      title: {
        text: titulo

      },
      xAxis: [
        {
          type: 'category',
          data: this.dataXAxis,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      series: [
        {
          name: 'Ingreso',
          type: 'bar',
          barWidth: '60%',
          data: this.dataCounters
        },
      ],
    };

  }


  async actualizarGraficoSuma() {
    this.visibleSuma()
    await this.actualizarGrafico()
  }
  async actualizarGraficoPromedio() {
    this.visiblePromedio()
    await this.actualizarGrafico()
  }

  async actualizarGraficoCantidad() {
    this.visibleCantidad()
    await this.actualizarGrafico()
  }

  async actualizarGrafico() {
    this.listIngreso = await this.getAllIngresos();
    if (this.listIngreso.length > 0) {
      let max = this.listIngreso.length - 1;
      
      let fecha1 = new Date(this.listIngreso[0].fechaDeposito!);
      let fecha2 = new Date(this.listIngreso[max].fechaDeposito!);
      let info: IInfoIngreso[] = [];
      if (this.promedio) {
        info = this.obtenerPromedio(fecha1, fecha2);
      } else  if(this.suma){
        info = this.obtenerSuma(fecha1, fecha2);
      } else if(this.cantidad){
        info = this.obtenerCantidad(fecha1, fecha2);
      }
      this.updateChartData(info);

    }
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

  getDayDate(fecha: Date): string {
    let ahora = new Date(fecha);
    let fechaActual = ('0' + ahora.getDate()).slice(-2) + ''
    return fechaActual;
  }

  getMonthDate(fecha: Date): string {
    let ahora = new Date(fecha);
    let fechaActual = ('0' + (ahora.getMonth() + 1)).slice(-2) + ''
    return fechaActual;
  }

  getYearDate(fecha: Date): string {
    let ahora = new Date(fecha);
    let fechaActual = ahora.getFullYear() + ''
    return fechaActual;
  }


  obtenerPromedio(fechaDesde: Date, fechaHasta: Date): IInfoIngreso[] {

    const resultado: { mes: number, ano: number }[] = [];
    const resultadoFinal: IInfoIngreso[] = [];


    // Ajustar fechaDesde al primer día del mes
    let fechaActual = new Date(fechaDesde);
    fechaActual.setDate(1);

    // Ajustar fechaHasta al último día del mes
    const fechaFin = new Date(this.getShortDate(fechaHasta)!);
    fechaFin.setMonth(fechaFin.getMonth() + 1);
    fechaFin.setDate(0);

    while (fechaActual <= fechaFin) {
      resultado.push({ mes: fechaActual.getMonth() + 1, ano: fechaActual.getFullYear() });
      fechaActual.setMonth(fechaActual.getMonth() + 1);
      fechaActual.setDate(1); // Asegurarse de que siempre sea el primer día del mes
    }


    resultado.forEach(r => {
      let suma = 0;
      let x = 0;

      this.listIngreso.forEach(ingreso => {

        let nfechaDeposito = ingreso.fechaDeposito!;
        let month: number = Number(this.getMonthDate(nfechaDeposito));
        let year: number = Number(this.getYearDate(nfechaDeposito));



        if (r.mes == month && r.ano == year) {
          suma = suma + ingreso.montoIngreso;
          x = x + 1;
        }
      });
      resultadoFinal.push({ valor: Number((suma / x).toFixed(2)), descripcion: r.mes + '/' + r.ano })
    })


    return resultadoFinal;
  }

  obtenerSuma(fechaDesde: Date, fechaHasta: Date): IInfoIngreso[] {

    const resultado: { mes: number, ano: number }[] = [];
    const resultadoFinal: IInfoIngreso[] = [];


    // Ajustar fechaDesde al primer día del mes
    let fechaActual = new Date(fechaDesde);
    fechaActual.setDate(1);

    // Ajustar fechaHasta al último día del mes
    const fechaFin = new Date(this.getShortDate(fechaHasta)!);
    fechaFin.setMonth(fechaFin.getMonth() + 1);
    fechaFin.setDate(0);

    while (fechaActual <= fechaFin) {
      resultado.push({ mes: fechaActual.getMonth() + 1, ano: fechaActual.getFullYear() });
      fechaActual.setMonth(fechaActual.getMonth() + 1);
      fechaActual.setDate(1); // Asegurarse de que siempre sea el primer día del mes
    }

    resultado.forEach(r => {
      let suma = 0;
      this.listIngreso.forEach(ingreso => {

        let nfechaDeposito = ingreso.fechaDeposito!;
        let month: number = Number(this.getMonthDate(nfechaDeposito));
        let year: number = Number(this.getYearDate(nfechaDeposito));



        if (r.mes == month && r.ano == year) {
          suma = suma + ingreso.montoIngreso;
        }
      });

      resultadoFinal.push({ valor: Number((suma).toFixed(2)), descripcion: r.mes + '/' + r.ano })
    })
    return resultadoFinal;
  }

  obtenerCantidad(fechaDesde: Date, fechaHasta: Date): IInfoIngreso[] {

    const resultado: { mes: number, ano: number }[] = [];
    const resultadoFinal: IInfoIngreso[] = [];


    // Ajustar fechaDesde al primer día del mes
    let fechaActual = new Date(fechaDesde);
    fechaActual.setDate(1);

    // Ajustar fechaHasta al último día del mes
    const fechaFin = new Date(this.getShortDate(fechaHasta)!);
    fechaFin.setMonth(fechaFin.getMonth() + 1);
    fechaFin.setDate(0);

    while (fechaActual <= fechaFin) {
      resultado.push({ mes: fechaActual.getMonth() + 1, ano: fechaActual.getFullYear() });
      fechaActual.setMonth(fechaActual.getMonth() + 1);
      fechaActual.setDate(1); // Asegurarse de que siempre sea el primer día del mes
    }


    resultado.forEach(r => {
      let x = 0;

      this.listIngreso.forEach(ingreso => {

        let nfechaDeposito = ingreso.fechaDeposito!;
        let month: number = Number(this.getMonthDate(nfechaDeposito));
        let year: number = Number(this.getYearDate(nfechaDeposito));



        if (r.mes == month && r.ano == year) {
          x = x + 1;
        }
      });
      resultadoFinal.push({ valor: x, descripcion: r.mes + '/' + r.ano })
    })


    return resultadoFinal;
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
