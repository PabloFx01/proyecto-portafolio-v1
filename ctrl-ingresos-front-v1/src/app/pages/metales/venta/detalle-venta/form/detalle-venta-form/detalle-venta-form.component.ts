import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { Subscription, firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { IInventario } from '../../../../../../models/metales/inventario.models';
import { MetalId, IMetalCompra } from '../../../../../../models/metales/metal-compra.models';
import { MetalVentaId, IMetalVenta } from '../../../../../../models/metales/metal-venta.models';
import { DetalleVentaId, IDetalleVenta } from '../../../../../../models/metales/venta.models';
import { IResponse } from '../../../../../../models/response.models';
import { DetallesVentaService } from '../../../../../../services/metales/detalles-venta.service';
import { InventarioService } from '../../../../../../services/metales/inventario.service';
import { MetalCompraApiService } from '../../../../../../services/metales/metal-compra-api-service';
import { MetalVentaService } from '../../../../../../services/metales/metal-venta.service';
import { VentaService } from '../../../../../../services/metales/venta.service';
import { DataService } from '../../../../../../shared/data.service';
import { ILoginResponse } from '../../../../../../models/login.models';
import { LoginService } from '../../../../../../services/login.service';


@Component({
  selector: 'app-detalle-venta-form',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSelectModule],
  templateUrl: './detalle-venta-form.component.html',
  styleUrl: './detalle-venta-form.component.css'
})
export class DetalleVentaFormComponent implements OnInit, OnDestroy {

  title: string = 'Venta';
  detalleVentaForm!: FormGroup;
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
    usuario : null
  }

  metalVentaIdData: MetalVentaId = {
    id: 0,
    idMetalCompra: ''
  };

  metalVentaData: IMetalVenta = {
    metalVentaId: this.metalVentaIdData,
    descripcion: '',
    editadoPor: null,
    modificadoEl: null
  }

  detalleVentaIdData: DetalleVentaId = {
    id: 0,
    idVenta: 0
  };
  detalleVentaData: IDetalleVenta = {
    detalleId: this.detalleVentaIdData,
    gananciaUnitaria: null,
    metal: this.metalData,
    metalAsociadoVenta: this.metalVentaData,
    pesoVendido: 0,
    precioPromedio: null,
    venta: null
  };
  nextIdDetalle!: DetalleVentaId;
  listMetal: IMetalCompra[] = [];
  listMetalVenta: IMetalVenta[] = [];

  private _ApiMetalService = inject(MetalCompraApiService);
  private _ApiVentaService = inject(VentaService);
  private _ApiDetalleVentaService = inject(DetallesVentaService);
  private _ApiInventarioService = inject(InventarioService);
  private _ApiMetalVentaService = inject(MetalVentaService);
  _DataService = inject(DataService);
  private _toastr = inject(ToastrService);

  idVentaParam!: number;

  loginServices = inject(LoginService);
  username: string | null = '';
  role: String | null = '';
  userLoginOn: boolean = false;

  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }

  constructor(private formBuilder: FormBuilder) {
    this.isUserLogin();
    this.initForm();
    this._DataService.selectedDetalleVentaItemId$.subscribe((detalleIds: DetalleVentaId) => {
      if (detalleIds) {
        this.loadItemData(detalleIds)
      }
    })
    this._DataService.selectedVentaItemId$.subscribe((valor: number) => {
      if (valor) {
        this.detalleVentaForm.patchValue({
          idVenta: valor
        })
      }
    })
  }


  ngOnInit(): void {
    this.loadMetalesCompra();

    this.detalleVentaForm.get('metalNombre')?.valueChanges.subscribe(valor => {
      if (valor) {
        this.setStockControllerForm(valor);
        this.detalleVentaForm.patchValue({
          metalDescripcionVenta: null
        })
        this.setMetalDescripcionVenta(valor);
      }
    })

  }

  async setStockControllerForm(valor: string): Promise<void> {
    let idMetales = valor;
    let idMetal: MetalId = { id: idMetales };
    let inventario: IInventario = await this.getInventario(idMetal)
    if (inventario != null) {
      this.detalleVentaForm.patchValue({
        stockInventario: inventario.stock
      })
    } else {
      this.detalleVentaForm.patchValue({
        stockInventario: 0
      })
    }

  }


  async getListMetalVentaByMetalCompraId(metal: MetalId): Promise<IMetalVenta[]> {
    try {
      let listMetalVenta: IMetalVenta[] =
        await firstValueFrom(this._ApiMetalVentaService.getMetalesVenta(metal.id))
      return listMetalVenta;
    } catch (error) {
      console.error('Error al obtener el getMetalesVenta(getMetalesVenta):', error);
      throw error;
    }

  }

  async setMetalDescripcionVenta(valor: string): Promise<void> {
    let idMetales = valor;
    let idMetal: MetalId = { id: idMetales };
    this.listMetalVenta = await this.getListMetalVentaByMetalCompraId(idMetal)

  }

  getMetalName(metalId: MetalId): string {
    let metalSeleccionado = this.listMetal.find(metal => metal.metalId?.id == metalId.id);
    let descripcion: string = '';
    if (metalSeleccionado) {
      descripcion = metalSeleccionado.nombre;
    }
    return descripcion;
  }

  getMetalVentaName(metalId: MetalId): string {
    let metalSeleccionado = this.listMetal.find(metal => metal.metalId?.id == metalId.id);
    let descripcion: string = '';
    if (metalSeleccionado) {
      descripcion = metalSeleccionado.nombre;
    }
    return descripcion;
  }

  loadMetalesCompra(): void {
    this._ApiMetalService.getMetalesCompra(this.username!).subscribe((metales: IMetalCompra[]) => {
      this.listMetal = metales;
    })
  }

  async getInventario(metal: MetalId): Promise<IInventario> {
    try {
      let inventario: IInventario =
        await firstValueFrom(this._ApiInventarioService.getInventarioByIdMetal(metal.id))
      return inventario;
    } catch (error) {
      console.error('Error al obtener el inventario(getInventario):', error);
      throw error;
    }

  }

  initForm(): void {
    this.detalleVentaForm = this.formBuilder.group(
      {
        idVenta: [{ value: null, disabled: true }],
        id: [{ value: null, disabled: true }],
        metalNombre: [{ value: null, disabled: false }, Validators.required],
        metalDescripcionVenta: [{ value: null, disabled: false }, Validators.required],
        pesoVendido: [{ value: 0, disabled: false }, Validators.required],
        precioPromedio: [{ value: null, disabled: true }],
        gananciaUnitaria: [{ value: null, disabled: true }],
        stockInventario: [{ value: null, disabled: true }]
      }
    )
  }

  loadItemData(itemId: DetalleVentaId) {
    if (itemId.id > 0 && itemId.idVenta > 0) {
      this._ApiDetalleVentaService.getDetalleVenta(itemId.id, itemId.idVenta).subscribe((detalleVenta: IDetalleVenta) => {
        
        this.detalleVentaForm.patchValue({

          idVenta: detalleVenta.detalleId?.idVenta,
          id: detalleVenta.detalleId?.id,
          metalNombre: detalleVenta.metal!.metalId?.id,
          metalDescripcionVenta: detalleVenta.metalAsociadoVenta.metalVentaId.id 
                                 +"/"+detalleVenta.metalAsociadoVenta.metalVentaId.idMetalCompra,
          pesoVendido: detalleVenta.pesoVendido,
          precioPromedio: detalleVenta.precioPromedio,
          gananciaUnitaria: detalleVenta.gananciaUnitaria
        })
      });
    }
  }


  async onSave() {
    let ventaId: number = this.detalleVentaForm.get('idVenta')?.value;
    let detalleId: number = this.detalleVentaForm.get('id')?.value;
    this.detalleVentaData.pesoVendido = this.detalleVentaForm.get('pesoVendido')?.value;
    this.metalIdData = { id: this.detalleVentaForm.get("metalNombre")?.value };
    this.metalVentaIdData = this.selectDescripcionToMetalVentaId(this.detalleVentaForm.get("metalDescripcionVenta")?.value);
    let metalSeleccionado = this.listMetal.find(metal => metal.metalId?.id == this.metalIdData.id);


    //MetalCompra info
    this.metalData.metalId = this.metalIdData
    this.detalleVentaData.metal = this.metalData;
    //MetalVenta info
    this.metalVentaData.metalVentaId = this.metalVentaIdData
    this.detalleVentaData.metalAsociadoVenta = this.metalVentaData;

    if (detalleId != null) {
      this.detalleVentaIdData.id = this.detalleVentaForm.get("id")?.value;
      this.detalleVentaIdData.idVenta = this.detalleVentaForm.get("idVenta")?.value;
      this.detalleVentaData.detalleId = this.detalleVentaIdData;
    } else {
      this.detalleVentaData.detalleId = await this.obtenerDetalleId(ventaId);
    }
    const response: IResponse = await this.guardarDetalle(this.detalleVentaData);
    if (response.idMessage == '201') {
      console.log(response.message);
    }
    this.limpiar();
    let msj: string = '';
    msj = metalSeleccionado ? metalSeleccionado.nombre : 'el material';
    this.showSuccess(`Se asignó correctamente.`, `El material ${msj}`)
    this._DataService.dataUpdated$.next();
  }

  async obtenerDetalleId(ventaId: number): Promise<DetalleVentaId> {
    try {
      const detalleId: DetalleVentaId =
        await firstValueFrom(this._ApiDetalleVentaService.getNextIdDetalleVenta(ventaId));
      return detalleId;
    } catch (error) {
      console.error('Error al obtener el detalleId:', error);
      throw error;
    }
  }

  async guardarDetalle(detalle: IDetalleVenta): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._ApiDetalleVentaService.saveDetalleVenta(detalle));
      return response;
    } catch (error) {
      console.error('Error al obtener el detalleId:', error);
      throw error;
    }
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }

  limpiar() {
    this.detalleVentaForm.patchValue({
      id: null,
      metalNombre: null,
      pesoVendido: null,
      metalDescripcionVenta: null,
      stockInventario: null
    })
  }



  metalVentaIdToSelectDescripcion(metalVenta: MetalVentaId | null): string {
    return `${metalVenta?.id.toString()}/${metalVenta?.idMetalCompra}}`
  }

  selectDescripcionToMetalVentaId(id: string): MetalVentaId {
    let ids: string[] = id.split('/');
    let metalVentaId: MetalVentaId = {

      id: Number(ids[0]),
      idMetalCompra: ids[1]
    }

    return metalVentaId
  }

  ngOnDestroy(): void {
    let detalleId: DetalleVentaId = {
      idVenta: 0,
      id: 0
    }
    this._DataService.setSelectedDetalleVentaItemId(detalleId);
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
