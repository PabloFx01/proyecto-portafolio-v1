import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environments';
import { ITicket, ITickets } from '../../models/metales/ticket.models';
import { IResponse } from '../../models/response.models';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private _Http = inject(HttpClient);
  private urlBase: string = environments.baseUrl + "/tools/ctrlPagos/metalesApp/venta/ticket/";
  constructor() { }

  getTickets(): Observable<ITicket[]> {
    return this._Http.get<ITicket[]>(this.urlBase + `findAll`);
  }

  getTicketsNotUsed(username: string): Observable<ITicket[]> {
    return this._Http.get<ITicket[]>(this.urlBase + `findAllAndChildrenNotUsed?username=${username}`);
  }

  getTicketPaginador(cantidad: number, pagina: number, filter: string | null, username: string): Observable<ITickets> {
    if (filter == null) {
      return this._Http.get<ITickets>(this.urlBase + `findAllPaginado/${cantidad}/${pagina}?filter=not&username=${username}`);
    } else {
      return this._Http.get<ITickets>(this.urlBase + `findAllPaginado/${cantidad}/${pagina}?filter=${filter}&username=${username}`);
    }
  }

  getTicket(id: number): Observable<ITicket> {
    return this._Http.get<ITicket>(this.urlBase + `find/${id}`);
  }

  getMaxIdTicket(): Observable<number> {
    return this._Http.get<number>(this.urlBase + `findMaxId`);
  }

  public saveTicket(ticket: ITicket): Observable<IResponse> {
    return this._Http.post<IResponse>(this.urlBase + `save`, ticket);
  }

  public updateTicket(id: number, ticket: ITicket): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `update/${id}`, ticket);
  }

  public deleteTicket(id: number): Observable<IResponse> {
    return this._Http.delete<IResponse>(this.urlBase + `delete/${id}`);
  }
}
