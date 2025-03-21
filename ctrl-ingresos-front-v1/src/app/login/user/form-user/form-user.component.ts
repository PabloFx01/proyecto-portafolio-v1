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
import { UserService } from '../../../services/user.service';
import { DataService } from '../../../shared/data.service';
import { IUser } from '../../../models/user.models';
import { IResponse } from '../../../models/response.models';
import { SpinnerComponent } from "../../../shared/spinner/spinner.component";

@Component({
  selector: 'app-form-user',
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
    SpinnerComponent
],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.css'
})
export class FormUserComponent implements OnInit{
  userForm!: FormGroup;
  _userService = inject(UserService);
  _DataService = inject(DataService);
  private _toastr = inject(ToastrService)
  title?: string;
  idUser: number | null = null;
  userData: IUser = {
    id: 0,
    username: '',
    role: '',
    password: ''
  };
  chosenRole!: string;
  roles: string[] = ['ADMIN', 'USER', 'METAL_APP'];
  isLoading: boolean = false;
  
  spinnerShow(): void {
    this.isLoading = true
  }
  
    spinnerHide(): void {
    this.isLoading = false
  }
  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormUserComponent>) {
    this.initForm();
    this.title = data.titulo;
    this.idUser = data.idUser;
  }

  ngOnInit(): void {
    if (this.idUser != null) {
      this.loadItemData(this.idUser);
    }
  }

  initForm(): void {
    this.userForm = this.formBuilder.group(
      {
        id: [{ value: null, disabled: true }],
        username: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(3)]],
        password: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(3)]],
        role: [{ value: '', disabled: false }, Validators.required]
      }
    )
  }

  async loadItemData(itemId: number) {

    const user: IUser = await this.getUser(itemId);
    if (user) {
      this.userForm.patchValue({
        id: user.id,
        username: user.username,
        password: user.password,
        role: user.role
      })
    }
  }

  async getUser(itemId: number): Promise<IUser> {
    try {
      const user: IUser =
        await firstValueFrom(this._userService.getUser(itemId));
      return user;
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      throw error;
    }
  }

  async onSave() {    
    this.spinnerShow();
    this.userData!.id = this.userForm.get("id")?.value;
    this.userData!.username = this.userForm.get("username")?.value;
    this.userData!.password = this.userForm.get("password")?.value;
    this.userData!.role = this.userForm.get("role")?.value;  

    let response!: IResponse;
    if (this.userForm.get('id')?.value != null) {
      response = await this.update(this.userForm.get('id')?.value, this.userData)
    } else {
      response = await this.saveUser(this.userData);
    }

    if (response) {
      this.showSuccess('Se ha guardado correctamente.', this.userData!.username)
      this.spinnerHide();
      this.dialogRef.close();
    }
  }


  async saveUser(user?: IUser): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._userService.saveUser(user!));
      return response;
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      throw error;
    }
  }

  async update(id: number, user?: IUser): Promise<IResponse> {    
    try {
      const response: IResponse =
        await firstValueFrom(this._userService.updateUser(id, user!));
      return response;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }



  cancel(): void {
    this.userForm.reset();
    this.dialogRef.close();
  }

  hasError(formControlName: string, typeError: string) {
    return this.userForm.get(formControlName)?.hasError(typeError) &&
      this.userForm.get(formControlName)?.touched;
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }


}
