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
import { SpinnerComponent } from "../../../../shared/spinner/spinner.component";


@Component({
  selector: 'app-agregar-fondo-form',
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
    SpinnerComponent
  ],
  templateUrl: './agregar-fondo-form.component.html',
  styleUrl: './agregar-fondo-form.component.css'
})
export class AgregarFondoFormComponent implements OnInit {
  agregarFondosForm!: FormGroup;
  _sobreService = inject(SobreService);
  _DataService = inject(DataService);
  _cuentaService = inject(CuentaService);
  _movimientoService = inject(MovimientoService);
  private _toastr = inject(ToastrService)
  title?: string;

  isLoading: boolean = false;

  spinnerShow(): void {
    this.isLoading = true
  }

  spinnerHide(): void {
    this.isLoading = false
  }

  listSobre: ISobre[] = [];
  sobreData: ISobre = {
    id: null,
    descripcion: null,
    activo: false,
    usuario: null
  };

  cuentaData: ICuenta = {
    id: null,
    saldo: null,
    sobre: null
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
    public dialogRef: MatDialogRef<AgregarFondoFormComponent>) {
    this.isUserLogin();
    this.initForm();
    this.title = data.titulo;

  }

  ngOnInit(): void {
    this.getListSobres();
  }

  getListSobres(): void {
    this._sobreService.getSobres(this.username!).subscribe((sobre: ISobre[]) => {
      this.listSobre = sobre;
    });
  }



  initForm(): void {
    this.agregarFondosForm = this.formBuilder.group(
      {
        monto: [{ value: null, disabled: false }, [Validators.required]],
        sobre: [{ value: null, disabled: false }, [Validators.required]],
        comentario: [{ value: '', disabled: false }]
      }
    )
  }

  async onSave() {
    this.spinnerShow();
    const user: IUser = {
      id: null,
      username: this.username!
    }

    let idSobre = this.agregarFondosForm.get("sobre")?.value;

    let monto = this.agregarFondosForm.get("monto")?.value;

    this.cuentaData.saldo = monto;
    this.cuentaData.id = null;
    this.sobreData.id = idSobre!;
    this.sobreData!.usuario = user;
    this.cuentaData.sobre = this.sobreData;


    let responseCuenta = await this.updateCuenta(idSobre, this.cuentaData)
    if (responseCuenta) {

      //Crea movimiento
      const tipoMovimiento = 'Agregar fondo';
      this.movimientoData.usuario = user;
      this.movimientoData.fecha = new Date();
      this.movimientoData.cuenta = this.cuentaData;
      this.movimientoData.tipoMovimiento = tipoMovimiento;
      this.movimientoData.monto = monto;
      this.movimientoData.comentario = this.agregarFondosForm.get("comentario")?.value;

      let responseMovimiento = await this.saveMovimiento(this.movimientoData);
      if (responseMovimiento) {
        this.showSuccess('Se ha guardado correctamente.', tipoMovimiento)
        this.spinnerHide();
        this.dialogRef.close();
        
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
        await firstValueFrom(this._cuentaService.updateCuenta(id, cuenta!));
      return response;
    } catch (error) {
      console.error('Error al actualizar cuenta:', error);
      throw error;
    }
  }



  cancel(): void {
    this.agregarFondosForm.reset();
    this.dialogRef.close();
  }

  hasError(formControlName: string, typeError: string) {
    return this.agregarFondosForm.get(formControlName)?.hasError(typeError) &&
      this.agregarFondosForm.get(formControlName)?.touched;
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
