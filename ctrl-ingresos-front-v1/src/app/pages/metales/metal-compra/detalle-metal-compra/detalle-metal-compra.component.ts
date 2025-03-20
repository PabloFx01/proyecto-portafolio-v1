import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription, first, firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MetalVentaFormComponent } from './metal-venta-form/metal-venta-form.component';
import { MetalId, IMetalCompra } from '../../../../models/metales/metal-compra.models';
import { IMetalVenta } from '../../../../models/metales/metal-venta.models';
import { MetalCompraApiService } from '../../../../services/metales/metal-compra-api-service';
import { MetalVentaService } from '../../../../services/metales/metal-venta.service';
import { DataService } from '../../../../shared/data.service';
import { MetalesNavComponent } from "../../metales-nav/metales-nav.component";

@Component({
  selector: 'app-detalle-metal-compra',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule, MetalesNavComponent,RouterOutlet],
  templateUrl: './detalle-metal-compra.component.html',
  styleUrl: './detalle-metal-compra.component.css'
})
export class DetalleMetalCompraComponent implements OnInit {


  metalCompraForm!: FormGroup;
  _ApiService = inject(MetalCompraApiService);
  _ApiMetalVentaService = inject(MetalVentaService);
  _DataService = inject(DataService);
  private suscripcion?: Subscription;
  private _toastr = inject(ToastrService)
  private _activateRoute = inject(ActivatedRoute);
  titulo: string = 'Descripción del metal asociado para la venta:'

  dataSource: MatTableDataSource<IMetalVenta> = new MatTableDataSource<IMetalVenta>([]);
  displayedColumns: string[] = ['id', 'descripcion', 'acciones'];

  metalIdData: MetalId = {
    id: ''
  }

  metalData: IMetalCompra = {
    metalId: null,
    nombre: '',
    precio: 0,
    fechaIni: new Date(),
    fechaFin: null,
    editadoPor: 'admin',
    modificadoEl: null,
    usuario : null
  }

  title?: string;

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {
    this.initForm();
  }

  ngOnInit(): void {

    this._activateRoute.params.subscribe(params => {
      this.metalIdData = {
        id: params['idMetalCompra']
      };
    })

    this.loadItemData(this.metalIdData);
    this.allMetalVentaInDataSource();
  }


  allMetalVentaInDataSource(): void {
    this._ApiMetalVentaService.getMetalesVenta(this.metalIdData.id)
      .subscribe((metales: IMetalVenta[]) => {
        this.dataSource.data = metales;
      });
  }

  initForm(): void {
    this.metalCompraForm = this.formBuilder.group(
      {
        id: [{ value: null, disabled: true }],
        nombre: [{ value: '', disabled: true }],
        precio: [{ value: 0, disabled: true }],
      }
    )
  }

  loadItemData(itemId: MetalId) {

    this._ApiService.getMetalCompra(itemId.id).subscribe((metal: IMetalCompra) => {
      this.metalCompraForm.patchValue({
        id: metal.metalId?.id,
        nombre: metal.nombre,
        precio: metal.precio,
        fechaIni: metal.fechaIni
      })
    });
  }

  eliminar(arg0: any) {
    throw new Error('Method not implemented.');
  }
  editar(id: number) {
    const accion: string = 'Actualizar';
    const titulo: String = 'Actualizar';    
    this.openForm(accion,titulo,id,this.metalIdData.id)
  }

  openForm(accion: string,
    titulo: String,
    idMetalVenta: number | null,
    idMetalCompra: string | null) {

    const dialogRef = this.dialog.open(MetalVentaFormComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '500px',
        height: '500px',
        data: {
          tipoAccion: accion,
          titulo: titulo,
          idMetalVenta: idMetalVenta,
          idMetalCompra: idMetalCompra
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadData();
    });
  }
  asociar() {
    const accion: string = 'Crear';
    const titulo: String = 'Crear';
    this.openForm(accion,titulo,null,this.metalIdData.id)
  }
  reloadData() {
    this.allMetalVentaInDataSource();
  }
}
