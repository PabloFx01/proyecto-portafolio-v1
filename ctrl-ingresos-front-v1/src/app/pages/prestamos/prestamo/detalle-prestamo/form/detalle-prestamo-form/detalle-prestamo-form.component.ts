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
import { LoginService } from '../../../../../../services/login.service';
import { IResponse } from '../../../../../../models/response.models';
import { DetallePrestamoService } from '../../../../../../services/prestamos/detallePrestamo.service';
import { PrestamoService } from '../../../../../../services/prestamos/prestamo.service';
import { IDetallePrestamo, IDetallePrestamoId, IPrestamo } from '../../../../../../models/prestamos/prestamo.models';
import { CuentaService } from '../../../../../../services/ctrlEfectivo/cuenta.service';
import { MovimientoService } from '../../../../../../services/ctrlEfectivo/movimiento.service';
import { SpinnerComponent } from "../../../../../../shared/spinner/spinner.component";


@Component({
  selector: 'app-detalle-prestamo-form',
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
  templateUrl: './detalle-prestamo-form.component.html',
  styleUrl: './detalle-prestamo-form.component.css'
})
export class DetallePrestamoFormComponent implements OnInit {
  detallePrestamoForm!: FormGroup;
  _detallePrestamoServices = inject(DetallePrestamoService);
  _prestamoService = inject(PrestamoService);
  _cuentaService = inject(CuentaService);
  _movimientoService = inject(MovimientoService);
  private _toastr = inject(ToastrService)
  private loginServices = inject(LoginService);
  public dialog = inject(MatDialog)
  title?: string;
  idDetallePrestamo: number | null = null;
  idPrestamo: number | null = null;
  dateCalendar: Date | null = null;
  maxPago: number = 0;
  pagoActual: number = 0;
  paid: boolean = false;
  msjError: string | null = null

  prestamoData: IPrestamo = {
    id: null,
    detallePrestamo: null,
    titulo: null,
    fechaCreacion: null,
    monto: null,
    interes: null,
    cuotas: null,
    totAPagar: null,
    cuentaOrigen: null,
    cuentaBeneficiario: null,
    saldoRest: null,
    totPag: null,
    estado: null,
    procesarPrestamo:null,
    fechaTotPagado: null,
    usuario: null
  };

  detallePrestamoData: IDetallePrestamo = {
    detallePrestamoId: null,
    fechaPago: null,
    montoPago: null,
    pagoEfectuado: null
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
    public dialogRef: MatDialogRef<DetallePrestamoFormComponent>) {
    this.title = data.titulo + ' pago';
    this.idDetallePrestamo = data.idDetallePrestamo;
    this.idPrestamo = data.idPrestamo;
    this.isUserLogin();


  }

  async ngOnInit(): Promise<void> {
    this.initForm();
    await this.loadGralData();
    this.resetMessageError();

  }

  async loadGralData(): Promise<void> {
    this.prestamoData = await this.getPrestamo(this.idPrestamo!);

    if (this.prestamoData) {
      this.maxPago = this.prestamoData.saldoRest!;
      this.loadCuentaBeneficiaria();
      this.loadPagoSugerido(this.prestamoData);
      if (this.idDetallePrestamo != null) {
        await this.loadItemData(this.idDetallePrestamo, this.idPrestamo!);
        if (this.idDetallePrestamo != null) {
          let restActual = this.maxPago;
          this.maxPago = restActual + this.pagoActual;
        }
      }
    }

  }


  loadPagoSugerido(prestamo: IPrestamo): void {
    let nPagoSugerido: number = Number((prestamo.totAPagar! / prestamo.cuotas!).toFixed(2));
    this.detallePrestamoForm.patchValue({
      pagoSugerido: nPagoSugerido
    })
  }


  loadCuentaBeneficiaria(): void {

    this.detallePrestamoForm.patchValue({
      cBenefi: this.prestamoData.cuentaBeneficiario?.sobre?.descripcion,
      saldoDisponible: this.prestamoData.cuentaBeneficiario?.saldo
    })
  }

  initForm(): void {

    this.detallePrestamoForm = this.formBuilder.group(
      {
        cBenefi: [{ value: null, disabled: true }],
        saldoDisponible: [{ value: null, disabled: true }],
        pagoSugerido: [{ value: null, disabled: true }],
        pago: [{ value: null, disabled: false }, Validators.required],
      }
    )
  }

  async loadItemData(idDetallePrestamo: number, idPrestamo: number) {

    const dPrestamo: IDetallePrestamo = await this.getDetPrestamo(idDetallePrestamo, idPrestamo);
    if (dPrestamo) {
      this.detallePrestamoForm.patchValue({
        cBenefi: this.prestamoData.cuentaBeneficiario?.sobre?.descripcion,
        saldoDisponible: this.prestamoData.cuentaBeneficiario?.saldo,
        pago: dPrestamo.montoPago
      })
      this.pagoActual = dPrestamo.montoPago!;

    }

  }

  resetMessageError(): void {
    this.detallePrestamoForm.get('pago')?.valueChanges.subscribe((newMonto) => {
      this.msjError = null;
    })
  }

  getShortDate(fecha: Date): string {
    let ahora = new Date(fecha);
    let fechaActual = ahora.getFullYear() + '-'
      + ('0' + (ahora.getMonth() + 1)).slice(-2) + '-'
      + ('0' + ahora.getDate()).slice(-2) + ' '
    return fechaActual;
  }

  async getDetPrestamo(idDetallePrestamo: number, idPrestamo: number): Promise<IDetallePrestamo> {
    try {
      const detallePrestamo: IDetallePrestamo =
        await firstValueFrom(this._detallePrestamoServices.getDetallePrestamo(idDetallePrestamo, idPrestamo));
      return detallePrestamo;
    } catch (error) {
      console.error('Error al obtener el detalle de la Prestamo:', error);
      throw error;
    }
  }

  async getPrestamo(idPrestamo: number): Promise<IPrestamo> {
    try {
      const prestamo: IPrestamo =
        await firstValueFrom(this._prestamoService.getPrestamo(idPrestamo));
      return prestamo;
    } catch (error) {
      console.error('Error al obtener la prestamo:', error);
      throw error;
    }
  }

 


  async onSave() {
    this.spinnerShow();
    let msj = 'El pago se ha generado con éxito.';
    let idDetallePrestamo = this.idDetallePrestamo;
    if (idDetallePrestamo != null) {
      this.detallePrestamoData = await this.getDetPrestamo(idDetallePrestamo, this.idPrestamo!);
      msj = 'El pago se ha actualizado correctamente.';
    } else {
      let detallePrestamoId: IDetallePrestamoId = {
        id: null,
        idPrestamo: this.idPrestamo!
      }
      this.detallePrestamoData.detallePrestamoId = detallePrestamoId;
    }

    let pago = this.detallePrestamoForm.get("pago")?.value;
    let saldo = this.detallePrestamoForm.get("saldoDisponible")?.value;
    if (pago > saldo) {
      this.msjError = "El pago no puede ser mayor al saldo disponible en la cuenta.";
    } else {
      this.detallePrestamoData.montoPago = pago;
      this.detallePrestamoData.fechaPago = new Date();
      let response!: IResponse;
      if (idDetallePrestamo != null) {
        response = await this.update(idDetallePrestamo, this.idPrestamo!, this.detallePrestamoData)
      } else {
        response = await this.save(this.detallePrestamoData)
      }

      if (response) {        
        this.showSuccess(msj, "Prestamo")
        this.spinnerHide();
        this.dialogRef.close();
      }
    }
  }

  async update(idDetalle: number, idPrestamo: number, detallePrestamo?: IDetallePrestamo): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._detallePrestamoServices.updateDetallePrestamo(idDetalle, idPrestamo, detallePrestamo!));
      return response;
    } catch (error) {
      console.error('Error al actualizar el detalle del prestamo:', error);
      throw error;
    }
  }

  async save(detallePrestamo?: IDetallePrestamo): Promise<IResponse> {
    try {
      const response: any =
        await firstValueFrom(this._detallePrestamoServices.saveDetallePrestamo(detallePrestamo!));
      return response;
    } catch (error) {
      console.error('Error al guardar el detalle de la factura:', error);
      throw error;
    }
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
    this.detallePrestamoForm.reset();
    this.dialogRef.close();
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }
}
