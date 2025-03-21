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
import { DetallesCompraComponent } from '../../detalles-compra.component';
import { ToastrService } from 'ngx-toastr';
import { ICompra, DetalleCompraId, IDetalleCompra } from '../../../../../../models/metales/compra.models';
import { MetalId, IMetalCompra } from '../../../../../../models/metales/metal-compra.models';
import { IResponse } from '../../../../../../models/response.models';
import { CompraService } from '../../../../../../services/metales/compra.service';
import { DetallesCompraService } from '../../../../../../services/metales/detalles-compra.service';
import { MetalCompraApiService } from '../../../../../../services/metales/metal-compra-api-service';
import { DataService } from '../../../../../../shared/data.service';
import { ILoginResponse } from '../../../../../../models/login.models';
import { LoginService } from '../../../../../../services/login.service';
import { SpinnerComponent } from "../../../../../../shared/spinner/spinner.component";


@Component({
  selector: 'app-detalle-compra-form',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSelectModule, SpinnerComponent],
  templateUrl: './detalle-compra-form.component.html',
  styleUrl: './detalle-compra-form.component.css'
})
export class DetalleCompraFormComponent implements OnInit, OnDestroy {


  title: string = 'Compra';
  detalleCompraForm!: FormGroup;
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
  
  listMetal: IMetalCompra[] = [];
  private _ApiMetalService = inject(MetalCompraApiService);
  private _ApiCompraService = inject(CompraService);
  private _ApiDetalleCompraService = inject(DetallesCompraService);
  _DataService = inject(DataService);
  private suscripcion?: Subscription;
  private _toastr = inject(ToastrService);

  idCompraParam!: number;

  loginServices = inject(LoginService);
  username: string | null = '';
  role: String | null = '';
  userLoginOn: boolean = false;

  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }
  isLoading: boolean = false;
  
  spinnerShow(): void {
    this.isLoading = true
  }
  
    spinnerHide(): void {
    this.isLoading = false
  }
  constructor(private formBuilder: FormBuilder) {
    this.isUserLogin();
    this.loadMetalesCompra();
    this.initForm();
    this._DataService.selectedDetalleCompraItemId$.subscribe((detalleIds: DetalleCompraId) => {
      if (detalleIds) {
        this.loadItemData(detalleIds)
      }
    })
    this._DataService.selectedCompraItemId$.subscribe((valor: number) => {
      if (valor) {
        this.detalleCompraForm.patchValue({
          idCompra: valor
        })
        this.limpiar()
      }
    })
  }


  ngOnInit(): void {


    this.detalleCompraForm.get('peso')?.valueChanges.subscribe((newPeso) => {

      let importe: number = this.detalleCompraForm.get("importe")?.value
      if (importe != 0 && importe != null) {
        let newPrecio: number =  importe/newPeso;
        this.detalleCompraForm.patchValue({
          precio: newPrecio
        })
      }
    })

    this.detalleCompraForm.get('importe')?.valueChanges.subscribe((newImporte) => {

      let peso: number = this.detalleCompraForm.get("peso")?.value
      if (peso != 0 && peso != null) {
        let newPrecio: number =   newImporte/peso;
        this.detalleCompraForm.patchValue({
          precio: newPrecio
        })
      }
    })
  }

  initForm(): void {
    this.detalleCompraForm = this.formBuilder.group(
      {
        idCompra: [{ value: null, disabled: true },],
        id: [{ value: null, disabled: true }],
        metalNombre: [{ value: null, disabled: false }, Validators.required],
        precio: [{ value: null, disabled: true }],
        peso: [{ value: null, disabled: false }, Validators.required],
        importe: [{ value: null, disabled: false },Validators.required]
      }
    )
  }

  loadItemData(itemId: DetalleCompraId) {
    try {
      if (itemId.id > 0 && itemId.idCompra > 0) {
        this._ApiDetalleCompraService.getDetalleCompra(itemId.id, itemId.idCompra).subscribe((detalleCompra: IDetalleCompra) => {

          this.detalleCompraForm.patchValue({

            idCompra: detalleCompra.detalleId?.idCompra,
            id: detalleCompra.detalleId?.id,
            metalNombre: detalleCompra.metal!.metalId?.id,
            nombre: detalleCompra.metal!.nombre,
            precio: detalleCompra.precioCompra,
            peso: detalleCompra.peso,
            importe: detalleCompra.importe

          })
        });
      }
    } catch (error) {
      console.log("no encontro registro");
    }

  }
  async onSave() {
    this.spinnerShow();
    let compraId: number = this.detalleCompraForm.get('idCompra')?.value;
    let detalleId: number = this.detalleCompraForm.get('id')?.value;
    this.detalleCompraData.importe = this.detalleCompraForm.get('importe')?.value;
    this.detalleCompraData.precioCompra = this.detalleCompraForm.get('precio')?.value;
    this.detalleCompraData.peso = this.detalleCompraForm.get('peso')?.value;
    this.metalIdData = this.detalleCompraForm.get("metalNombre")?.value;
    let metalSeleccionado = this.listMetal.find(metal => metal.metalId?.id == this.metalIdData.id);

    if (metalSeleccionado) {
      let descripcion = metalSeleccionado.nombre;
    }

    this.metalData.metalId = this.metalIdData
    this.detalleCompraData.metal = this.metalData;

    if (detalleId != null) {
      this.detalleCompraIdData.id = this.detalleCompraForm.get("id")?.value;
      this.detalleCompraIdData.idCompra = this.detalleCompraForm.get("idCompra")?.value;
      this.detalleCompraData.detalleId = this.detalleCompraIdData;
    } else {
      this.detalleCompraData.detalleId = await this.obtenerDetalleId(compraId);
    }
    const response: IResponse = await this.guardarDetalle(this.detalleCompraData);
    if (response.idMessage == '201') {
      console.log(response.message);
    }
    this.limpiar();
    let msj: string = '';
    this.showSuccess(`Se guardo correctamente.`, `La compra del material`)
    this.spinnerHide();
    this._DataService.dataUpdated$.next();
  }

  limpiar() {
    this.detalleCompraForm.patchValue({
      id: null,
      metalNombre: null,
      nombre: null,
      precio: null,
      peso: null,
      importe: null
    })
  }

  setNextIdDetalle(idCompra: number): void {
    this._ApiDetalleCompraService.getNextIdDetalleCompra(idCompra).subscribe((detalleId: DetalleCompraId) => {
      this.nextIdDetalle = detalleId;
    });
  }

  loadMetalesCompra(): void {
    this._ApiMetalService.getMetalesCompra(this.username!).subscribe((metales: IMetalCompra[]) => {
      this.listMetal = metales;
    })
    
  }

  hasError(formControlName: string, typeError: string) {
    return this.detalleCompraForm.get(formControlName)?.hasError(typeError) &&
      this.detalleCompraForm.get(formControlName)?.touched;
  }

  async obtenerDetalleId(compraId: number): Promise<DetalleCompraId> {
    try {
      const detalleId: DetalleCompraId =
        await firstValueFrom(this._ApiDetalleCompraService.getNextIdDetalleCompra(compraId));
      return detalleId;
    } catch (error) {
      console.error('Error al obtener el detalleId:', error);
      throw error;
    }
  }

  async guardarDetalle(detalle: IDetalleCompra): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._ApiDetalleCompraService.saveDetalleCompra(detalle));
      return response;
    } catch (error) {
      console.error('Error al obtener el detalleId:', error);
      throw error;
    }
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }

  ngOnDestroy(): void {
    this.detalleCompraIdData = {
      id: 0,
      idCompra: 0
    };
    this._DataService.setSelectedDetalleCompraItemId(this.detalleCompraIdData)
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
