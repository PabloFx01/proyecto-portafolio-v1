import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environments.prod';
import { ISobre, ISobres } from '../../models/ctrlEfectivo/sobre.models';
import { IResponse } from '../../models/response.models';
import { ICuenta } from '../../models/ctrlEfectivo/cuenta.models';

@Injectable({
  providedIn: 'root'
})
export class SobreService {

  private _Http = inject(HttpClient);
  private urlBase: string = environments.baseUrl +"/tools/ctrlPagos/ctrlEfectivo/sobres/";
  constructor() { }

  getSobrePaginadorByUsername(cantidad: number, pagina: number,state : string, filter: string | null, username: string): Observable<ISobres> {
    if (filter == null) {
      return this._Http.get<ISobres>(this.urlBase + `findAllPaginadoByUsername/${cantidad}/${pagina}/${state}?filter=not&username=${username}`);
    } else {
      return this._Http.get<ISobres>(this.urlBase + `findAllPaginadoByUsername/${cantidad}/${pagina}/${state}?filter=${filter}&username=${username}`);
    }
  }

  getSobre(id: number): Observable<ISobre> {
    return this._Http.get<ISobre>(this.urlBase + `find/${id}`);
  }

  getSobres(username: string): Observable<ISobre[]> {
    return this._Http.get<ISobre[]>(this.urlBase + `findAllActByUsername?username=${username}`);
  }


  public saveSobre(sobre: ISobre): Observable<IResponse> {
    return this._Http.post<IResponse>(this.urlBase+`save`, sobre);
  }
  public saveSobreXCuenta(sobre: ISobre): Observable<IResponse> {
    return this._Http.post<IResponse>(this.urlBase+`saveSobreXCuenta`, sobre);
  }

  public updateSobre(id: number, sobre: ISobre): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase+ `update/${id}`, sobre);
  }

  public updateSobreXCuenta(id: number, sobre: ISobre): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase+ `updateSobreXCuenta/${id}`, sobre);
  }

  public updateSobreActivo(id: number, sobre: ISobre): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase+ `updateSobreActivo/${id}`, sobre);
  }

  public softDeleteSobre(id: number, sobre: ISobre): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase+ `softDelete/${id}`, sobre);
  }

  public deleteSobre(id: number): Observable<IResponse> {
    return this._Http.delete<IResponse>(this.urlBase + `delete/${id}`);
  }
}
