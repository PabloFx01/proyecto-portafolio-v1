import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from '../models/response.models';
import { IUser, IUserChangePass, IUsers } from '../models/user.models';
import { environments } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _Http = inject(HttpClient);
  private urlBase: string = environments.baseUrl + "/api/v1/user/";
  constructor() { }

  getUserPaginador(cantidad: number, pagina: number, filter: string | null): Observable<IUsers> {
    if (filter == null) {
      return this._Http.get<IUsers>(this.urlBase + `findAllPaginado/${cantidad}/${pagina}`);
    } else {
      return this._Http.get<IUsers>(this.urlBase + `findAllPaginado/${cantidad}/${pagina}?filter=${filter}`);
    }
  }

  getUser(id: number): Observable<IUser> {
    return this._Http.get<IUser>(this.urlBase + `find/${id}`);
  }

  public saveUser(user: IUser): Observable<IResponse> {
    return this._Http.post<IResponse>(this.urlBase+`save`, user);
  }

  public changePass(user: IUserChangePass): Observable<IResponse> {
    return this._Http.post<IResponse>(this.urlBase+`changePass`, user);
  }

  public updateUser(id: number, user: IUser): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase+ `update/${id}`, user);
  }

  public deleteUser(id: number): Observable<IResponse> {
    return this._Http.delete<IResponse>(this.urlBase + `delete/${id}`);
  }
}
