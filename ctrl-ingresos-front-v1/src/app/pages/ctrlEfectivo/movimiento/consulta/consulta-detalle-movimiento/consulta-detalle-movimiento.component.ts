import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subscription, firstValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../../../../../services/login.service';
import { ILoginResponse } from '../../../../../models/login.models';
import { SobreService } from '../../../../../services/ctrlEfectivo/sobre.service';
import { MovimientoService } from '../../../../../services/ctrlEfectivo/movimiento.service';
import { CuentaService } from '../../../../../services/ctrlEfectivo/cuenta.service';
import { IInfoMovimiento, IMovimiento, IMovimientoConsulta, IMovimientos, ITipoMovimiento } from '../../../../../models/ctrlEfectivo/movimiento.models';
import { ICuenta } from '../../../../../models/ctrlEfectivo/cuenta.models';
import { ISobre } from '../../../../../models/ctrlEfectivo/sobre.models';

import * as XLSX from 'xlsx';
import { NavCtrlEfectivoComponent } from "../../../nav/nav-ctrl-efectivo.component";
import { NgxEchartsDirective } from 'ngx-echarts';
import type { ECElementEvent, EChartsOption } from 'echarts';
import type { ECActionEvent } from 'echarts/types/src/util/types';
import LinearGradient from 'zrender/lib/graphic/LinearGradient';

@Component({
  selector: 'app-consulta-detalle-movimiento',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatIconModule,
    NavCtrlEfectivoComponent,
    RouterOutlet,
    NgxEchartsDirective
  ],
  templateUrl: './consulta-detalle-movimiento.component.html',
  styleUrl: './consulta-detalle-movimiento.component.css'
})
export class ConsultaDetalleMovimientoComponent {

  irADetalleMovimiento(arg0: any) {
    throw new Error('Method not implemented.');
  }


  title: string = 'Consulta de movimientos';
  consultaMovimientoForm!: FormGroup;
  fechaMovimientoForm!: FormGroup;

  _sobreService = inject(SobreService);
  _movimientoService = inject(MovimientoService);
  _cuentaService = inject(CuentaService);
  totalSaldo: number = 0;
  listCuentasActivas: ICuenta[] = [];
  listMov: IMovimiento[] = [];
  listMovConsulta: IMovimientoConsulta[] = [];

  //sobres
  listSobre: ISobre[] = [];

  //Tipo de movimiento
  listTipoMov: ITipoMovimiento[] = [
    { id: 'Agregar fondo', descripcion: 'Agregar fondo' },
    { id: 'Retirar fondo', descripcion: 'Retirar fondo' },
    { id: 'Transferir fondo', descripcion: 'Transferir fondo' }
  ];
  //filtros

  tipoMovFilter: string | null = null;
  sobreFilter: number | null = null;
  startMovFilter: string | null = null;
  endMovFilter: string | null = null;

  //Paginador
  cantidadTotal: number = 0;
  cantidadPorPagina: number = 5;
  numeroDePagina: number = 0;
  opcionesDePaginado: number[] = [1, 5, 10, 25, 100];

  //graficos
  dataXAxis: string[] = [];
  dataCounters: number[] = [];
  agregar: boolean = true;
  retirar: boolean = false;
  tranferencia: boolean = false;

  dataSourceMovimiento: MatTableDataSource<IMovimiento> = new MatTableDataSource<IMovimiento>([]);
  displayedColumnsMovimiento: string[] = ['fecha', 'tipoMovimiento', 'monto', 'sobre'];
  listMovimiento : IMovimiento[] = [];
  idMovimiento!: number;

  loginServices = inject(LoginService);

  username: string | null = '';
  role: String | null = '';
  userLoginOn: boolean = false;

  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }

  estadisticas: boolean = false;

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {
    this.initForms();
    this.isUserLogin();

  }

  ngOnInit(): void {
    this.getSobreList();
  }

  onChartEvent(event: ECElementEvent | ECActionEvent, type: string) {
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



  getSobreList(): void {
    this._sobreService.getSobres(this.username!).subscribe((sobres: ISobre[]) => {
      this.listSobre = sobres;
    })
  }

  async getMovimientoConsulta(): Promise<IMovimiento[]> {
    try {
      const listMov = await firstValueFrom(this._movimientoService.getConsultaMovByUsername(
        this.startMovFilter,
        this.endMovFilter,
        this.sobreFilter,
        this.tipoMovFilter,
        this.username!
      ));
      return listMov;
    } catch (error) {
      console.error('Error al obtener consulta:', error);
      throw error;
    }
  }



  async exportToExcel() {
    //Cargo la información a exportar
    this.listMov = await this.getMovimientoConsulta();
    if (this.listMov.length > 0) {
      this.listMovConsulta = [];
      this.listMov.forEach(mov => {
        let movConsulta: IMovimientoConsulta = {
          fecha: mov.fecha,
          tipo_movimiento: mov.tipoMovimiento,
          monto: mov.monto,
          sobre_descripcion: mov.cuenta.sobre!.descripcion!,
          sobre_descripcion_destino: mov.transaccion != null ? mov.transaccion.cuentaDestino.sobre!.descripcion : '-',
          comentario: mov.comentario != null ? mov.comentario : 'Sin comentario'
        }
        this.listMovConsulta.push(movConsulta);
      })


      // Crear una hoja de trabajo con los datos JSON
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.listMovConsulta);

      // Crear un nuevo libro de trabajo y añadir la hoja de trabajo
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Movimiento');

      // Escribir el libro de trabajo en un archivo y descargarlo
      XLSX.writeFile(wb, 'DatosMovimiento.xlsx');

    }
  }

  initForms(): void {
    this.consultaMovimientoForm = this.formBuilder.group(
      {
        tipoMovimiento: [{ value: null, disabled: false }],
        sobre: [{ value: null, disabled: false }]
      }
    )

    this.fechaMovimientoForm = this.formBuilder.group(
      {
        startMov: [{ value: null, disabled: false }],
        endMov: [{ value: null, disabled: false }]
      }
    )


  }

  cambiarPagina(event: PageEvent) {
    this.cantidadPorPagina = event.pageSize;
    this.numeroDePagina = event.pageIndex;
    this.allMovInDataSourcePaginador();
  }

  allMovInDataSourcePaginador(): void {
    this._movimientoService.getConsultaMovWithPaginadorByUsername(this.cantidadPorPagina,
      this.numeroDePagina,
      this.startMovFilter,
      this.endMovFilter,
      this.sobreFilter,
      this.tipoMovFilter,
      this.username!
    )
      .subscribe((mov: IMovimientos) => {
        this.dataSourceMovimiento.data = mov.elementos;
        this.cantidadTotal = mov.cantidadTotal;
      });
  }

  async search() {
    this.startMovFilter = this.getShortDate(this.fechaMovimientoForm.get("startMov")?.value)
    this.endMovFilter = this.getShortDate(this.fechaMovimientoForm.get("endMov")?.value);
    this.sobreFilter = this.consultaMovimientoForm.get("sobre")?.value;
    this.tipoMovFilter = this.consultaMovimientoForm.get("tipoMovimiento")?.value;

    this.allMovInDataSourcePaginador();
    await this.actualizarGrafico();

  }

  visibleInfo() {
    this.estadisticas = false;
  }

  async visibleEstadisticas() {
    this.estadisticas = true;
  }

  updateChartData(info: IInfoMovimiento[]) {
    this.dataXAxis = [];
    this.dataCounters = [];
    info.forEach(i => {
      this.dataXAxis.push(i.descripcion);
      this.dataCounters.push(i.valor)
    })
    let titulo: string = '';
    let accion: string = ''

    if (this.agregar) {
      titulo = 'Ingresos consultados';
      accion = 'Ingreso';
    } else if (this.retirar) {
      titulo = 'Gastos consultados';
      accion = 'Retiro';
    } else if (this.tranferencia) {
      titulo = 'Tranferencias consultados';
      accion = 'Tranferencia';
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
          name: accion,
          type: 'bar',
          barWidth: '60%',
          data: this.dataCounters
        },
      ],
    };

  }


  async actualizarGraficoIngreso() {
    this.visibleIngreso()
    await this.actualizarGrafico()
  }
  async actualizarGraficoRetiro() {
    this.visibleRetiro()
    await this.actualizarGrafico()
  }

  async actualizarGraficoTranferencia() {
    this.visibleTranferencia()
    await this.actualizarGrafico()
  }

  async actualizarGrafico() {
    let tipoDMovimiento : string = '';
    if (this.agregar) {
      tipoDMovimiento = this.listTipoMov[0].id;
    } else  if(this.retirar){
      tipoDMovimiento = this.listTipoMov[1].id;;
    } else if(this.tranferencia){
      tipoDMovimiento = this.listTipoMov[2].id;;
    }

    this.listMovimiento = await this.getAllMovimientosByTipoMov(tipoDMovimiento);
    
    if (this.listMovimiento.length > 0) {
      let max = this.listMovimiento.length - 1;

      let fecha1 = new Date(this.listMovimiento[0].fecha!);
      let fecha2 = new Date(this.listMovimiento[max].fecha!);
      let info: IInfoMovimiento[] = [];      
      info = this.obtenerData(fecha1, fecha2);
      this.updateChartData(info);

    }
  }

  async getAllMovimientosByTipoMov(tipoMov:string): Promise<IMovimiento[]> {
    try {
      const movimientos: IMovimiento[] =
      await firstValueFrom(this._movimientoService.getAllConsultaMovByUsername(
        this.startMovFilter,
        this.endMovFilter,
        null,
        tipoMov,
        this.username!
      ));
      return movimientos;
    } catch (error) {
      console.error('Error al buscar movimientos:', error);
      throw error;
    }
  }



  limpiar() {
    this.consultaMovimientoForm.reset();
    this.fechaMovimientoForm.reset();
    this.limpiarDataSource();
    this.visibleInfo();

  }

  limpiarDataSource(): void {
    this.dataSourceMovimiento.data = [];
    this.cantidadTotal = 0;
    this.cantidadPorPagina = 5;
    this.numeroDePagina = 0;
  }

  async visibleIngreso() {
    this.agregar = true;
    this.retirar = false;
    this.tranferencia = false;
  }

  async visibleRetiro() {
    this.agregar = false;
    this.retirar = true;
    this.tranferencia = false;
  }

  async visibleTranferencia() {
    this.agregar = false;
    this.retirar = false;
    this.tranferencia = true;
  }

  // obtenerPromedio(fechaDesde: Date, fechaHasta: Date): IInfoIngreso[] {

  //   const resultado: { mes: number, ano: number }[] = [];
  //   const resultadoFinal: IInfoIngreso[] = [];


  //   // Ajustar fechaDesde al primer día del mes
  //   let fechaActual = new Date(fechaDesde);
  //   fechaActual.setDate(1);

  //   // Ajustar fechaHasta al último día del mes
  //   const fechaFin = new Date(this.getShortDate(fechaHasta)!);
  //   fechaFin.setMonth(fechaFin.getMonth() + 1);
  //   fechaFin.setDate(0);

  //   while (fechaActual <= fechaFin) {
  //     resultado.push({ mes: fechaActual.getMonth() + 1, ano: fechaActual.getFullYear() });
  //     fechaActual.setMonth(fechaActual.getMonth() + 1);
  //     fechaActual.setDate(1); // Asegurarse de que siempre sea el primer día del mes
  //   }


  //   resultado.forEach(r => {
  //     let suma = 0;
  //     let x = 0;

  //     this.listIngreso.forEach(ingreso => {

  //       let nfechaDeposito = ingreso.fechaDeposito!;
  //       let month: number = Number(this.getMonthDate(nfechaDeposito));
  //       let year: number = Number(this.getYearDate(nfechaDeposito));



  //       if (r.mes == month && r.ano == year) {
  //         suma = suma + ingreso.montoIngreso;
  //         x = x + 1;
  //       }
  //     });
  //     resultadoFinal.push({ valor: Number((suma / x).toFixed(2)), descripcion: r.mes + '/' + r.ano })
  //   })


  //   return resultadoFinal;
  // }

  obtenerData(fechaDesde: Date, fechaHasta: Date): IInfoMovimiento[] {

    const resultado: { mes: number, ano: number }[] = [];
    const resultadoFinal: IInfoMovimiento[] = [];


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

    if(this.retirar){

    }

    resultado.forEach(r => {
      let suma = 0;
      this.listMovimiento.forEach(mov => {

        let nfechaMov = mov.fecha!;
        let month: number = Number(this.getMonthDate(nfechaMov));
        let year: number = Number(this.getYearDate(nfechaMov));

        if (r.mes == month && r.ano == year) {
          suma = suma + mov.monto;
        }
      });

      resultadoFinal.push({ valor: Number((suma).toFixed(2)), descripcion: r.mes + '/' + r.ano })
    })
    return resultadoFinal;
  }

  // obtenerIngreso(fechaDesde: Date, fechaHasta: Date): IInfoMovimiento[] {

  //   const resultado: { mes: number, ano: number }[] = [];
  //   const resultadoFinal: IInfoIngreso[] = [];


  //   // Ajustar fechaDesde al primer día del mes
  //   let fechaActual = new Date(fechaDesde);
  //   fechaActual.setDate(1);

  //   // Ajustar fechaHasta al último día del mes
  //   const fechaFin = new Date(this.getShortDate(fechaHasta)!);
  //   fechaFin.setMonth(fechaFin.getMonth() + 1);
  //   fechaFin.setDate(0);

  //   while (fechaActual <= fechaFin) {
  //     resultado.push({ mes: fechaActual.getMonth() + 1, ano: fechaActual.getFullYear() });
  //     fechaActual.setMonth(fechaActual.getMonth() + 1);
  //     fechaActual.setDate(1); // Asegurarse de que siempre sea el primer día del mes
  //   }

  //   resultado.forEach(r => {
  //     let suma = 0;
  //     this.listIngreso.forEach(ingreso => {

  //       let nfechaDeposito = ingreso.fechaDeposito!;
  //       let month: number = Number(this.getMonthDate(nfechaDeposito));
  //       let year: number = Number(this.getYearDate(nfechaDeposito));



  //       if (r.mes == month && r.ano == year) {
  //         suma = suma + ingreso.montoIngreso;
  //       }
  //     });

  //     resultadoFinal.push({ valor: Number((suma).toFixed(2)), descripcion: r.mes + '/' + r.ano })
  //   })
  //   return resultadoFinal;
  // }

  // obtenerRetiro(fechaDesde: Date, fechaHasta: Date): IInfoIngreso[] {

  //   const resultado: { mes: number, ano: number }[] = [];
  //   const resultadoFinal: IInfoIngreso[] = [];


  //   // Ajustar fechaDesde al primer día del mes
  //   let fechaActual = new Date(fechaDesde);
  //   fechaActual.setDate(1);

  //   // Ajustar fechaHasta al último día del mes
  //   const fechaFin = new Date(this.getShortDate(fechaHasta)!);
  //   fechaFin.setMonth(fechaFin.getMonth() + 1);
  //   fechaFin.setDate(0);

  //   while (fechaActual <= fechaFin) {
  //     resultado.push({ mes: fechaActual.getMonth() + 1, ano: fechaActual.getFullYear() });
  //     fechaActual.setMonth(fechaActual.getMonth() + 1);
  //     fechaActual.setDate(1); // Asegurarse de que siempre sea el primer día del mes
  //   }

  //   resultado.forEach(r => {
  //     let suma = 0;
  //     this.listIngreso.forEach(ingreso => {

  //       let nfechaDeposito = ingreso.fechaDeposito!;
  //       let month: number = Number(this.getMonthDate(nfechaDeposito));
  //       let year: number = Number(this.getYearDate(nfechaDeposito));



  //       if (r.mes == month && r.ano == year) {
  //         suma = suma + ingreso.montoIngreso;
  //       }
  //     });

  //     resultadoFinal.push({ valor: Number((suma).toFixed(2)), descripcion: r.mes + '/' + r.ano })
  //   })
  //   return resultadoFinal;
  // }

  // obtenerTranferencia(fechaDesde: Date, fechaHasta: Date): IInfoIngreso[] {

  //   const resultado: { mes: number, ano: number }[] = [];
  //   const resultadoFinal: IInfoIngreso[] = [];


  //   // Ajustar fechaDesde al primer día del mes
  //   let fechaActual = new Date(fechaDesde);
  //   fechaActual.setDate(1);

  //   // Ajustar fechaHasta al último día del mes
  //   const fechaFin = new Date(this.getShortDate(fechaHasta)!);
  //   fechaFin.setMonth(fechaFin.getMonth() + 1);
  //   fechaFin.setDate(0);

  //   while (fechaActual <= fechaFin) {
  //     resultado.push({ mes: fechaActual.getMonth() + 1, ano: fechaActual.getFullYear() });
  //     fechaActual.setMonth(fechaActual.getMonth() + 1);
  //     fechaActual.setDate(1); // Asegurarse de que siempre sea el primer día del mes
  //   }

  //   resultado.forEach(r => {
  //     let suma = 0;
  //     this.listIngreso.forEach(ingreso => {

  //       let nfechaDeposito = ingreso.fechaDeposito!;
  //       let month: number = Number(this.getMonthDate(nfechaDeposito));
  //       let year: number = Number(this.getYearDate(nfechaDeposito));



  //       if (r.mes == month && r.ano == year) {
  //         suma = suma + ingreso.montoIngreso;
  //       }
  //     });

  //     resultadoFinal.push({ valor: Number((suma).toFixed(2)), descripcion: r.mes + '/' + r.ano })
  //   })
  //   return resultadoFinal;
  // }

  // obtenerCantidad(fechaDesde: Date, fechaHasta: Date): IInfoIngreso[] {

  //   const resultado: { mes: number, ano: number }[] = [];
  //   const resultadoFinal: IInfoIngreso[] = [];


  //   // Ajustar fechaDesde al primer día del mes
  //   let fechaActual = new Date(fechaDesde);
  //   fechaActual.setDate(1);

  //   // Ajustar fechaHasta al último día del mes
  //   const fechaFin = new Date(this.getShortDate(fechaHasta)!);
  //   fechaFin.setMonth(fechaFin.getMonth() + 1);
  //   fechaFin.setDate(0);

  //   while (fechaActual <= fechaFin) {
  //     resultado.push({ mes: fechaActual.getMonth() + 1, ano: fechaActual.getFullYear() });
  //     fechaActual.setMonth(fechaActual.getMonth() + 1);
  //     fechaActual.setDate(1); // Asegurarse de que siempre sea el primer día del mes
  //   }


  //   resultado.forEach(r => {
  //     let x = 0;

  //     this.listIngreso.forEach(ingreso => {

  //       let nfechaDeposito = ingreso.fechaDeposito!;
  //       let month: number = Number(this.getMonthDate(nfechaDeposito));
  //       let year: number = Number(this.getYearDate(nfechaDeposito));



  //       if (r.mes == month && r.ano == year) {
  //         x = x + 1;
  //       }
  //     });
  //     resultadoFinal.push({ valor: x, descripcion: r.mes + '/' + r.ano })
  //   })


  //   return resultadoFinal;
  // }


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
