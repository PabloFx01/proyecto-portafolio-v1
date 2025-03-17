import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogRef,MatDialogModule } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { DetallesCompraService } from '../../../../../../services/metales/detalles-compra.service';
import { IDetallesCompra, IDetalleCompra } from '../../../../../../models/metales/compra.models';
import { CalculosService } from '../../../../../../services/metales/calculos.service';
import { CompraService } from '../../../../../../services/metales/compra.service';
import { DataService } from '../../../../../../shared/data.service';


@Component({
  selector: 'app-detalle-consulta-compra',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,    
    MatButtonModule,
    MatToolbarModule,
    MatButtonToggleModule,
    CurrencyPipe,
    MatDialogModule
  ],
  templateUrl: './detalle-consulta-compra.component.html',
  styleUrl: './detalle-consulta-compra.component.css'
})
export class DetalleConsultaCompraComponent implements OnInit {
  private _ApiService = inject(DetallesCompraService);
  private _ApiCompraService = inject(CompraService);
  private _ApiCalculoService = inject(CalculosService)
  private _DataService = inject(DataService);
  private _route = inject(ActivatedRoute);
  public detalleCompraData$!: Observable<IDetallesCompra>;
  private _router = inject(Router)
  paramIdCompra: number = 0;
  paramAccion: string = '';

  title: string | null = null;
  itemId: number | null = null;
  accion: string | null = null;

  //filtro
  filter: string = '';

  //Paginador
  cantidadTotal: number = 0;
  cantidadPorPagina: number = 5;
  numeroDePagina: number = 0;
  opcionesDePaginado: number[] = [1, 5, 10, 25, 100];

  dataSource: MatTableDataSource<IDetalleCompra> = new MatTableDataSource<IDetalleCompra>([]);
  displayedColumns: string[] = ['id', 'metal.nombre', 'precio', 'peso', 'importe'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DetalleConsultaCompraComponent>) {
    this.title = data.titulo;
    this.paramIdCompra = data.itemId;
  }

  ngOnInit(): void {
    this.allDetalleCompraInDataSourcePaginador(this.paramIdCompra, null);
  }

  allDetalleCompraInDataSourcePaginador(idCompra: number, filter: string | null): void {
    this.detalleCompraData$ = this._ApiService.getDetallesCompraPaginador(idCompra,
      this.cantidadPorPagina,
      this.numeroDePagina,
      filter);

    this.detalleCompraData$.subscribe((info: IDetallesCompra) => {
      this.dataSource.data = info.elementos
      this.cantidadTotal = info.cantidadTotal;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter = filterValue;
    this.allDetalleCompraInDataSourcePaginador(this.paramIdCompra, filterValue);

  }

  cambiarPagina(event: PageEvent) {
    this.cantidadPorPagina = event.pageSize;
    this.numeroDePagina = event.pageIndex;
    this.allDetalleCompraInDataSourcePaginador(this.paramIdCompra, this.filter);
  }

  salir(): void {
    this.dialogRef.close();
  }
}
