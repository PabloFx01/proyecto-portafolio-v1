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
import { PrestamoService } from '../../../../../services/prestamos/prestamo.service';
import { CuentaService } from '../../../../../services/ctrlEfectivo/cuenta.service';
import { LoginService } from '../../../../../services/login.service';
import { ICoutasPay, IDetallePrestamo, IPrestamo } from '../../../../../models/prestamos/prestamo.models';
import { ICuenta } from '../../../../../models/ctrlEfectivo/cuenta.models';
import { ISobre } from '../../../../../models/ctrlEfectivo/sobre.models';
import { SobreService } from '../../../../../services/ctrlEfectivo/sobre.service';
import { MovimientoService } from '../../../../../services/ctrlEfectivo/movimiento.service';
import { MatSelectModule } from '@angular/material/select';
import { IUser } from '../../../../../models/user.models';
import { IResponse } from '../../../../../models/response.models';
import { SpinnerComponent } from "../../../../../shared/spinner/spinner.component";


@Component({
  selector: 'app-prestamo-form',
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
    MatIconModule,
    MatSelectModule, SpinnerComponent],
  templateUrl: './prestamo-form.component.html',
  styleUrl: './prestamo-form.component.css'
})
export class PrestamoFormComponent implements OnInit {

  prestamoForm!: FormGroup;
  _prestamoService = inject(PrestamoService);
  _cuentaService = inject(CuentaService);
  _sobreService = inject(SobreService);
  _movimientoService = inject(MovimientoService);
  private _toastr = inject(ToastrService)
  private loginServices = inject(LoginService);
  public dialog = inject(MatDialog)
  title?: string;
  idPrestamo: number | null = null;
  paid: boolean = false;
  msjError: string | null = null
  listSobre: ISobre[] = [];
  maxMontoPrestar: number = 0;

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
    procesarPrestamo: null,
    fechaTotPagado: null,
    usuario: null
  };

  detallePrestamoData: IDetallePrestamo = {
    detallePrestamoId: null,
    fechaPago: null,
    montoPago: null,
    pagoEfectuado: null
  }


  sobreDataOrigen: ISobre = {
    id: null,
    descripcion: null,
    usuario: null
  };

  sobreDataDestino: ISobre = {
    id: null,
    descripcion: null,
    usuario: null
  };

  cuentaOrigenData: ICuenta = {
    id: 0,
    saldo: 0,
    sobre: this.sobreDataOrigen
  };

  cuentaDestinoData: ICuenta = {
    id: 0,
    saldo: 0,
    sobre: this.sobreDataDestino
  };



  listCoutasPay: ICoutasPay[] = [
    { id: 1, descripcion: '1 - Cuota', interes: 0 },
    { id: 2, descripcion: '2 - Cuotas', interes: 2.5 },
    { id: 3, descripcion: '3 - Cuotas', interes: 5 },
    { id: 4, descripcion: '4 - Cuotas', interes: 7 },
    { id: 6, descripcion: '6 - Cuotas', interes: 10 },
    { id: 12, descripcion: '12 - Cuotas', interes: 15 },
    { id: 24, descripcion: '24 - Cuotas', interes: 30 }
  ];

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
    public dialogRef: MatDialogRef<PrestamoFormComponent>) {
    this.title = data.titulo + ' prestamo';
    this.idPrestamo = data.idPrestamo;
    this.isUserLogin();
  }

  async ngOnInit(): Promise<void> {
    this.initForm();
    await this.loadGralData();
    await this.getListSobres();
    this.setSaldoActual();
    this.setInteresYMonto();

  }

  initForm(): void {

    this.prestamoForm = this.formBuilder.group(
      {
        titulo: [{ value: null, disabled: false }, Validators.required],
        fechaCreacion: [{ value: null, disabled: false }, Validators.required],
        cOrigen: [{ value: null, disabled: false }, Validators.required],
        saldoDisponibleOrigen: [{ value: null, disabled: true }],
        cBenefi: [{ value: null, disabled: false }, Validators.required],
        montoAPrestar: [{ value: null, disabled: true }, Validators.required],
        coutas: [{ value: null, disabled: true }, Validators.required],
        interes: [{ value: null, disabled: true }],
        pagoPorMes: [{ value: null, disabled: true }],
        totAPagar: [{ value: null, disabled: true }]
      }
    )
  }

  async loadGralData(): Promise<void> {
    if (this.idPrestamo != null) {
      this.enableElementByCuentaOrigen();
      this.prestamoData = await this.getPrestamo(this.idPrestamo!);
      if (this.prestamoData) {
        let newDate = this.getShortDate(this.prestamoData.fechaCreacion!)

        this.prestamoForm.patchValue({
          titulo: this.prestamoData.titulo,
          fechaCreacion: new Date(newDate),
          cOrigen: this.prestamoData.cuentaOrigen?.sobre?.id,
          cBenefi: this.prestamoData.cuentaBeneficiario?.sobre?.id,
          montoAPrestar: this.prestamoData.monto,
          coutas: this.prestamoData.cuotas,
          interes: this.prestamoData.interes + '%',
          totAPagar: this.prestamoData.totAPagar
        })
        await this.getSaldoCuenta(this.prestamoData.cuentaOrigen?.sobre?.id!)

      }
    }
  }



  async getListSobres(): Promise<void> {
    this._sobreService.getSobres(this.username!).subscribe((sobre: ISobre[]) => {
      this.listSobre = sobre;
    });
  }

  setSaldoActual(): void {
    this.prestamoForm.get('cOrigen')?.valueChanges.subscribe(async (idSobre) => {
      if (idSobre != null) {
        let cuenta = await this.getCuentaByIdSobre(idSobre);
        this.maxMontoPrestar = cuenta.saldo!;
        if (cuenta) {
          this.prestamoForm.patchValue({
            saldoDisponibleOrigen: cuenta.saldo
          })
        }
        this.prestamoForm.get("montoAPrestar")?.enable();
        this.prestamoForm.get("coutas")?.enable();
      }

    })
  }

  async getSaldoCuenta(idSobre: number): Promise<void> {
    let cuenta = await this.getCuentaByIdSobre(idSobre);

    if (cuenta) {
      this.maxMontoPrestar = cuenta.saldo!;
      this.prestamoForm.patchValue({
        saldoDisponibleOrigen: cuenta.saldo
      })
    }
  }

  async getCuentaByIdSobre(idSobre: number): Promise<ICuenta> {
    try {
      const cuenta: ICuenta =
        await firstValueFrom(this._cuentaService.getCuentaByIdSobre(idSobre));
      return cuenta;
    } catch (error) {
      console.error('Error al buscar cuenta:', error);
      throw error;
    }
  }

  enableElementByCuentaOrigen(): void {
    this.prestamoForm.get('cOrigen')?.valueChanges.subscribe(async (cOrigen) => {
      this.prestamoForm.get("montoAPrestar")?.enable();
      this.prestamoForm.get("coutas")?.enable();
    })
  }

  setInteresYMonto(): void {
    this.prestamoForm.get('coutas')?.valueChanges.subscribe(async (idCuota) => {
      if (idCuota != null) {

        let interes: number = this.getInteresCoutasPay(idCuota);
        if (interes != null) {
          if (interes > 0) {
            this.prestamoForm.patchValue({
              interes: interes + '%'
            })
            let monto: number = this.prestamoForm.get("montoAPrestar")?.value
            if (monto != 0 && monto != null) {
              let porcentajeDecimal: number = interes / 100;
              let newMontoTotal: number = monto * (1 + porcentajeDecimal);
              let pagoMes: number = newMontoTotal / idCuota;
              this.prestamoForm.patchValue({
                totAPagar: Number(newMontoTotal.toFixed(0)),
                pagoPorMes: pagoMes
              })
            }
          } else if (interes == 0) {
            let monto: number = this.prestamoForm.get("montoAPrestar")?.value;
            if (monto != 0 && monto != null) {
              this.prestamoForm.patchValue({
                interes: null,
                totAPagar: Number(monto.toFixed(0)),
                pagoPorMes: monto
              })
            }
          }

        }
      }
    })

    this.prestamoForm.get('montoAPrestar')?.valueChanges.subscribe(async (nMonto) => {

      let idCuota: number = this.prestamoForm.get("coutas")?.value;
      let interes: number = this.getInteresCoutasPay(idCuota);
      if (interes != null) {

        if (interes > 0) {
          let porcentajeDecimal: number = interes / 100;
          let newMontoTotal: number = nMonto * (1 + porcentajeDecimal);
          let pagoMes: number = newMontoTotal / idCuota;
          this.prestamoForm.patchValue({
            totAPagar: Number(newMontoTotal.toFixed(0)),
            pagoPorMes: pagoMes
          })
        } else if (interes == 0) {
          if (nMonto != 0 && nMonto != null) {
            this.prestamoForm.patchValue({
              totAPagar: Number(nMonto.toFixed(0)),
              pagoPorMes: nMonto
            })
          }
        }
      }
    })
  }

  getDescriptionCoutasPay(id: number): string {
    return this.listCoutasPay.find(couta => couta.id === id)?.descripcion || 'sin descripcion';
  }

  getInteresCoutasPay(id: number): number {
    return this.listCoutasPay.find(couta => couta.id === id)?.interes || 0;
  }



  resetMessageError(): void {
    this.prestamoForm.get('pago')?.valueChanges.subscribe((newMonto) => {
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
    let msj = 'El prestamo se ha generado con éxito.';
    let idPrestamo = this.idPrestamo;
    if (idPrestamo != null) {
      this.prestamoData = await this.getPrestamo(this.idPrestamo!);
      msj = 'El prestamo se ha actualizado correctamente.';
    }

    const user: IUser = {
      id: null,
      username: this.username!
    }
    this.prestamoData.usuario = user;

    let titulo = this.prestamoForm.get("titulo")?.value;
    let fechaCreacion = this.prestamoForm.get("fechaCreacion")?.value;
    let cOrigen = this.prestamoForm.get("cOrigen")?.value;
    let cBenefi = this.prestamoForm.get("cBenefi")?.value;
    let montoAPrestar = this.prestamoForm.get("montoAPrestar")?.value;
    let coutas = this.prestamoForm.get("coutas")?.value;
    let totAPagar = this.prestamoForm.get("totAPagar")?.value;

    let cuentaOrigenData: ICuenta = await this.getCuentaByIdSobre(cOrigen);
    let cuentaBeneficiario: ICuenta = await this.getCuentaByIdSobre(cBenefi);

    this.cuentaOrigenData.id = cuentaOrigenData.id;
    this.cuentaDestinoData.id = cuentaBeneficiario.id
    this.prestamoData.titulo = titulo;
    this.prestamoData.fechaCreacion = fechaCreacion;
    this.prestamoData.cuentaOrigen = this.cuentaOrigenData;
    this.prestamoData.cuentaBeneficiario = this.cuentaDestinoData;
    this.prestamoData.monto = montoAPrestar;
    this.prestamoData.cuotas = coutas;
    this.prestamoData.interes = this.getInteresCoutasPay(coutas);
    this.prestamoData.totAPagar = totAPagar;
    this.prestamoData.saldoRest = totAPagar;
    this.prestamoData.totPag = 0;
    this.prestamoData.estado = false;
    this.prestamoData.fechaTotPagado = null;

    let detalle: IDetallePrestamo[] = [];
    this.prestamoData.detallePrestamo = detalle;

    let response!: IResponse;
    if (idPrestamo != null) {
      response = await this.update(this.idPrestamo!, this.prestamoData)
    } else {
      response = await this.save(this.prestamoData)
    }

    if (response) {
      this.showSuccess(msj, "Prestamo")
      this.spinnerHide();
      this.dialogRef.close();
    }

  }


  async update(idPrestamo: number, prestamo?: IPrestamo): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._prestamoService.updatePrestamo(idPrestamo, prestamo!));
      return response;
    } catch (error) {
      console.error('Error al actualizar el prestamo:', error);
      throw error;
    }
  }

  async save(prestamo?: IPrestamo): Promise<IResponse> {
    try {
      const response: any =
        await firstValueFrom(this._prestamoService.savePrestamo(prestamo!));
      return response;
    } catch (error) {
      console.error('Error al guardar el prestamo:', error);
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
    this.prestamoForm.reset();
    this.dialogRef.close();
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }
}
