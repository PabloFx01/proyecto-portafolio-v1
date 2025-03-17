import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

import { Subscription, firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../services/login.service';
import { DataService } from '../shared/data.service';
import { ILogin, ILoginResponse } from '../models/login.models';
import { NavPrestamoComponent } from "./nav/nav-login.component";



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule, NavPrestamoComponent, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup;
  _ApiLoginService = inject(LoginService);
  _DataService = inject(DataService);
  private _toastr = inject(ToastrService)
  private router = inject(Router);
  loginError: string = "";
  title?: string;
  messageError: string | null = null;
  localStorage: Storage | undefined;
  private localStorageUsername = 'username';
  private localStorageRole = 'role';


  constructor(@Inject(DOCUMENT) private document: Document, @Inject(PLATFORM_ID) private platformId: Object, private formBuilder: FormBuilder) {
    this.initForm();
    this.localStorage = this.document.defaultView?.localStorage;
  }

  initForm(): void {
    this.loginForm = this.formBuilder.group(
      {
        username: [{ value: null, disabled: false }, Validators.required],
        password: [{ value: null, disabled: false }, Validators.required]
      }
    )

    this.loginForm.get('password')?.valueChanges.subscribe((pass) => {
      this.messageError = null;
    })

    this.loginForm.get('username')?.valueChanges.subscribe((user) => {
      this.messageError = null;
    })

  }

  login() {
    this.loginError = "";
    this.messageError = null;
    this._ApiLoginService.login(this.loginForm.value as ILogin).subscribe({
      next: (userData) => {
        const userLoginResponse: ILoginResponse = {
          token: userData.token,
          username: userData.username,
          role: userData.role
        }
        this._DataService.setUserLoginData(userLoginResponse);
      },
      error: (errorData) => {
        console.error(errorData);
        this.loginError = errorData;
        this.messageError = 'Contraseña o usuario inválido.'
      },
      complete: () => {
        console.info("Login completo");
        this.router.navigateByUrl('/home');
        this.loginForm.reset();
      }
    })

  }



}
