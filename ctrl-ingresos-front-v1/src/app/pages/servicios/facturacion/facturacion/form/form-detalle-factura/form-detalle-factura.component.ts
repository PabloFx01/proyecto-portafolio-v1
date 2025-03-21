import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule, MatRadioGroup } from '@angular/material/radio';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DetalleFacturaService } from '../../../../../../services/servicios/detalleFactura.service';
import { LoginService } from '../../../../../../services/login.service';
import { IServicio } from '../../../../../../models/servicios/servicio.models';
import { IDetalleFactura, IDetalleFacturaId, IFactura } from '../../../../../../models/servicios/factura.models';
import { ServicioService } from '../../../../../../services/servicios/servicio.service';
import { IResponse } from '../../../../../../models/response.models';
import { FacturaService } from '../../../../../../services/servicios/factura.service';
import { di } from '@fullcalendar/core/internal-common';
import { facturaPagadaFormComponent } from '../form-factura-pagada/factura-pagada-form.component';
import { SpinnerComponent } from "../../../../../../shared/spinner/spinner.component";


@Component({
  selector: 'app-form-detalle-factura',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatRadioGroup,
    MatIconModule, SpinnerComponent],
  templateUrl: './form-detalle-factura.component.html',
  styleUrl: './form-detalle-factura.component.css'
})
export class FormDetalleFacturaComponent implements OnInit {
  detalleFacturaForm!: FormGroup;
  _detalleFacturaServices = inject(DetalleFacturaService);
  _servicioServices = inject(ServicioService);
  _facturaService = inject(FacturaService);
  private _toastr = inject(ToastrService)
  private loginServices = inject(LoginService);
  public dialog = inject(MatDialog)
  title?: string;
  idDetalleFactura: number | null = null;
  idFactura: number | null = null;
  idServicio: null | number = null;
  dateCalendar: Date | null = null;
  maxPago: number = 0;
  pagoActual: number = 0;
  paid: boolean = false;
  servicioData: IServicio = {
    id: null,
    nombre: null,
    valor: null,
    periodoPago: null,
    fechaIniVto: null,
    fechaFinVto: null,
    comentario: null,
    activo: null,
    usuario: null
  };
  facturaData: IFactura = {
    id: null,
    detallesFactura: null,
    estado: null,
    fecha: null,
    saldoRest: null,
    servicio: null,
    totPag: null,
    fechaPagoTotVto: null,
    usuario: null
  };
  detalleFacturaData: IDetalleFactura = {
    detalleFacturaId: null,
    fechaPago: null,
    pago: null
  }

  userLoginOn: boolean = false;
  username: string | null = '';
  role: String | null = '';

  isLoading: boolean = false;

  spinnerShow(): void {
    this.isLoading = true
  }

  spinnerHide(): void {
    this.isLoading = false
  }
  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormDetalleFacturaComponent>) {
    this.title = data.titulo + ' pago';
    this.idDetalleFactura = data.idDetalleFactura;
    this.idFactura = data.idFactura;
    this.idServicio = data.idServicio;
    this.isUserLogin();


  }

  async ngOnInit(): Promise<void> {
    this.initForm();
    await this.loadGralData();

  }

  async loadGralData(): Promise<void> {
    if (this.idServicio != null) {

      this.servicioData = await this.getServicio(this.idServicio);
      if (this.servicioData) {
        this.facturaData = await this.getFactura(this.idFactura!);
        if (this.facturaData) {
          this.maxPago = this.facturaData.saldoRest!;
          this.loadPagoSugerido();
          if (this.idDetalleFactura != null) {
            await this.loadItemData(this.idDetalleFactura, this.idFactura!);
            if (this.idDetalleFactura != null) {
              let restActual = this.maxPago;
              this.maxPago = restActual + this.pagoActual;
            }
            this.findFacturaPagada();
          }
        }
      }
    }
  }


  loadPagoSugerido(): void {
    let nPagoSugerido: number = Number((this.servicioData.valor! / (this.servicioData.periodoPago! * 4)).toFixed(2));
    this.detalleFacturaForm.patchValue({
      pagoSugerido: nPagoSugerido
    })
  }

  initForm(): void {

    this.detalleFacturaForm = this.formBuilder.group(
      {
        pagoSugerido: [{ value: null, disabled: true }],
        pago: [{ value: null, disabled: false }, Validators.required],
      }
    )
  }

  async loadItemData(idDetalleFactura: number, idFactura: number) {

    const dFactura: IDetalleFactura = await this.getDetFactura(idDetalleFactura, idFactura);
    if (dFactura) {
      this.detalleFacturaForm.patchValue({
        pago: dFactura.pago
      })
      this.pagoActual = dFactura.pago!;

    }

  }

  async findFacturaPagada(): Promise<void> {
    try {
      let factura: IFactura = await this.getFacturaPagada(this.facturaData.servicio?.id!);
      if (factura) {
        this.paid = true;
      }
    } catch (error) {
      this.paid = false;
    }
  }

  async getFacturaPagada(idServicio: number): Promise<IFactura> {
    try {
      const factura: IFactura =
        await firstValueFrom(this._facturaService.getFacturaPaidByUserAndService(idServicio, this.username!));
      return factura;
    } catch (error) {
      console.error('Error al obtener la Factura:', error);
      throw error;
    }
  }

  getShortDate(fecha: Date): string {
    let ahora = new Date(fecha);
    let fechaActual = ahora.getFullYear() + '-'
      + ('0' + (ahora.getMonth() + 1)).slice(-2) + '-'
      + ('0' + ahora.getDate()).slice(-2) + ' '
    return fechaActual;
  }

  async getDetFactura(idDetalleFactura: number, idFactura: number): Promise<IDetalleFactura> {
    try {
      const detalleFactura: IDetalleFactura =
        await firstValueFrom(this._detalleFacturaServices.getDetalleFactura(idDetalleFactura, idFactura));
      return detalleFactura;
    } catch (error) {
      console.error('Error al obtener el detalle de la factura:', error);
      throw error;
    }
  }

  async getFactura(idFactura: number): Promise<IFactura> {
    try {
      const factura: IFactura =
        await firstValueFrom(this._facturaService.getFactura(idFactura));
      return factura;
    } catch (error) {
      console.error('Error al obtener la Factura:', error);
      throw error;
    }
  }

  async getServicio(itemId: number): Promise<IServicio> {
    try {
      const servicio: IServicio =
        await firstValueFrom(this._servicioServices.getServicio(itemId));
      return servicio;
    } catch (error) {
      console.error('Error al obtener el servicio:', error);
      throw error;
    }
  }

  async onSave() {
    this.spinnerShow();
    let msj = 'Se ha creado correctamente.';
    let idDetalleFactura = this.idDetalleFactura;
    if (idDetalleFactura != null) {
      this.detalleFacturaData = await this.getDetFactura(idDetalleFactura, this.idFactura!);
      msj = 'Se ha actualizado correctamente.';
    } else {
      let detalleFacturaId: IDetalleFacturaId = {
        id: null,
        idFactura: this.idFactura!
      }
      this.detalleFacturaData.detalleFacturaId = detalleFacturaId;
    }
    let pago = 0;
    pago = this.detalleFacturaForm.get("pago")?.value;
    this.detalleFacturaData.pago = pago;
    this.detalleFacturaData.fechaPago = new Date();
    let difPago = this.maxPago - pago;
    await this.findFacturaPagada();

    if ((this.paid && difPago > 0) || (!this.paid)) {
      let response!: IResponse;
      if (idDetalleFactura != null) {
        response = await this.update(idDetalleFactura, this.idFactura!, this.detalleFacturaData)
      } else {
        response = await this.save(this.detalleFacturaData)
      }

      if (response) {
        this.showSuccess(msj, "Facturación")
        this.spinnerHide();
        this.dialogRef.close();
      }
    } else {
      this.spinnerHide();
      this.openForm();
    }



  }

  async update(idDetalle: number, idFactura: number, detalleFactura?: IDetalleFactura): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._detalleFacturaServices.updateDetalleFactura(idDetalle, idFactura, detalleFactura!));
      return response;
    } catch (error) {
      console.error('Error al actualizar el detalle de la factura:', error);
      throw error;
    }
  }

  async save(detalleFactura?: IDetalleFactura): Promise<IResponse> {
    try {
      const response: any =
        await firstValueFrom(this._detalleFacturaServices.saveDetalleFactura(detalleFactura!));
      return response;
    } catch (error) {
      console.error('Error al guardar el detalle de la factura:', error);
      throw error;
    }
  }

  openForm() {
    const dialogRef = this.dialog.open(facturaPagadaFormComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30vh' },
        width: '300px',
        height: '350px',
        data: {
          username: this.username,
          dialogIngreso: this.dialogRef
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
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
  cancel(): void {
    this.detalleFacturaForm.reset();
    this.dialogRef.close();
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }
}
