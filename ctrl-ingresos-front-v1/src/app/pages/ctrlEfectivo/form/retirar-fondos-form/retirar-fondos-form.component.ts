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
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatSelectModule } from '@angular/material/select';
import { SobreService } from '../../../../services/ctrlEfectivo/sobre.service';
import { DataService } from '../../../../shared/data.service';
import { CuentaService } from '../../../../services/ctrlEfectivo/cuenta.service';
import { MovimientoService } from '../../../../services/ctrlEfectivo/movimiento.service';
import { ISobre } from '../../../../models/ctrlEfectivo/sobre.models';
import { ICuenta } from '../../../../models/ctrlEfectivo/cuenta.models';
import { IMovimiento } from '../../../../models/ctrlEfectivo/movimiento.models';
import { IResponse } from '../../../../models/response.models';
import { LoginService } from '../../../../services/login.service';
import { ILoginResponse } from '../../../../models/login.models';
import { IUser } from '../../../../models/user.models';

@Component({
  selector: 'app-retirar-fondos-form',
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
    MatSelectModule
  ],
  templateUrl: './retirar-fondos-form.component.html',
  styleUrl: './retirar-fondos-form.component.css'
})
export class RetirarFondosFormComponent implements OnInit {
  retirarFondosForm!: FormGroup;
  _sobreService = inject(SobreService);
  _DataService = inject(DataService);
  _cuentaService = inject(CuentaService);
  _movimientoService = inject(MovimientoService);
  private _toastr = inject(ToastrService)
  title?: string;

  listSobre: ISobre[] = [];
  sobreData: ISobre = {
    id: 0,
    descripcion: '',
    usuario: null
  };

  cuentaData: ICuenta = {
    id: 0,
    saldo: 0,
    sobre: this.sobreData
  };

  movimientoData: IMovimiento = {
    id: null,
    tipoMovimiento: '',
    cuenta: this.cuentaData,
    fecha: new Date,
    monto: 0,
    comentario: '',
    transaccion: null,
    usuario: null
  }

  messageError: string | null = null;
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
    public dialogRef: MatDialogRef<RetirarFondosFormComponent>) {
    this.isUserLogin();
    this.initForm();
    this.title = data.titulo;
  }

  ngOnInit(): void {
    this.getListSobres();
    this.setSaldoActual();
    this.resetMessageError();

  }

  setSaldoActual(): void {
    this.retirarFondosForm.get('sobre')?.valueChanges.subscribe(async (idSobre) => {
      if (idSobre != null) {
        let cuenta = await this.getCuentaByIdSobre(idSobre);
        if (cuenta) {
          this.retirarFondosForm.patchValue({
            saldoActual: cuenta.saldo
          })
        }
      }
    })
  }

  resetMessageError(): void {
    this.retirarFondosForm.get('monto')?.valueChanges.subscribe((newMonto) => {
      this.messageError = null;
    })
  }

  getListSobres(): void {
    this._sobreService.getSobres(this.username!).subscribe((sobre: ISobre[]) => {
      this.listSobre = sobre;
    });
  }

  initForm(): void {
    this.retirarFondosForm = this.formBuilder.group(
      {
        monto: [{ value: null, disabled: false }, [Validators.required]],
        sobre: [{ value: '', disabled: false }, [Validators.required]],
        saldoActual: [{ value: '', disabled: true }],
        comentario: [{ value: '', disabled: false }]
      }
    )
  }

  async onSave() {
    const user: IUser = {
      id: null,
      username: this.username!
    }
    
    let idSobre = this.retirarFondosForm.get("sobre")?.value;
    let cuenta = await this.getCuentaByIdSobre(idSobre);
    this.messageError = null;
    if (cuenta) {
      //Actualiza cuenta
      let monto = this.retirarFondosForm.get("monto")?.value;
      let saldoActual: number = cuenta.saldo!;
      let nuevoSaldo: number = saldoActual - monto;
      if (nuevoSaldo < 0) {
        this.messageError = 'El saldo que intenta retirar es mayor al disponible, intente otro monto.'
      }
      if (this.messageError == null) {
        // this.cuentaData = cuenta;
        // this.cuentaData.saldo = nuevoSaldo;
        this.cuentaData.saldo = monto;
        this.cuentaData.id = cuenta.id;
        this.sobreData.id = idSobre!;
        this.sobreData!.usuario = user;
        this.cuentaData.sobre = this.sobreData;

        let responseCuenta = await this.updateCuenta(idSobre, this.cuentaData)
        if (responseCuenta) {

          //Crea movimiento
          const tipoMovimiento = 'Retirar fondo';
          this.movimientoData.usuario = user;
          this.movimientoData.fecha = new Date();
          this.movimientoData.cuenta = this.cuentaData;
          this.movimientoData.tipoMovimiento = tipoMovimiento;
          this.movimientoData.monto = monto;
          this.movimientoData.comentario = this.retirarFondosForm.get("comentario")?.value;

          let responseMovimiento = await this.saveMovimiento(this.movimientoData);
          if (responseMovimiento) {
            this.showSuccess('Se ha guardado correctamente.', tipoMovimiento)
            this.dialogRef.close();
          }

        }
      }
    }
  }

  getLongDate(): string {
    let ahora = new Date();
    let fechaActual = ahora.getFullYear() + '-'
      + ('0' + (ahora.getMonth() + 1)).slice(-2) + '-'
      + ('0' + ahora.getDate()).slice(-2) + ' '
      + ('0' + ahora.getHours()).slice(-2) + ':'
      + ('0' + ahora.getMinutes()).slice(-2);
    return fechaActual;
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


  async saveMovimiento(movimiento?: IMovimiento): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._movimientoService.saveMovimiento(movimiento!));
      return response;
    } catch (error) {
      console.error('Error al guardar Movimiento:', error);
      throw error;
    }
  }

  async updateCuenta(id: number, cuenta: ICuenta): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._cuentaService.updateCuentaRetirarFondo(id, cuenta!));
      return response;
    } catch (error) {
      console.error('Error al actualizar cuenta:', error);
      throw error;
    }
  }



  cancel(): void {
    this.retirarFondosForm.reset();
    this.dialogRef.close();
  }

  hasError(formControlName: string, typeError: string) {
    return this.retirarFondosForm.get(formControlName)?.hasError(typeError) &&
      this.retirarFondosForm.get(formControlName)?.touched;
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
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
