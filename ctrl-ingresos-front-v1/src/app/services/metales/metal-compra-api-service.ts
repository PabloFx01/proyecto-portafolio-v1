import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IMetalCompra, IMetalCompras } from '../../models/metales/metal-compra.models';
import { environments } from '../../../environments/environments';
import { IResponse } from '../../models/response.models';

@Injectable({
  providedIn: 'root'
})
export class MetalCompraApiService {
  private _Http = inject(HttpClient);
  private metalCompraListSubject = new BehaviorSubject<IMetalCompra[]>([])
  private urlBase: string = environments.baseUrl +"/tools/ctrlPagos/metalesApp/metal/";
  constructor() { }

  getMetalesCompra(username:string): Observable<IMetalCompra[]> {
    return this._Http.get<IMetalCompra[]>(this.urlBase + `findAll?username=${username}`);
  }

  getMetalComprasPaginador(cantidad: number, pagina: number, state: string, filter: string | null, username: string): Observable<IMetalCompras> {
    if (filter == null) {
      return this._Http.get<IMetalCompras>(this.urlBase + `findAllPagination/${cantidad}/${pagina}/${state}?filter=not&username=${username}`);
    } else {
      return this._Http.get<IMetalCompras>(this.urlBase + `findAllPagination/${cantidad}/${pagina}/${state}?filter=${filter}&username=${username}`);
    }
  }

  getMetalCompra(id: string): Observable<IMetalCompra> {
    return this._Http.get<IMetalCompra>(this.urlBase + `find/${id}`);
  }

  public saveMetalCompra(metal: IMetalCompra): Observable<IResponse> {
    return this._Http.post<IResponse>(this.urlBase+`save`, metal);
  }

  public updateMetalCompra(id: string, metal: IMetalCompra): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase+ `update/${id}`, metal);
  }

  public softDeleteMetalCompra(id: string,  metal: IMetalCompra): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase+ `softDelete/${id}`, metal);
  }

  public restaurarSoftDeleteMetalCompra(id: string,  metal: IMetalCompra): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase+ `restaurar/${id}`, metal);
  }

  public deleteMetalCompras(id: string): Observable<IMetalCompra> {
    return this._Http.delete<IMetalCompra>(this.urlBase + `delete/${id}`);
  }
  
}
