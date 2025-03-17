import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '../../../environments/environments.prod';
import { Observable } from 'rxjs';
import { IIngreso } from '../../models/ingresos/ingreso.models';
import { IResponse } from '../../models/response.models';
import { IDetalleIngreso } from '../../models/ingresos/detalleIngreso.models';
import { IConcepto, IConceptos } from '../../models/ingresos/concepto.models';

@Injectable({
  providedIn: 'root'
})
export class ConceptoService {
  private _Http = inject(HttpClient);
  private urlBase : string = environments.baseUrl + "/tools/ctrlPagos/ingreso/conceptos/"

  constructor() { }

  getConcepto(id: number, username : string): Observable<IConcepto> {
    return this._Http.get<IConcepto>(this.urlBase + `findById/${id}?username=${username}`);
  }

  getAllConceptos(username: string):Observable<IConcepto[]>{
    return this._Http.get<IConcepto[]>(this.urlBase + `findAll?username=${username}`) 
  }
  getAllConceptosAct(username: string):Observable<IConcepto[]>{
    return this._Http.get<IConcepto[]>(this.urlBase + `findAllAct?username=${username}`) 
  }

  getConceptoPaginador(cantidad: number, pagina: number, state: string, username: string, filter: string | null): Observable<IConceptos> {
     
    if (filter == null) {
      return this._Http.get<IConceptos>(this.urlBase + `findAllPagination/${cantidad}/${pagina}/${state}?username=${username}`);
    } else {
      return this._Http.get<IConceptos>(this.urlBase + `findAllPagination/${cantidad}/${pagina}/${state}?username=${username}&filter=${filter}`);
    }
  }

  public saveConcepto(concepto: IConcepto): Observable<IConcepto> {
    return this._Http.post<IConcepto>(this.urlBase + `save`, concepto);
  }

  public updateConcepto(id: number, concepto: IConcepto): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `update/${id}`, concepto);
  }

  public updateActivo(id: number, concepto: IConcepto): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `updateActivo/${id}`, concepto);
  }

  public softDeleteConcepto(id: number, username :string): Observable<IResponse> {
    return this._Http.get<IResponse>(this.urlBase + `softDelete/${id}?username=${username}`);
  }
}
