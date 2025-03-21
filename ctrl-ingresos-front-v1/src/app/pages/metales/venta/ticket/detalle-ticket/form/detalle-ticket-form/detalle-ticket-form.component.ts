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
import { MetalId, IMetalCompra } from '../../../../../../../models/metales/metal-compra.models';
import { MetalVentaId, IMetalVenta } from '../../../../../../../models/metales/metal-venta.models';
import { DetalleTicketId, IDetalleTicket } from '../../../../../../../models/metales/ticket.models';
import { IResponse } from '../../../../../../../models/response.models';
import { DetalleTicketService } from '../../../../../../../services/metales/detalle-ticket.service';
import { MetalCompraApiService } from '../../../../../../../services/metales/metal-compra-api-service';
import { MetalVentaService } from '../../../../../../../services/metales/metal-venta.service';
import { TicketService } from '../../../../../../../services/metales/ticket.service';
import { DataService } from '../../../../../../../shared/data.service';
import { ILoginResponse } from '../../../../../../../models/login.models';
import { LoginService } from '../../../../../../../services/login.service';
import { SpinnerComponent } from "../../../../../../../shared/spinner/spinner.component";


@Component({
  selector: 'app-detalle-ticket-form',
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
  templateUrl: './detalle-ticket-form.component.html',
  styleUrl: './detalle-ticket-form.component.css'
})
export class DetalleTicketFormComponent implements OnInit, OnDestroy {
  title: string = 'Ticket';
  detalleTicketForm!: FormGroup;
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

  detalleTicketIdData: DetalleTicketId = {
    id: 0,
    idTicket: 0
  };
  detalleTicketData: IDetalleTicket = {
    detalleId: this.detalleTicketIdData,
    metal: this.metalData,
    metalAsociadoTicket: this.metalVentaData,
    pesoVendido: 0,
    precioVenta: 0,
    importe: 0,
    ticket: null
  };
  nextIdDetalle!: DetalleTicketId;
  listMetal: IMetalCompra[] = [];

  private _ApiMetalService = inject(MetalCompraApiService);
  private _ApiTicketService = inject(TicketService);
  private _ApiDetalleTicketService = inject(DetalleTicketService);
  private _ApiMetalVentaService = inject(MetalVentaService);
  _DataService = inject(DataService);
  private _toastr = inject(ToastrService);
  idTicketParam!: number;
  listMetalVenta: IMetalVenta[] = [];

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
    this.initForm();
    this._DataService.selectedDetalleTicketItemId$.subscribe((detalleIds: DetalleTicketId) => {
      if (detalleIds) {
        this.loadItemData(detalleIds)
      }
    })
    this._DataService.selectedTicketItemId$.subscribe((valor: number) => {
      if (valor) {
        this.detalleTicketForm.patchValue({
          idTicket: valor
        })
      }
    })
  }


  ngOnInit(): void {
    this.loadMetalesCompra();

    this.detalleTicketForm.get('metalNombre')?.valueChanges.subscribe(valor => {
      if (valor) {
        this.detalleTicketForm.patchValue({
          metalDescripcionTicket: null
        })
        this.setMetalDescripcionTicket(valor);
      }
    })

    this.detalleTicketForm.get('pesoVendido')?.valueChanges.subscribe((newPesoVendido) => {
      this.setImporteByPeso(newPesoVendido);
    })

    this.detalleTicketForm.get('precioVenta')?.valueChanges.subscribe((newPrecioVenta) => {
      this.setImporteByPrecioVenta(newPrecioVenta);
    })
  }

  async setMetalDescripcionTicket(valor: string): Promise<void> {
    let idMetales = valor;
    let idMetal: MetalId = {
      id: idMetales
    };
    this.listMetalVenta = await this.getListMetalVentaByMetalCompraId(idMetal)

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

  setImporteByPeso(newValor: number): void {
    let precioVenta: number = this.detalleTicketForm.get("precioVenta")?.value
    if (precioVenta != 0 && precioVenta != null) {
      let newImporte: number = newValor * precioVenta;
      this.detalleTicketForm.patchValue({
        importe: newImporte
      })
    }
  }

  setImporteByPrecioVenta(newValor: number): void {
    let pesoVendido: number = this.detalleTicketForm.get("pesoVendido")?.value
    if (pesoVendido != 0 && pesoVendido != null) {
      let newImporte: number = newValor * pesoVendido;
      this.detalleTicketForm.patchValue({
        importe: newImporte
      })
    }
  }

  setMetalDescripcionVenta(valor: string): void {
    let idMetales = valor;
    let idMetal: MetalId = { id: idMetales };
    let descripcion: string = this.getMetalName(idMetal)
    this.detalleTicketForm.patchValue({
      metalDescripcionTicket: descripcion
    })
  }

  getMetalName(metalId: MetalId): string {
    let metalSeleccionado = this.listMetal.find(metal => metal.metalId?.id == metalId.id);
    let descripcion: string = '';
    if (metalSeleccionado) {
      descripcion = metalSeleccionado.nombre;
    }
    return descripcion;
  }

  async onSave() {
    this.spinnerShow();
    let ticketId: number = this.detalleTicketForm.get('idTicket')?.value;
    let detalleId: number = this.detalleTicketForm.get('id')?.value;
    this.detalleTicketData.pesoVendido = this.detalleTicketForm.get('pesoVendido')?.value;
    this.detalleTicketData.precioVenta = this.detalleTicketForm.get('precioVenta')?.value;
    this.detalleTicketData.importe = this.detalleTicketForm.get('importe')?.value;
    this.metalIdData = { id: this.detalleTicketForm.get("metalNombre")?.value };
    this.metalVentaIdData = this.selectDescripcionToMetalVentaId(this.detalleTicketForm.get("metalDescripcionTicket")?.value);
    let metalSeleccionado = this.listMetal.find(metal => metal.metalId?.id == this.metalIdData.id);

    //MetalCompra info
    this.metalData.metalId = this.metalIdData
    this.detalleTicketData.metal = this.metalData;

    //MetalVenta info
    this.metalVentaData.metalVentaId = this.metalVentaIdData
    this.detalleTicketData.metalAsociadoTicket = this.metalVentaData;

    if (detalleId != null) {
      this.detalleTicketIdData.id = this.detalleTicketForm.get("id")?.value;
      this.detalleTicketIdData.idTicket = this.detalleTicketForm.get("idTicket")?.value;
      this.detalleTicketData.detalleId = this.detalleTicketIdData;
    } else {
      this.detalleTicketData.detalleId = await this.obtenerDetalleId(ticketId);
    }
    const response: IResponse = await this.guardarDetalle(this.detalleTicketData);
    if (response.idMessage == '201') {
      console.log(response.message);
    }
    this.limpiar();
    let msj: string = '';
    msj = metalSeleccionado ? metalSeleccionado.nombre : 'el material';
    this.showSuccess(`Se asignó correctamente.`, `El material ${msj}`)
    this.spinnerHide();
    this._DataService.dataUpdated$.next();
  }

  selectDescripcionToMetalVentaId(id: string): MetalVentaId {
    let ids: string[] = id.split('/');
    let metalVentaId: MetalVentaId = {

      id: Number(ids[0]),
      idMetalCompra: ids[1]
    }

    return metalVentaId
  }

  async obtenerDetalleId(ticketId: number): Promise<DetalleTicketId> {
    try {
      const detalleId: DetalleTicketId =
        await firstValueFrom(this._ApiDetalleTicketService.getNextIdDetalleTicket(ticketId));
      return detalleId;
    } catch (error) {
      console.error('Error al obtener el detalleId:', error);
      throw error;
    }
  }

  async guardarDetalle(detalle: IDetalleTicket): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._ApiDetalleTicketService.saveDetalleTicket(detalle));
      return response;
    } catch (error) {
      console.error('Error al obtener el detalleId:', error);
      throw error;
    }
  }


  initForm(): void {
    this.detalleTicketForm = this.formBuilder.group(
      {
        idTicket: [{ value: null, disabled: true }],
        id: [{ value: null, disabled: true }],
        metalNombre: [{ value: null, disabled: false }, Validators.required],
        metalDescripcionTicket: [{ value: null, disabled: false }, Validators.required],
        pesoVendido: [{ value: 0, disabled: false }, Validators.required],
        precioVenta: [{ value: null, disabled: false }, Validators.required],
        importe: [{ value: null, disabled: true }]

      }
    )
  }

  loadMetalesCompra(): void {
    this._ApiMetalService.getMetalesCompra(this.username!).subscribe((metales: IMetalCompra[]) => {
      this.listMetal = metales;
    })
  }

  async loadItemData(itemId: DetalleTicketId) {
    if (itemId.id > 0 && itemId.idTicket > 0) {
      let detalleTicket: IDetalleTicket = await this.getDetalleTicket(itemId);
      if (detalleTicket) {

        this.detalleTicketForm.patchValue({

          idTicket: detalleTicket.detalleId?.idTicket,
          id: detalleTicket.detalleId?.id,
          metalNombre: detalleTicket.metal!.metalId?.id,
          metalDescripcionTicket: detalleTicket.metalAsociadoTicket.metalVentaId.id + "/"
            + detalleTicket.metalAsociadoTicket.metalVentaId.idMetalCompra,
          pesoVendido: detalleTicket.pesoVendido,
          precioVenta: detalleTicket.precioVenta
        })
      }
    }
  }

  async getDetalleTicket(idDetalleTicket: DetalleTicketId): Promise<IDetalleTicket> {
    try {
      const detalleTicket: IDetalleTicket =
        await firstValueFrom(this._ApiDetalleTicketService.getDetalleTicket(idDetalleTicket.id, idDetalleTicket.idTicket));
      return detalleTicket;
    } catch (error) {
      console.error('Error al obtener el detalleId:', error);
      throw error;
    }
  }


  metalVentaIdToSelectDescripcion(metalVenta: MetalVentaId | null): string {
    return `${metalVenta?.id.toString()}/${metalVenta?.idMetalCompra}}`
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }

  limpiar() {
    this.detalleTicketForm.patchValue({
      id: null,
      metalNombre: null,
      metalDescripcionTicket: null,
      pesoVendido: null,
      precioVenta: null
    })
  }

  ngOnDestroy(): void {
    let id: DetalleTicketId = {
      id: 0,
      idTicket: 0
    }
    this._DataService.setSelectedDetalleTicketItemId(id)
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
