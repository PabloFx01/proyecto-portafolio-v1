import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environments';
import { IMetalVenta, MetalVentaId } from '../../models/metales/metal-venta.models';
import { IResponse } from '../../models/response.models';

@Injectable({
  providedIn: 'root'
})
export class MetalVentaService {

  private _Http = inject(HttpClient);
  private urlBase: string = environments.baseUrl + "/tools/ctrlPagos/metalesApp/metal/metal-venta/";

  constructor() { }
  
  getMetalesVenta(idMetalCompra: string): Observable<IMetalVenta[]> {
    return this._Http.get<IMetalVenta[]>(this.urlBase + `findAll/${idMetalCompra}`);
  }


  getMetalVenta(id: number, idMetalCompra: string): Observable<IMetalVenta> {
    return this._Http.get<IMetalVenta>(this.urlBase + `find/${id}/${idMetalCompra}`);
  }

  getnextMetalVentaIdByIdMetalCompra( idMetalCompra: string): Observable<MetalVentaId> {
    return this._Http.get<MetalVentaId>(this.urlBase + `nextMetalVentaIdByIdMetalCompra/${idMetalCompra}`);    
  }

  public saveMetalVenta(mv: IMetalVenta): Observable<IResponse> {
    return this._Http.post<IResponse>(this.urlBase + `save`, mv);
  }

  public updateMetalVenta(id: number,idMetalCompra: string, metalVenta: IMetalVenta): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `update/${id}/${idMetalCompra}`, metalVenta);
  }

  public deleteMetalVenta(id: number,idMetalCompra: string): Observable<IResponse> {
    return this._Http.delete<IResponse>(this.urlBase + `delete/${id}/${idMetalCompra}`);
  }
}
