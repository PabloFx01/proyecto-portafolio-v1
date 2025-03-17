import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators,FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatRadioModule,MatRadioGroup} from '@angular/material/radio';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { SobreService } from '../../../../../services/ctrlEfectivo/sobre.service';
import { DataService } from '../../../../../shared/data.service';
import { ISobre } from '../../../../../models/ctrlEfectivo/sobre.models';
import { LoginService } from '../../../../../services/login.service';
import { ILoginResponse } from '../../../../../models/login.models';
import { IResponse } from '../../../../../models/response.models';
import { IUser } from '../../../../../models/user.models';


@Component({
  selector: 'app-sobre-form',
  standalone: true,
  imports: [    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatRadioGroup,
    FormsModule],
  templateUrl: './sobre-form.component.html',
  styleUrl: './sobre-form.component.css'
})
export class SobreFormComponent implements OnInit{

  sobreForm!: FormGroup;
  _sobreService = inject(SobreService);
  _DataService = inject(DataService);
  private _toastr = inject(ToastrService)
  title?: string;
  idSobre: number | null = null;
  sobreData: ISobre = {
    id: null,
    descripcion: null,
    activo : false,
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
    public dialogRef: MatDialogRef<SobreFormComponent>) {
    this.isUserLogin();
    this.initForm();
    this.title = data.titulo;
    this.idSobre = data.idSobre;
  }

  ngOnInit(): void {
    if (this.idSobre != null) {
      this.loadItemData(this.idSobre);
    }
  }

  initForm(): void {
    this.sobreForm = this.formBuilder.group(
      {        
        descripcion: [{ value: null, disabled: false }, [Validators.required, Validators.minLength(3)]],       
      }
    )
  }

  async loadItemData(itemId: number) {

    const sobre: ISobre = await this.getSobre(itemId);
    if (sobre) {
      this.sobreForm.patchValue({
        descripcion: sobre.descripcion
      })
    }
  }

  async getSobre(itemId: number): Promise<ISobre> {
    try {
      const sobre: ISobre =
        await firstValueFrom(this._sobreService.getSobre(itemId));
      return sobre;
    } catch (error) {
      console.error('Error al obtener el sobre:', error);
      throw error;
    }
  }

  async onSave() {    
    
    this.sobreData!.descripcion = this.sobreForm.get("descripcion")?.value;
       

    let response!: IResponse;
    const user: IUser = {
      id: null,
      username: this.username!
    }
    
    this.sobreData!.usuario = user;
    if (this.idSobre != null) {
      response = await this.update(this.idSobre, this.sobreData)
    } else {
      response = await this.saveSobre(this.sobreData);
    }

    if (response) {
      this.showSuccess('Se ha guardado correctamente.', this.sobreData!.descripcion!)
      this.dialogRef.close();
    }
  }


  async saveSobre(sobre?: ISobre): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._sobreService.saveSobreXCuenta(sobre!));
      return response;
    } catch (error) {
      console.error('Error al guardar sobre:', error);
      throw error;
    }
  }

  async update(id: number, sobre?: ISobre): Promise<IResponse> {    
    try {
      const response: IResponse =
        await firstValueFrom(this._sobreService.updateSobre(id, sobre!));
      return response;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }



  cancel(): void {
    this.sobreForm.reset();
    this.dialogRef.close();
  }

  hasError(formControlName: string, typeError: string) {
    return this.sobreForm.get(formControlName)?.hasError(typeError) &&
      this.sobreForm.get(formControlName)?.touched;
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
