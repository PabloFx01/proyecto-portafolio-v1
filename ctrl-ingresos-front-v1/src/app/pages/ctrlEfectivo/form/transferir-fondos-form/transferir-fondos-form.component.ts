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
import { TransaccionService } from '../../../../services/ctrlEfectivo/transaccion.service';
import { ISobre } from '../../../../models/ctrlEfectivo/sobre.models';
import { ICuenta } from '../../../../models/ctrlEfectivo/cuenta.models';
import { IMovimiento } from '../../../../models/ctrlEfectivo/movimiento.models';
import { ITransaccion } from '../../../../models/ctrlEfectivo/transaccion.models';
import { IResponse } from '../../../../models/response.models';
import { ILoginResponse } from '../../../../models/login.models';
import { LoginService } from '../../../../services/login.service';
import { IUser } from '../../../../models/user.models';


@Component({
  selector: 'app-transferir-fondos-form',
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
  templateUrl: './transferir-fondos-form.component.html',
  styleUrl: './transferir-fondos-form.component.css'
})
export class TransferirFondosFormComponent implements OnInit {
  transferirFondosForm!: FormGroup;
  _sobreService = inject(SobreService);
  _DataService = inject(DataService);
  _cuentaService = inject(CuentaService);
  _movimientoService = inject(MovimientoService);
  _transaccionService = inject(TransaccionService);
  private _toastr = inject(ToastrService)
  title?: string;

  listSobre: ISobre[] = [];
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

  movimientoData: IMovimiento = {
    id: null,
    tipoMovimiento: '',
    cuenta: this.cuentaOrigenData,
    fecha: new Date,
    monto: 0,
    comentario: '',
    transaccion : null,
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
    public dialogRef: MatDialogRef<TransferirFondosFormComponent>) {
    this.isUserLogin();  
    this.initForm();
    this.title = data.titulo;
  }

  ngOnInit(): void {
    this.getListSobres();
    this.setSaldoActual();
    this.resetMessageError();

  }

  initForm(): void {
    this.transferirFondosForm = this.formBuilder.group(
      {
        sobreOrigen: [{ value: '', disabled: false }, [Validators.required]],
        saldoActual: [{ value: '', disabled: true }],
        sobreDestino: [{ value: '', disabled: false }, [Validators.required]],
        monto: [{ value: null, disabled: false }, [Validators.required]],
        comentario: [{ value: '', disabled: false }]
      }
    )
  }

  setSaldoActual(): void {
    this.transferirFondosForm.get('sobreOrigen')?.valueChanges.subscribe(async (idSobre) => {
      if (idSobre != null) {
        let cuenta = await this.getCuentaByIdSobre(idSobre);
        if (cuenta) {
          this.transferirFondosForm.patchValue({
            saldoActual: cuenta.saldo
          })
        }
      }
    })
  }

  resetMessageError(): void {
    this.transferirFondosForm.get('monto')?.valueChanges.subscribe((newMonto) => {
      this.messageError = null;
    })
  }

  getListSobres(): void {
    this._sobreService.getSobres(this.username!).subscribe((sobre: ISobre[]) => {
      this.listSobre = sobre;
    });
  }



  async onSave() {
    const user: IUser = {
      id: null,
      username: this.username!
    }
    
    let idSobreOrigen = this.transferirFondosForm.get("sobreOrigen")?.value;
    let cuentaOrigen = await this.getCuentaByIdSobre(idSobreOrigen);
    this.messageError = null;
    if (cuentaOrigen) {
      //Actualiza cuenta
      let monto = this.transferirFondosForm.get("monto")?.value;
      let saldoActual: number = cuentaOrigen.saldo!;
      let nuevoSaldo: number = saldoActual - monto;
      if (nuevoSaldo < 0) {
        this.messageError = 'El saldo que intenta transferir es mayor al disponible, intente otro monto.'
      }
      if (this.messageError == null) {
        //Actualizar cuenta origen
        // this.cuentaData.saldo = monto;
        // this.cuentaData.id = cuenta.id;
        // this.sobreData.id = idSobre!;
        // this.sobreData!.usuario = user;
        // this.cuentaData.sobre = this.sobreData;
        
        this.cuentaOrigenData.saldo = monto;
        this.cuentaOrigenData.id = null;
        this.sobreDataOrigen.id = idSobreOrigen;
        this.sobreDataOrigen.usuario = user;
        this.cuentaOrigenData.sobre = this.sobreDataOrigen;

        let responseCuenta = await this.updateCuentaRestFondo(idSobreOrigen, this.cuentaOrigenData)
        if (responseCuenta) {
          //Actualizar cuenta destino
          let idSobreDestino = this.transferirFondosForm.get("sobreDestino")?.value;

          // let cuentaDestino = await this.getCuentaByIdSobre(idSobreDestino);
          // if (cuentaDestino) {
          //   let saldoActualDestino: number = cuentaDestino.saldo!;
          //   let nuevoSaldoDestino: number = saldoActualDestino + monto;
          this.cuentaDestinoData.saldo = monto;
          this.cuentaDestinoData.id = null;
          this.sobreDataDestino.id = idSobreDestino;
          this.sobreDataDestino.usuario = user;
          this.cuentaDestinoData.sobre = this.sobreDataDestino;

            let responseCuentaDestino = await this.updateCuenta(idSobreDestino, this.cuentaDestinoData)
            if (responseCuentaDestino) {
              //Crea transaccion
              this.transaccionData.cuentaOrigen = this.cuentaOrigenData;
              this.transaccionData.cuentaDestino = this.cuentaDestinoData;
              this.transaccionData.fecha = new Date();
              this.transaccionData.cantidad = monto;

              //Crea movimiento
              const tipoMovimiento = 'Transferir fondo';
              this.movimientoData.usuario = user;
              this.movimientoData.fecha = new Date();
              this.movimientoData.cuenta = this.cuentaOrigenData;
              this.movimientoData.tipoMovimiento = tipoMovimiento;
              this.movimientoData.monto = monto;
              this.movimientoData.comentario = this.transferirFondosForm.get("comentario")?.value;
              this.movimientoData.transaccion = this.transaccionData;
             // this.movimientoData.transaccion = null;

              let responseMovimiento = await this.saveMovimiento(this.movimientoData);
              if (responseMovimiento) {
                this.showSuccess('Se ha guardado correctamente.', tipoMovimiento)
                this.dialogRef.close();
              }

            }
          }
        // }
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
      await firstValueFrom(this._movimientoService.saveMovimientoWhithTransaccion(movimiento!));
      return response;
    } catch (error) {
      console.error('Error al guardar Movimiento:', error);
      throw error;
    }
  }

  async saveTransaccion(transaccion?: ITransaccion): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._transaccionService.saveTransaccion(transaccion!));
      return response;
    } catch (error) {
      console.error('Error al guardar Transaccion:', error);
      throw error;
    }
  }

  async getTransaccion(idTransaccion: number): Promise<ITransaccion> {
    try {
      const transaccion: ITransaccion =
        await firstValueFrom(this._transaccionService.getTransaccion(idTransaccion));
      return transaccion;
    } catch (error) {
      console.error('Error al buscar tranaccion:', error);
      throw error;
    }
  }

  async updateCuenta(id: number, cuenta: ICuenta): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._cuentaService.updateCuenta(id, cuenta!));
      return response;
    } catch (error) {
      console.error('Error al actualizar cuenta:', error);
      throw error;
    }
  }
  async updateCuentaRestFondo(id: number, cuenta: ICuenta): Promise<IResponse> {
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
    this.transferirFondosForm.reset();
    this.dialogRef.close();
  }

  hasError(formControlName: string, typeError: string) {
    return this.transferirFondosForm.get(formControlName)?.hasError(typeError) &&
      this.transferirFondosForm.get(formControlName)?.touched;
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
