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
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ILoginResponse } from '../../../../../models/login.models';
import { ICompra } from '../../../../../models/metales/compra.models';
import { IResponse } from '../../../../../models/response.models';
import { CompraService } from '../../../../../services/metales/compra.service';
import { DataService } from '../../../../../shared/data.service';
import { LoginService } from '../../../../../services/login.service';
import { IUser } from '../../../../../models/user.models';

@Component({
  selector: 'app-compra-form',
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
  templateUrl: './compra-form.component.html',
  styleUrl: './compra-form.component.css'
})
export class CompraFormComponent implements OnInit {
  compraForm!: FormGroup;
  _ApiCompraService = inject(CompraService);
  _DataService = inject(DataService);
  private _toastr = inject(ToastrService)
  title?: string;
  idCompra: number | null = null;
  compraData: ICompra = {
    id: null,
    fechaCompra: new Date(),
    totalComprado: 0,
    cierre: false,
    venta: null,
    editadoPor: '',
    detalleCompra: [],
    modificadoEl: null,
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
    public dialogRef: MatDialogRef<CompraFormComponent>) {
    this.isUserLogin();
    this.initForm();
    this.title = data.titulo;
    this.idCompra = data.idItem;
  }

  ngOnInit(): void {
    if (this.idCompra != null) {
      this.loadItemData(this.idCompra);
    }
    this.getUsuario();
  }

  initForm(): void {
    this.compraForm = this.formBuilder.group(
      {
        id: [{ value: null, disabled: true }],
        ficticio: [{ value: null, disabled: false }],
        comentario: [{ value: null, disabled: false }],
        fechaCompra: [{ value: new Date(), disabled: false }, Validators.required]
      }
    )
  }

  getUsuario(): void {
    this._DataService.userLoginData$.subscribe(
      (userLoginResponse: ILoginResponse) => {
        if (userLoginResponse) {
          this.userLoginResponse = userLoginResponse;
        }
      })
  }

  async loadItemData(itemId: number) {

    const compra: ICompra = await this.getCompra(itemId);
    if (compra) {
      console.log("id" + compra.id);
      console.log("fecha" + compra.fechaCompra);
      console.log("fecha format" + this.getShortDate(compra.fechaCompra));

      let nuevaFecha = this.getShortDate(compra.fechaCompra)
      this.compraForm.patchValue({
        id: compra.id,
        ficticio: compra.ficticio,
        comentario: compra.comentario,
        fechaCompra: new Date(nuevaFecha)
      })
    }

  }

  getShortDate(fecha: Date): string {
    let ahora = new Date(fecha);
    let fechaActual = ahora.getFullYear() + '-'
      + ('0' + (ahora.getMonth() + 1)).slice(-2) + '-'
      + ('0' + ahora.getDate()).slice(-2) + ' '
    return fechaActual;
  }

  async getCompra(itemId: number): Promise<ICompra> {
    try {
      const compra: ICompra =
        await firstValueFrom(this._ApiCompraService.getCompra(itemId));
      return compra;
    } catch (error) {
      console.error('Error al obtener la compra:', error);
      throw error;
    }
  }


  async onSave() {
    let usuario: IUser = {
      id: null,
      username: this.username!
    }
    let msj = 'Se ha creado correctamente.';
    let idCompra = this.compraForm.get("id")?.value;
    if (idCompra != null) {
      this.compraData! = await this.getCompra(idCompra);
      msj = 'Se ha actualizado correctamente.';
    }
    this.compraData!.fechaCompra = this.compraForm.get("fechaCompra")?.value;
    this.compraData!.comentario = this.compraForm.get("comentario")?.value;
    this.compraData!.ficticio = this.compraForm.get("ficticio")?.value;
    this.compraData!.editadoPor = this.username!;
    this.compraData.usuario = usuario;
    let response!: IResponse;
    if (idCompra != null) {
      response = await this.update(idCompra, this.compraData)
    } else {
      response = await this.save(this.compraData)
    }

    if (response) {
      this.showSuccess(msj, "Compra")
      this.dialogRef.close();
    }

  }

  async update(id: number, compra?: ICompra): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._ApiCompraService.updateCompra(id, compra!));
      return response;
    } catch (error) {
      console.error('Error al actualizar compra:', error);
      throw error;
    }
  }

  async save(compra: ICompra): Promise<IResponse> {
    try {
      const response: any =
        await firstValueFrom(this._ApiCompraService.saveCompra(compra));
      return response;
    } catch (error) {
      console.error('Error al obtener el detalleId:', error);
      throw error;
    }
  }

  cancel(): void {
    this.compraForm.reset();
    this.dialogRef.close();
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
