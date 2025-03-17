import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '../../../environments/environments.prod';
import { Observable } from 'rxjs';
import { IResponse } from '../../models/response.models';
import { IServicio, IServicios } from '../../models/servicios/servicio.models';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private _Http = inject(HttpClient);
  private urlBase : string = environments.baseUrl + "/tools/ctrlPagos/servicios/servicio/"

  constructor() { }

  getServicio(id: number): Observable<IServicio> {
    return this._Http.get<IServicio>(this.urlBase + `findById/${id}`);
  }

  getAllServicios(username: string):Observable<IServicio[]>{
    return this._Http.get<IServicio[]>(this.urlBase + `findAll?username=${username}`) 
  }
  getAllServiciosAct(username: string):Observable<IServicio[]>{
    return this._Http.get<IServicio[]>(this.urlBase + `findAllAct?username=${username}`) 
  }

  getServicioPaginador(cantidad: number, pagina: number, state: string, username: string, filter: string | null): Observable<IServicios> {
     
    if (filter == null) {
      return this._Http.get<IServicios>(this.urlBase + `findAllPagination/${cantidad}/${pagina}/${state}?username=${username}`);
    } else {
      return this._Http.get<IServicios>(this.urlBase + `findAllPagination/${cantidad}/${pagina}/${state}?username=${username}&filter=${filter}`);
    }
  }

  public saveServicio(servicio: IServicio): Observable<IServicio> {
    return this._Http.post<IServicio>(this.urlBase + `save`, servicio);
  }

  public updateServicio(id: number, servicio: IServicio): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `update/${id}`, servicio);
  }

  public softDeleteServicio(id: number): Observable<IResponse> {
    return this._Http.get<IResponse>(this.urlBase + `softDelete/${id}`);
  }

  updateAllServicios(username: string):Observable<IResponse>{
    return this._Http.get<IResponse>(this.urlBase + `updateServicios?username=${username}`) 
  }
}
