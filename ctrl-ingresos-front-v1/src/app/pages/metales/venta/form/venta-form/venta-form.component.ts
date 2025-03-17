import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { Subscription, firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ILoginResponse } from '../../../../../models/login.models';
import { IVenta } from '../../../../../models/metales/venta.models';
import { IResponse } from '../../../../../models/response.models';
import { VentaService } from '../../../../../services/metales/venta.service';
import { DataService } from '../../../../../shared/data.service';
import { LoginService } from '../../../../../services/login.service';
import { IUser } from '../../../../../models/user.models';

@Component({
  selector: 'app-venta-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSlideToggleModule
  ],
  templateUrl: './venta-form.component.html',
  styleUrl: './venta-form.component.css'
})
export class VentaFormComponent implements OnInit {
  ventaForm!: FormGroup;
  _ApiVentaService = inject(VentaService);
  _DataService = inject(DataService);
  private suscripcion?: Subscription;
  private _toastr = inject(ToastrService)
  title?: string;
  idVenta: number | null = null;
  ventaData: IVenta = {
    id: 0,
    descripcion: '',
    fechaVenta: null,
    ventaIndividual: false,
    gananciaTotal: 0,
    editadoPor: null,
    modificadoEl: null,
    ticket: null,
    usuario: null
  };

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
    public dialogRef: MatDialogRef<VentaFormComponent>) {
    this.isUserLogin()
    this.initForm();
    this.title = data.titulo;
    this.idVenta = data.idVenta;
  }

  ngOnInit(): void {
    if (this.idVenta != null) {
      this.loadItemData(this.idVenta);
    } else {
      this.ventaForm.patchValue({
        fechaVenta: Date()
      })
    }
  }

  initForm(): void {
    this.ventaForm = this.formBuilder.group(
      {
        id: [{ value: null, disabled: true }],
        descripcion: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(3)]],
        fechaVenta: [{ value: '', disabled: false }, Validators.required],
        ventaIndividual: [{ value: '', disabled: false }]
      }
    )
  }

  async loadItemData(itemId: number) {

    const venta: IVenta = await this.getVenta(itemId);
    if (venta) {
      this.ventaForm.patchValue({
        id: venta.id,
        descripcion: venta.descripcion,
        fechaVenta: venta.fechaVenta,
        ventaIndividual: venta.ventaIndividual
      })
    }

  }

  async getVenta(itemId: number): Promise<IVenta> {
    try {
      const venta: IVenta =
        await firstValueFrom(this._ApiVentaService.getVenta(itemId));
      return venta;
    } catch (error) {
      console.error('Error al obtener el Venta:', error);
      throw error;
    }
  }

  async onSave() {

    let usuario: IUser = {
      id: null,
      username: this.username!
    }

    this.ventaData!.id = this.ventaForm.get("id")?.value;
    this.ventaData!.descripcion = this.ventaForm.get("descripcion")?.value;
    this.ventaData!.fechaVenta = this.ventaForm.get("fechaVenta")?.value;
    this.ventaData!.ventaIndividual = this.ventaForm.get("ventaIndividual")?.value;
    this.ventaData!.editadoPor = this.userLoginResponse.username;
    this.ventaData!.modificadoEl = new Date;
    this.ventaData.usuario = usuario;

    let response!: IResponse;
    if (this.ventaForm.get('id')?.value != null) {
      response = await this.update(this.ventaForm.get('id')?.value, this.ventaData)
    } else {
      response = await this.saveVenta(this.ventaData);
    }

    if (response) {
      this.showSuccess('Se ha guardado correctamente.', this.ventaData!.descripcion)
      this.dialogRef.close();
    }
  }


  async saveVenta(venta?: IVenta): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._ApiVentaService.saveVenta(venta!));
      return response;
    } catch (error) {
      console.error('Error al guardar venta:', error);
      throw error;
    }
  }

  async update(id: number, venta?: IVenta): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._ApiVentaService.updateVenta(id, venta!));
      return response;
    } catch (error) {
      console.error('Error al actualizar venta:', error);
      throw error;
    }
  }



  cancel(): void {
    this.ventaForm.reset();
    this.suscripcion?.unsubscribe();
    this.dialogRef.close();
  }

  hasError(formControlName: string, typeError: string) {
    return this.ventaForm.get(formControlName)?.hasError(typeError) &&
      this.ventaForm.get(formControlName)?.touched;
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
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
