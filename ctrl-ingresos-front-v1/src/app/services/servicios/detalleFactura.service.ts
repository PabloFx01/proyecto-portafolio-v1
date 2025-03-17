import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '../../../environments/environments.prod';
import { Observable } from 'rxjs';
import { IResponse } from '../../models/response.models';

import { IDetalleFactura, IFactura } from '../../models/servicios/factura.models';

@Injectable({
  providedIn: 'root'
})
export class DetalleFacturaService {
  private _Http = inject(HttpClient);
  private urlBase : string = environments.baseUrl + "/tools/ctrlPagos/servicios/factura/detalles/"

  constructor() { }

  getDetalleFactura(id: number, idFactura: number): Observable<IDetalleFactura> {
    return this._Http.get<IDetalleFactura>(this.urlBase + `findDFByIdAndIdFactura/${id}/${idFactura}`);
  }

  getAllDetalleFacturas(idFactura: number):Observable<IDetalleFactura[]>{
    return this._Http.get<IDetalleFactura[]>(this.urlBase + `findAllByIdFactura/${idFactura}`) 
  }


  public saveDetalleFactura(detalleFactura: IDetalleFactura): Observable<IDetalleFactura> {
    return this._Http.post<IDetalleFactura>(this.urlBase + `save`, detalleFactura);
  }

  public updateDetalleFactura(id: number, idFactura: number, detalleFactura: IDetalleFactura): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `update/${id}/${idFactura}`, detalleFactura);
  }

  public deleteDetalleFactura(id: number, idFactura: number): Observable<IResponse> {
    return this._Http.delete<IResponse>(this.urlBase + `delete/${id}/${idFactura}`);
  }


}
