import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule, MatRadioGroup } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { firstValueFrom } from 'rxjs';
import { LoginService } from '../../../../services/login.service';
import { ILoginResponse } from '../../../../models/login.models';
import { SobreService } from '../../../../services/ctrlEfectivo/sobre.service';
import { DataService } from '../../../../shared/data.service';
import { CuentaService } from '../../../../services/ctrlEfectivo/cuenta.service';
import { MovimientoService } from '../../../../services/ctrlEfectivo/movimiento.service';
import { TransaccionService } from '../../../../services/ctrlEfectivo/transaccion.service';
import { ISobre } from '../../../../models/ctrlEfectivo/sobre.models';
import { ICuenta } from '../../../../models/ctrlEfectivo/cuenta.models';
import { IMovimiento } from '../../../../models/ctrlEfectivo/movimiento.models';
import { ITransaccion } from '../../../../models/ctrlEfectivo/transaccion.models';

@Component({
  selector: 'app-detalle-movimiento-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatRadioGroup,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule
  ],
  templateUrl: './detalle-movimiento-form.component.html',
  styleUrl: './detalle-movimiento-form.component.css'
})
export class DetalleMovimientoFormComponent implements OnInit {
  detalleForm!: FormGroup;
  _sobreService = inject(SobreService);
  _DataService = inject(DataService);
  _cuentaService = inject(CuentaService);
  _movimientoService = inject(MovimientoService);
  _transaccionService = inject(TransaccionService);

  title?: string;
  paramIdMovimiento: number = 0;

  listSobre: ISobre[] = [];
  sobreData: ISobre = {
    id: 0,
    descripcion: '',
    usuario: null
  };

  cuentaOrigenData: ICuenta = {
    id: 0,
    saldo: 0,
    sobre: this.sobreData
  };

  cuentaDestinoData: ICuenta = {
    id: 0,
    saldo: 0,
    sobre: this.sobreData
  };

  movimientoData: IMovimiento = {
    id: null,
    tipoMovimiento: '',
    cuenta: this.cuentaOrigenData,
    fecha: new Date(),
    monto: 0,
    comentario: '',
    transaccion: null,
    usuario: null
  }

  transaccionData: ITransaccion = {
    id: null,
    tipoTransaccion: 'Algo',
    cantidad: 0,
    fecha: new Date(),
    cuentaOrigen: this.cuentaOrigenData,
    cuentaDestino: this.cuentaDestinoData
  }

  loginServices = inject(LoginService);

  username: string | null = '';
  role: String | null = '';
  userLoginOn: boolean = false;

  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }


  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DetalleMovimientoFormComponent>) {
    this.isUserLogin();
    this.initForm();
    this.title = data.titulo;
    this.paramIdMovimiento = data.id;
  }

  ngOnInit(): void {
    this.getListSobres();
    this.loadItem();
  }

  async loadItem(): Promise<void> {
    let movimiento: IMovimiento = await this.getMovimiento(this.paramIdMovimiento);
    if (movimiento) {
      this.movimientoData = movimiento;

      this.detalleForm.patchValue({
        fecha: this.getShortDate(this.movimientoData.fecha),
        tipoMovimiento: this.movimientoData.tipoMovimiento,
        monto: this.movimientoData.monto,
        sobre: this.movimientoData.cuenta.sobre!.id,
        sobreDestino: this.movimientoData.transaccion?.cuentaDestino.sobre!.id,
        comentario: this.movimientoData.comentario
      })
    }
  }

  async getMovimiento(idMovimiento: number): Promise<IMovimiento> {
    try {
      const movimiento: IMovimiento =
        await firstValueFrom(this._movimientoService.getMovimiento(idMovimiento));
      return movimiento;
    } catch (error) {
      console.error('Error al buscar movimiento:', error);
      throw error;
    }
  }

  initForm(): void {
    this.detalleForm = this.formBuilder.group(
      {
        fecha: [{ value: null, disabled: true }],
        tipoMovimiento: [{ value: '', disabled: true }],
        monto: [{ value: null, disabled: true }],
        sobre: [{ value: '', disabled: true }],
        sobreDestino: [{ value: '', disabled: true }],
        comentario: [{ value: '', disabled: true }]
      }
    )
  }

  getListSobres(): void {
    this._sobreService.getSobres(this.username!).subscribe((sobre: ISobre[]) => {
      this.listSobre = sobre;
    });
  }

  getShortDate(fecha: Date): string {
    let ahora = new Date(fecha);
    let fechaActual = ahora.getFullYear() + '-'
      + ('0' + (ahora.getMonth() + 1)).slice(-2) + '-'
      + ('0' + ahora.getDate()).slice(-2) + ' '
    return fechaActual;
  }



  cancel(): void {
    this.detalleForm.reset();
    this.dialogRef.close();
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
