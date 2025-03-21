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
import { Subscription, firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ILoginResponse } from '../../../../../models/login.models';
import { MetalId, IMetalCompra } from '../../../../../models/metales/metal-compra.models';
import { IResponse } from '../../../../../models/response.models';
import { MetalCompraApiService } from '../../../../../services/metales/metal-compra-api-service';
import { DataService } from '../../../../../shared/data.service';
import { IUser } from '../../../../../models/user.models';
import { LoginService } from '../../../../../services/login.service';
import { SpinnerComponent } from "../../../../../shared/spinner/spinner.component";


@Component({
  selector: 'app-metal-compra-form',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule, SpinnerComponent],
  templateUrl: './metal-compra-form.component.html',
  styleUrl: './metal-compra-form.component.css'
})
export class MetalCompraFormComponent implements OnInit {


  metalCompraForm!: FormGroup;
  _ApiService = inject(MetalCompraApiService);
  _DataService = inject(DataService);
  private suscripcion?: Subscription;
  private _toastr = inject(ToastrService)

  metalIdData: MetalId = {
    id: ''
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

  metalData: IMetalCompra = {
    metalId: null,
    nombre: '',
    precio: 0,
    fechaIni: new Date(),
    fechaFin: null,
    editadoPor: '',
    modificadoEl: null,
    usuario: null
  }

  title?: string;
  messageError: string | null = null;
  isLoading: boolean = false;
  
  spinnerShow(): void {
    this.isLoading = true
  }
  
    spinnerHide(): void {
    this.isLoading = false
  }
  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MetalCompraFormComponent>) {
    this.initForm();
    this.title = data.titulo;
    this.metalIdData.id = data.idMetal;
    this.isUserLogin();
  }

  ngOnInit(): void {
    if (this.metalIdData.id != null) {
      this.loadItemData(this.metalIdData);
    }

    this.resetMessageError();
  }

  initForm(): void {
    this.metalCompraForm = this.formBuilder.group(
      {
        id: [{ value: null, disabled: true }],
        nombre: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(3)]],
        precio: [{ value: 0, disabled: false }, Validators.required],
      }
    )
  }

  resetMessageError(): void {
    this.metalCompraForm.get('nombre')?.valueChanges.subscribe((newName) => {
      this.messageError = null;
    })
  }

  loadItemData(itemId: MetalId) {

    this._ApiService.getMetalCompra(itemId.id).subscribe((metal: IMetalCompra) => {
      this.metalCompraForm.patchValue({
        id: metal.metalId?.id,
        nombre: metal.nombre,
        precio: metal.precio,
        fechaIni: metal.fechaIni
      })
    });
  }

  async onSave() {
    this.spinnerShow();
    let usuario: IUser = {
      id: null,
      username: this.username!
    }

    this.metalIdData.id = this.metalCompraForm.get('id')?.value;
    this.metalData.metalId = this.metalIdData;
    this.metalData.nombre = this.metalCompraForm.get('nombre')?.value;
    this.metalData.precio = this.metalCompraForm.get('precio')?.value;
    this.metalData.editadoPor = this.username!;
    this.metalData!.usuario = usuario;
    let response!: IResponse;
    if (this.metalCompraForm.get('id')?.value != null) {
      this.metalData.modificadoEl = new Date;
      response = await this.update(this.metalData.metalId, this.metalData);
    } else {
      response = await this.saveMetalCompra(this.metalData);
    }

    if (response.idMessage == '201' ) {
      this.dialogRef.close();
      const metalId: MetalId = {
        id: ''
      }
      // this._DataService.setSelectedMetalCompraItemId(metalId);
      // this.suscripcion?.unsubscribe();
      this.showSuccess('Se ha guardado correctamente.', this.metalData.nombre)
      this.spinnerHide();
    } else if (response.idMessage == '409') {
      this.spinnerHide();
      this.messageError = 'El metal ya existe o su código coincide con uno existente.'
    } else {
      console.log("error " + response.message);
    }
  }

  async saveMetalCompra(metalCompra?: IMetalCompra): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._ApiService.saveMetalCompra(metalCompra!));
      return response;
    } catch (error) {
      console.error('Error al guardar saveMetalCompra:', error);
      throw error;
    }
  }

  async update(id: MetalId, metalCompra?: IMetalCompra): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(
          this._ApiService.updateMetalCompra(id.id,
            metalCompra!)
        );
      return response;
    } catch (error) {
      console.error('Error al actualizar updateMetalCompra:', error);
      throw error;
    }
  }

  cancel(): void {
    this.metalCompraForm.reset();
    this.suscripcion?.unsubscribe();
    this.dialogRef.close();
  }

  hasError(formControlName: string, typeError: string) {
    return this.metalCompraForm.get(formControlName)?.hasError(typeError) &&
      this.metalCompraForm.get(formControlName)?.touched;
  }
  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }

  ngOnDestroy(): void {
    const metalId: MetalId = {
      id: ''
    }
    this._DataService.setSelectedMetalCompraItemId(metalId);
    //investigar por que no se desuscribe
    this.suscripcion?.unsubscribe();
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
