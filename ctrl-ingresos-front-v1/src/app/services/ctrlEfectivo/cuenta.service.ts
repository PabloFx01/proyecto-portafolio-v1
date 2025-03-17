import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environments.prod';
import { ICuenta, ICuentas } from '../../models/ctrlEfectivo/cuenta.models';
import { IResponse } from '../../models/response.models';



@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  private _Http = inject(HttpClient);
  private urlBase: string = environments.baseUrl + "/tools/ctrlPagos/ctrlEfectivo/cuentas/";
  constructor() { }

  getCuentaPaginadorByUsername(cantidad: number, pagina: number, filter: string | null, username: string): Observable<ICuentas> {
    if (filter == null) {
      return this._Http.get<ICuentas>(this.urlBase + `findAllPaginadoByUsername/${cantidad}/${pagina}?filter=not&username=${username}`);
    } else {
      return this._Http.get<ICuentas>(this.urlBase + `findAllPaginadoByUsername/${cantidad}/${pagina}?filter=${filter}&username=${username}`);
    }
  }

  getCuenta(id: number): Observable<ICuenta> {
    return this._Http.get<ICuenta>(this.urlBase + `find/${id}`);
  }

  getCuentasActivasByUsername(filter: string | null, username: string): Observable<ICuenta[]> {
    if (filter==null) {     
      return this._Http.get<ICuenta[]>(this.urlBase + `findAllFromSobreActByUsername?filter=not&username=${username}`);     
    } else { 
      return this._Http.get<ICuenta[]>(this.urlBase + `findAllFromSobreActByUsername?filter=${filter}&username=${username}`);
    }
  }

  getCuentaByIdSobre(id: number): Observable<ICuenta> {
    return this._Http.get<ICuenta>(this.urlBase + `findByIdSobre/${id}`);
  }

  // public saveCuenta(cuenta: ICuenta): Observable<IResponse> {
  //   return this._Http.post<IResponse>(this.urlBase + `save`, cuenta);
  // }
  public saveCuenta(cuenta: ICuenta): Observable<IResponse> {
    return this._Http.get<IResponse>(this.urlBase + `save`);
  }

  public updateCuenta(id: number, cuenta: ICuenta): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `update/${id}`, cuenta);
  }

  public updateCuentaRetirarFondo(id: number, cuenta: ICuenta): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `updateRetirarFondo/${id}`, cuenta);
  }

  public updateCuentaTranferirFondo(id: number, cuenta: ICuenta): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `updateTranferirFondo/${id}`, cuenta);
  }

  public deleteCuenta(id: number): Observable<IResponse> {
    return this._Http.delete<IResponse>(this.urlBase + `delete/${id}`);
  }
}
