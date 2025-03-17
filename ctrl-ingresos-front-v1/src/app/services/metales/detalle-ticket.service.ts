import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environments';
import { DetalleTicketId, IDetallesTicket, IDetalleTicket } from '../../models/metales/ticket.models';
import { IResponse } from '../../models/response.models';


@Injectable({
  providedIn: 'root'
})
export class DetalleTicketService {
  private _Http = inject(HttpClient);
  private urlBase: string = environments.baseUrl + "/tools/ctrlPagos/metalesApp/venta/ticket/detalle-ticket/";

  constructor() { }

  getDetallesTicket(idTicket: number): Observable<IDetalleTicket[]> {
    return this._Http.get<IDetalleTicket[]>(this.urlBase + `findAll/${idTicket}`);
  }

  getDetallesTicketPaginador(idTicket: number, cantidad: number, pagina: number, filter: string | null): Observable<IDetallesTicket> {
    if (filter == null) {
      return this._Http.get<IDetallesTicket>(this.urlBase + `findAllPaginado/${idTicket}/${cantidad}/${pagina}`);
    } else {
      return this._Http.get<IDetallesTicket>(this.urlBase + `findAllPaginado/${idTicket}/${cantidad}/${pagina}?filter=${filter}`);
    }
  }

  getDetalleTicket(id: number, idTicket: number): Observable<IDetalleTicket> {
    return this._Http.get<IDetalleTicket>(this.urlBase + `find/${id}/${idTicket}`);
  }

  getNextIdDetalleTicket( idTicket: number): Observable<DetalleTicketId> {
    return this._Http.get<DetalleTicketId>(this.urlBase + `nextIdDetalleByIdTicket/${idTicket}`);    
  }

  public saveDetalleTicket(dc: IDetalleTicket): Observable<IResponse> {
    return this._Http.post<IResponse>(this.urlBase + `save`, dc);
  }

  public updateDetalleTicket(id: number, idTicket: number, detallecompra: IDetalleTicket): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `update/${id}/${idTicket}`, detallecompra);
  }

  public deleteDetalleTicket(id: number,idTicket: number): Observable<IResponse> {
    return this._Http.delete<IResponse>(this.urlBase + `delete/${id}/${idTicket}`);
  }
}
