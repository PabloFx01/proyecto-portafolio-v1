import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { DataService } from '../../../shared/data.service';
import { IUser, IUserChangePass } from '../../../models/user.models';
import { ILoginResponse } from '../../../models/login.models';
import { IResponse } from '../../../models/response.models';
import { LoginService } from '../../../services/login.service';
import { NavPrestamoComponent } from "../../nav/nav-login.component";
import { SpinnerComponent } from "../../../shared/spinner/spinner.component";

@Component({
  selector: 'app-form-user-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    FormsModule,
    NavPrestamoComponent,
    RouterOutlet,
    SpinnerComponent
],
  templateUrl: './form-user-password.component.html',
  styleUrl: './form-user-password.component.css'
})
export class FormUserPasswordComponent implements OnInit {
  userForm!: FormGroup;
  _userService = inject(UserService);
  _DataService = inject(DataService);
  router = inject(Router)
  private _toastr = inject(ToastrService)
  title?: string;
  idUser: number | null = null;
  messageError: string | null = null;
  userData: IUser = {
    id: 0,
    username: '',
    role: '',
    password: ''
  };

  userChangeData: IUserChangePass = {
    username: '',
    oldPassword: '',
    newPassword: ''
  };

  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }

  userLoginOn: boolean = false;
  username: String | null = '';
  role: String | null = '';
  isLoading: boolean = false;
  
  spinnerShow(): void {
    this.isLoading = true
  }
  
    spinnerHide(): void {
    this.isLoading = false
  }
  constructor(private formBuilder: FormBuilder, private loginServices: LoginService) {
    this.initForm();
  }

  ngOnInit(): void {
    this.isUserLogin();
    console.log("userLoginOn " + this.userLoginOn);
    console.log("username " + this.username);

    this.loadItemData();

    this.userForm.get('oldPassword')?.valueChanges.subscribe((oldPass) => {

      this.messageError = null;
    })

  }

  initForm(): void {
    this.userForm = this.formBuilder.group(
      {
        username: [{ value: '', disabled: true }],
        oldPassword: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(3)]],
        newPassword: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(3)]]
      }
    )
  }

  loadItemData() {
    if (this.userLoginOn) {
      this.userForm.patchValue({
        username: this.username
      })
    }
  }

  getUserData(): void {
    this._DataService.userLoginData$.subscribe(
      (userLoginResponse: ILoginResponse) => {
        if (userLoginResponse) {
          this.userLoginResponse = userLoginResponse;
        }

      })
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


  async onSave() {
    this.spinnerShow();
    this.messageError = null;
    this.userChangeData!.username = this.userForm.get("username")?.value;
    this.userChangeData!.oldPassword = this.userForm.get("oldPassword")?.value;
    this.userChangeData!.newPassword = this.userForm.get("newPassword")?.value;

    let response!: IResponse;
    response = await this.saveUser(this.userChangeData);

    if (response.idMessage == '501') {
      this.messageError = response.message;
      this.spinnerHide();
    } else {

      this.showSuccess('Se ha guardado correctamente.', 'Password')
      this.spinnerHide();
      this.router.navigateByUrl('/home')
    }
  }


  async saveUser(userChangeData: IUserChangePass): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._userService.changePass(userChangeData));
      return response;
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      throw error;
    }
  }


  hasError(formControlName: string, typeError: string) {
    return this.userForm.get(formControlName)?.hasError(typeError) &&
      this.userForm.get(formControlName)?.touched;
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }


}
