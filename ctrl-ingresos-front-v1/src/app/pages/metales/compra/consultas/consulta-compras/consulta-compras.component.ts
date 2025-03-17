import { CommonModule } from '@angular/common';
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
import { Router, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DetalleConsultaCompraComponent } from './detalle-consulta-compra/detalle-consulta-compra.component';
import { ICompra, DetalleCompraId, IDetalleCompra, ICompras } from '../../../../../models/metales/compra.models';
import { MetalId, IMetalCompra } from '../../../../../models/metales/metal-compra.models';
import { CompraService } from '../../../../../services/metales/compra.service';
import { DetallesCompraService } from '../../../../../services/metales/detalles-compra.service';
import { MetalCompraApiService } from '../../../../../services/metales/metal-compra-api-service';
import { DataService } from '../../../../../shared/data.service';
import { MetalesNavComponent } from "../../../metales-nav/metales-nav.component";
import { ILoginResponse } from '../../../../../models/login.models';
import { LoginService } from '../../../../../services/login.service';
import type { ECElementEvent, EChartsOption } from 'echarts';
import type { ECActionEvent } from 'echarts/types/src/util/types';
import LinearGradient from 'zrender/lib/graphic/LinearGradient';
import { NgxEchartsDirective } from 'ngx-echarts';
import { IInfoIngreso } from '../../../../../models/ingresos/ingreso.models';

@Component({
  selector: 'app-consulta-compras',
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
    MetalesNavComponent,
    RouterOutlet,
    NgxEchartsDirective
  ],
  templateUrl: './consulta-compras.component.html',
  styleUrl: './consulta-compras.component.css'
})
export class ConsultaComprasComponent {

  title: string = 'Consulta de compras';
  consultaCompraForm!: FormGroup;
  fechaCompraForm!: FormGroup;
  fechaVentaForm!: FormGroup;
  // inicializacion de datos:
  metalIdData: MetalId = {
    id: ''
  };
  metalData: IMetalCompra = {
    metalId: null,
    nombre: '',
    precio: 0,
    fechaIni: new Date(),
    fechaFin: null,
    editadoPor: 'admin',
    modificadoEl: null,
    usuario: null
  }

  compraData!: ICompra;
  detalleCompraIdData: DetalleCompraId = {
    id: 0,
    idCompra: 0
  };
  detalleCompraData: IDetalleCompra = {
    detalleId: null,
    importe: 0,
    metal: this.metalData,
    peso: 0,
    precioCompra: 0,
    compra: null
  };
  nextIdDetalle!: DetalleCompraId;
  estadisticas: boolean = false;
  promedio: boolean = true;
  suma: boolean = false;
  cantidad: boolean = false;


  //Paginador
  cantidadTotal: number = 0;
  cantidadPorPagina: number = 5;
  numeroDePagina: number = 0;
  opcionesDePaginado: number[] = [1, 5, 10, 25, 100];
  //Filtros
  startBuy: string | null = null;
  endBuy: string | null = null;
  startSale: string | null = null;
  endSale: string | null = null;
  descriptionSale: string | null = null;
  //usuario
  loginServices = inject(LoginService);
  username: string | null = '';
  role: String | null = '';
  userLoginOn: boolean = false;

  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }
  //graficos
  dataXAxis: string[] = [];
  dataCounters: number[] = [];

  dataSource: MatTableDataSource<ICompra> = new MatTableDataSource<ICompra>([]);
  displayedColumns: string[] = ['id', 'fechaCompra', 'totalComprado', 'cierre', 'ficticio', 'comentario'];
  selectedRow: any;

  dataSourceDetalle: MatTableDataSource<IDetalleCompra> = new MatTableDataSource<IDetalleCompra>([]);
  displayedColumnsDetalle: string[] = ['id', 'metal.nombre', 'precio', 'peso', 'importe'];


  listMetal: IMetalCompra[] = [];
  private _ApiMetalService = inject(MetalCompraApiService);
  private _ApiCompraService = inject(CompraService);
  private _ApiDetalleCompraService = inject(DetallesCompraService);
  _DataService = inject(DataService);
  private _router = inject(Router)
  saleFilterDisable: boolean = false;
  buyFilterDisable: boolean = false;
  descriptionFilterDisable: boolean = false;
  idCompraParam!: number;
  listCompra : ICompra[] = [];
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
  onChartEvent(event: ECElementEvent | ECActionEvent, type: string) {
    // console.log('chart event:', type, event);
  }

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {
    this.isUserLogin();
    this.initForms();
  }


  ngOnInit(): void {
    this.disableControls();
  }

  initForms(): void {
    this.consultaCompraForm = this.formBuilder.group(
      {
        descripcion: [{ value: null, disabled: false }]
      }
    )

    this.fechaCompraForm = this.formBuilder.group(
      {
        startCompra: [{ value: null, disabled: false }],
        endCompra: [{ value: null, disabled: false }]
      }
    )

    this.fechaVentaForm = this.formBuilder.group(
      {
        startVenta: [{ value: null, disabled: false }],
        endVenta: [{ value: null, disabled: false }]
      }
    )
  }

  disableControls(): void {
    this.fechaCompraForm.get('startCompra')?.valueChanges.subscribe((nStartCompra) => {
      if (nStartCompra != null) {
        this.fechaVentaForm.patchValue({
          startVenta: null,
          endVenta: null
        })
        this.consultaCompraForm.patchValue({
          descripcion: null
        })
      }
    })

    this.fechaVentaForm.get('startVenta')?.valueChanges.subscribe((nStartVenta) => {
      if (nStartVenta != null) {
        this.fechaCompraForm.patchValue({
          startCompra: null,
          endCompra: null
        })
        this.consultaCompraForm.patchValue({
          descripcion: null
        })
      }
    })

    this.consultaCompraForm.get('descripcion')?.valueChanges.subscribe((nDescripcion) => {
      if (nDescripcion != null) {
        this.fechaVentaForm.patchValue({
          startVenta: null,
          endVenta: null
        })
        this.fechaCompraForm.patchValue({
          startCompra: null,
          endCompra: null
        })
      }

    })

  }

  cambiarPagina(event: PageEvent) {
    this.cantidadPorPagina = event.pageSize;
    this.numeroDePagina = event.pageIndex;
    this.allCompraInDataSourcePaginador();
  }

  allCompraInDataSourcePaginador(): void {
    this._ApiCompraService.getComprasWithPaginador(this.cantidadPorPagina,
      this.numeroDePagina,
      this.startBuy,
      this.endBuy,
      this.startSale,
      this.endSale,
      this.descriptionSale,
      this.username!
    )
      .subscribe((compras: ICompras) => {
        this.dataSource.data = compras.elementos;
        this.cantidadTotal = compras.cantidadTotal;
      });
  }

  async search() {


    this.startBuy = this.getShortDate(this.fechaCompraForm.get("startCompra")?.value)
    this.endBuy = this.getShortDate(this.fechaCompraForm.get("endCompra")?.value);
    this.startSale = this.getShortDate(this.fechaVentaForm.get("startVenta")?.value);
    this.endSale = this.getShortDate(this.fechaVentaForm.get("endVenta")?.value);
    this.descriptionSale = this.consultaCompraForm.get("descripcion")?.value;

    this.allCompraInDataSourcePaginador();
    await this.actualizarGrafico();
  }

  irADetalles(itemId: number) {
    this.openForm('Detalle de la compra', itemId, 'onlyRead')
  }

  openForm(titulo: String, itemId: number | null, accion: string) {
    const dialogRef = this.dialog.open(DetalleConsultaCompraComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '1000px',
        height: '1000px',
        data: {

          titulo: titulo,
          itemId: itemId,
          accion: accion
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  limpiar() {
    this.consultaCompraForm.reset();
    this.fechaCompraForm.reset();
    this.fechaVentaForm.reset();
    this.limpiarDataSource();
    this.visibleInfo();
    this.visiblePromedio();
  }

  limpiarDataSource(): void {
    this.dataSource.data = [];
    this.dataSourceDetalle.data = [];
    this.cantidadTotal = 0;
    this.cantidadPorPagina = 5;
    this.numeroDePagina = 0;

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

  async getAllCompras(): Promise<ICompra[]> {
    try {
      const compras: ICompra[] =
        await firstValueFrom(this._ApiCompraService.getConsultaCompras(this.cantidadPorPagina,
          this.numeroDePagina,
          this.startBuy,
          this.endBuy,
          this.startSale,
          this.endSale,
          this.descriptionSale,
          this.username!))
      return compras;
    } catch (error) {
      console.error('Error al buscar compras:', error);
      throw error;
    }
  }

  onRowClicked(row: any) {
    this.selectedRow = row;
    this.allDCompraInDataSourcePaginador(row.detalleCompra)
  }

  allDCompraInDataSourcePaginador(detalle: IDetalleCompra[] | null): void {
    this.dataSourceDetalle.data = detalle!
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
      titulo = 'Promedio de compra diaria por mes';
    } else  if(this.suma){
      titulo = 'Suma mensual de las compras consultadas';
    } 
    // else if(this.cantidad){
    //   titulo = 'Cantidad mensual de los ingresos consultados';
    // }

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
          name: 'Compra',
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
    this.listCompra = await this.getAllCompras();
    if (this.listCompra.length > 0) {
      let max = this.listCompra.length - 1;
      let fecha1 = new Date(this.listCompra[0].fechaCompra!);
      let fecha2 = new Date(this.listCompra[max].fechaCompra!);
      let info: IInfoIngreso[] = [];
      if (this.promedio) {
        info = this.obtenerPromedio(fecha1, fecha2);
      } else  if(this.suma){
        info = this.obtenerSuma(fecha1, fecha2);
      }
      //  else if(this.cantidad){
      //   info = this.obtenerCantidad(fecha1, fecha2);
      // }
      this.updateChartData(info);

    }
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

      this.listCompra.forEach(compra => {

        let nfechaCompra = compra.fechaCompra!;
        let month: number = Number(this.getMonthDate(nfechaCompra));
        let year: number = Number(this.getYearDate(nfechaCompra));



        if (r.mes == month && r.ano == year) {
          suma = suma + compra.totalComprado;
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
      this.listCompra.forEach(compra => {

        let nfechaCompra = compra.fechaCompra!;
        let month: number = Number(this.getMonthDate(nfechaCompra));
        let year: number = Number(this.getYearDate(nfechaCompra));



        if (r.mes == month && r.ano == year) {
          suma = suma + compra.totalComprado;
        }
      });

      resultadoFinal.push({ valor: Number((suma).toFixed(2)), descripcion: r.mes + '/' + r.ano })
    })
    return resultadoFinal;
  }

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

  //     this.listCompra.forEach(ingreso => {

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
