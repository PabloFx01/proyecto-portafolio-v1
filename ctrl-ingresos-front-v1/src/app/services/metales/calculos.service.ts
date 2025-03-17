import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environments';
import { IResponse } from '../../models/response.models';


@Injectable({
  providedIn: 'root'
})
export class CalculosService {
  private _Http = inject(HttpClient);
  private urlBase: string = environments.baseUrl + "/tools/ctrlPagos/metalesApp/compra/calculo/";
  
  constructor() { }

  getCalcularInventarioByIdCompra(idCompra: number): Observable<IResponse> {
    return this._Http.get<IResponse>(this.urlBase + `calcularInventarioByIdCompra/${idCompra}`);
  }

  getCalcularImporteTotalTicketByIdTicket(idTicket: number): Observable<IResponse> {
    return this._Http.get<IResponse>(this.urlBase + `calcularImporteTotalTicketByIdTicket/${idTicket}`);
  }
  getcalcularVentaByIdVenta(idVenta: number): Observable<IResponse> {
    return this._Http.get<IResponse>(this.urlBase + `calcularVentaByIdVenta/${idVenta}`);
  }
}
