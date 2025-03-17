import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { ILogin, ILoginResponse } from '../models/login.models';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { IUserViewOnly } from '../models/user.models';
import { DataService } from '../shared/data.service';
import { environments } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private localStorageKey = 'token';
  private localStorageUsername = 'username';
  private localStorageRole = 'role';
  private user ?: IUserViewOnly;
  private _dataServices = inject(DataService);
  localStorage: Storage | undefined;

  private _Http = inject(HttpClient);
  private urlBase: string = environments.baseUrl + "/auth/";

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<string> = new BehaviorSubject<string>("");
  currentUsername: BehaviorSubject<string> = new BehaviorSubject<string>("");
  currentUserRole: BehaviorSubject<string> = new BehaviorSubject<string>("");


  constructor(@Inject(DOCUMENT) private document: Document, @Inject(PLATFORM_ID) private platformId: Object) {
    this.localStorage = this.document.defaultView?.localStorage;
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage) {
        this.currentUserLoginOn = new BehaviorSubject<boolean>(localStorage.getItem(this.localStorageKey) != null)
        this.currentUserData = new BehaviorSubject<string>(localStorage.getItem(this.localStorageKey) || "");
        this.currentUsername = new BehaviorSubject<string>(localStorage.getItem(this.localStorageUsername) || "");
        this.currentUserRole = new BehaviorSubject<string>(localStorage.getItem(this.localStorageRole) || "");
      }
    }


  }

  login(credentials: ILogin): Observable<ILoginResponse> {
    return this._Http.post<ILoginResponse>(this.urlBase + "login", credentials).pipe(
      tap((userData) => {
        localStorage.setItem(this.localStorageKey, userData.token);
        localStorage.setItem(this.localStorageUsername, userData.username);
        localStorage.setItem(this.localStorageRole, userData.role);
        this.currentUserData.next(userData.token);
        this.currentUserLoginOn.next(true);
        this.currentUsername.next(userData.username);
        this.currentUserRole.next(userData.role)
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem(this.localStorageKey);
    localStorage.removeItem(this.localStorageUsername);
    localStorage.removeItem(this.localStorageRole);
    this.currentUserLoginOn.next(false);
    this._dataServices.unUserLoginData();
    console.log("dentro del servicelogin loguot");
    
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Se ha producio un error ', error.error);
    }
    else {
      console.error('Backend retornó el código de estado ', error);
    }
    return throwError(() => new Error('Algo falló. Por favor intente nuevamente.'));
  }

  get userData(): Observable<String> {
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }

  get username(): Observable<String> {
    return this.currentUsername.asObservable();
  }

  get userRole(): Observable<String> {
    return this.currentUserRole.asObservable();
  }

  get userToken(): String {
    return this.currentUserData.value;
  }

}
