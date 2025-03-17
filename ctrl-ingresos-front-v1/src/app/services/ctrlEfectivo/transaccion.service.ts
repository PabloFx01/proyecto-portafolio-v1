import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environments.prod';
import { ITransaccion, ITransacciones } from '../../models/ctrlEfectivo/transaccion.models';
import { IResponse } from '../../models/response.models';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {

  private _Http = inject(HttpClient);
  private urlBase: string = environments.baseUrl + "/tools/ctrlPagos/ctrlEfectivo/transacciones/";
  constructor() { }

  getTransaccionPaginador(cantidad: number, pagina: number, filter: string | null): Observable<ITransacciones> {
    if (filter == null) {
      return this._Http.get<ITransacciones>(this.urlBase + `findAllPaginado/${cantidad}/${pagina}`);
    } else {
      return this._Http.get<ITransacciones>(this.urlBase + `findAllPaginado/${cantidad}/${pagina}?filter=${filter}`);
    }
  }

  getTransaccion(id: number): Observable<ITransaccion> {
    return this._Http.get<ITransaccion>(this.urlBase + `find/${id}`);
  }

  public saveTransaccion(transaccion: ITransaccion): Observable<IResponse> {
    return this._Http.post<IResponse>(this.urlBase+'save', transaccion);
  }
  
  public saveAndReturnTransaccion(transaccion: ITransaccion): Observable<ITransaccion> {
    return this._Http.post<ITransaccion>(this.urlBase+'saveAndReturnTransaccion', transaccion);
  }

  public updateTransaccion(id: number, transaccion: ITransaccion): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase+ `update/${id}`, transaccion);
  }

  public deleteTransaccion(id: number): Observable<IResponse> {
    return this._Http.delete<IResponse>(this.urlBase + `delete/${id}`);
  }
}
