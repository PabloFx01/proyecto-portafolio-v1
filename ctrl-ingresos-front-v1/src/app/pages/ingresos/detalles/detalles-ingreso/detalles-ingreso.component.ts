import { Component, ElementRef, HostListener, OnInit, Renderer2, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Observable, firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyPipe } from '@angular/common';
import { DetalleIngresoService } from '../../../../services/ingresos/DetalleIngreso.service';
import { IDetalleIngreso } from '../../../../models/ingresos/detalleIngreso.models';
import { DataService } from '../../../../shared/data.service';
import { DetalleIngresoFormComponent } from '../detalle-ingreso-form/detalle-ingreso-form.component';
import { IIngreso } from '../../../../models/ingresos/ingreso.models';
import { IngresoService } from '../../../../services/ingresos/ingreso.service';
import { DetalleIngresoAsigRestFormComponent } from '../detalle-ingreso-asig-rest-form/detalle-ingreso-asig-rest-form.component';
import { AsigTotalFormComponent } from '../asig-total-form/asig-total-form.component';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "../../nav/nav.component";
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-detalles-ingreso',
  standalone: true,
  imports: [
    CommonModule,
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
    CurrencyPipe,
    NavComponent,
    MatMenuModule
  ],
  templateUrl: './detalles-ingreso.component.html',
  styleUrl: './detalles-ingreso.component.css'
})
export class DetallesIngresoComponent implements OnInit {

  private _route = inject(ActivatedRoute);
  private _toastr = inject(ToastrService)
  private _dataService = inject(DataService);
  private _detallesIngresoService = inject(DetalleIngresoService);
  private _ingresoService = inject(IngresoService);
  public detallesIngresoData$!: Observable<IDetalleIngreso[]>;
  paramIdIngreso: number | null = null;
  ingresoData?: IIngreso;
  dataSource: MatTableDataSource<IDetalleIngreso> = new MatTableDataSource<IDetalleIngreso>([]);
  displayedColumns: string[] = ['concepto', 'porcentaje', 'montAsigEsp', 'montAsigRes', 'montAsigEfec', 'montAsigDig', 'acciones'];
  title: any;

  //responsive
  screenWidth: number | null = null;
  screenHeight: number | null = null;
  responsive: boolean = false;

  constructor(public dialog: MatDialog) { }

  async ngOnInit(): Promise<void> {
    this.getScreenSize();
    this.getParam();
    this.allDetallesIngresoInDataSource(this.paramIdIngreso);
    this.ingresoData = await this.getIngreso(this.paramIdIngreso!)
    this._dataService.dataUpdated$.subscribe(() => {
      this.reloadData();
    })
  }

  getParam(): void {
    this._route.params.subscribe(params => {
      this.paramIdIngreso = params['idIngreso'];
    })
  }
  allDetallesIngresoInDataSource(idIngreso: number | null): void {
    this.detallesIngresoData$ = this._detallesIngresoService.getAllDetallesByIdIngreso(idIngreso);

    this.detallesIngresoData$.subscribe((info: IDetalleIngreso[]) => {
      this.dataSource.data = info
    })
  }

  private reloadData() {
    this.allDetallesIngresoInDataSource(this.paramIdIngreso);
  }

  editar(idIngreso: number | null, idDetalle: number | null) {
    this.openForm("Actualizar", idIngreso, idDetalle);
  }

  asigRest(idIngreso: number | null, idDetalle: number | null) {
    this.openFormAsigRest("Actualizar", idIngreso, idDetalle);
  }


  asigTotRest(idIngreso: number | null) {
    this.openFormAsigTotRest(idIngreso)
  }


  openForm(accion: string, idIngreso: number | null, idDetalle: number | null) {
    const dialogRef = this.dialog.open(DetalleIngresoFormComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '500px',
        height: '555px',
        data: {
          tipoAccion: accion,
          idIngreso: idIngreso,
          idDetalle: idDetalle
        }
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.reloadData();
    });
  }

  openFormAsigRest(accion: string, idIngreso: number | null, idDetalle: number | null) {
    const dialogRef = this.dialog.open(DetalleIngresoAsigRestFormComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '500px',
        height: '500px',
        data: {
          idIngreso: idIngreso,
          idDetalle: idDetalle
        }
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.reloadData();
    });
  }

  openFormAsigTotRest(idIngreso: number | null) {
    const dialogRef = this.dialog.open(AsigTotalFormComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '500px',
        height: '400px',
        data: {
          idIngreso: idIngreso
        }
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.reloadData();
    });
  }

  async getIngreso(itemId: number): Promise<IIngreso> {
    try {
      const ingreso: IIngreso =
        await firstValueFrom(this._ingresoService.getIngreso(itemId));
      return ingreso;
    } catch (error) {
      console.error('Error al obtener el ingreso:', error);
      throw error;
    }
  }


  getShortDate(fecha: Date): string {
    let ahora = new Date(fecha);
    let fechaActual = ('0' + ahora.getDate()).slice(-2) + '-'
      + ('0' + (ahora.getMonth() + 1)).slice(-2) + '-'
      + ahora.getFullYear() + ' '
    return fechaActual;
  }

  getTotalRestante() {
    return this.dataSource.data.map(g => g.pctXCpto!.montoAsigRest).reduce((acc, value) => acc! + value!, 0);
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
