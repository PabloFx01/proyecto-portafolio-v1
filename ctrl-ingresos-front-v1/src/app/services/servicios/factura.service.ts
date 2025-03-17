import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '../../../environments/environments.prod';
import { Observable } from 'rxjs';
import { IResponse } from '../../models/response.models';

import { IFactura, IFacturas } from '../../models/servicios/factura.models';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private _Http = inject(HttpClient);
  private urlBase: string = environments.baseUrl + "/tools/ctrlPagos/servicios/factura/"

  constructor() { }

  getFactura(id: number): Observable<IFactura> {
    return this._Http.get<IFactura>(this.urlBase + `findById/${id}`);
  }

  getFacturaNotPaidByUserAndService(idService: number, username: string): Observable<IFactura> {
    return this._Http.get<IFactura>(this.urlBase + `findByServiceAndUsername/${idService}?username=${username}`);
  }

  getFacturaByUserAndService(idService: number, username: string): Observable<IFactura> {
    return this._Http.get<IFactura>(this.urlBase + `findById/${idService}?username=${username}`);
  }

  getFacturaPaidByUserAndService(idService: number, username: string): Observable<IFactura> {
    return this._Http.get<IFactura>(this.urlBase + `findFAndChildrenPaidByUserAndService/${idService}?username=${username}`);
  }

  getAllFacturas(username: string): Observable<IFactura[]> {
    return this._Http.get<IFactura[]>(this.urlBase + `findAll?username=${username}`)
  }

  getFacturaPaginador(cantidad: number, pagina: number, state: string, username: string, filter: string | null): Observable<IFacturas> {

    if (filter == null) {
      return this._Http.get<IFacturas>(this.urlBase + `findAllPagination/${cantidad}/${pagina}/${state}?username=${username}`);
    } else {
      return this._Http.get<IFacturas>(this.urlBase + `findAllPagination/${cantidad}/${pagina}/${state}?username=${username}&filter=${filter}`);
    }
  }

  getConsultaFacturaWithPaginador(
    cantidad: number,
    pagina: number,
    username: string,
    startDate: string | null,
    endDate: string | null,
    idServicio: number | null,
    state: boolean): Observable<IFacturas> {
    let link = this.urlBase + `findAllConsultaFacturaWithPaginador/${cantidad}/${pagina}`;
    if (startDate != null && endDate != null) {
      link = link + `?startDate=${startDate}&endDate=${endDate}`;
    }else{
      link = link + `?startDate=not&endDate=not`
    }
    if (idServicio != null) {
      link = link + `&idServicio=${idServicio}`
    }else{
      link = link + `&idServicio=not`
    }
    
    link = link + `&state=${state}`;
    link = link + `&username=${username}`

    return this._Http.get<IFacturas>(link);
    

  }



  public saveFactura(factura: IFactura): Observable<IFactura> {
    return this._Http.post<IFactura>(this.urlBase + `save`, factura);
  }

  public updateFactura(id: number, factura: IFactura): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `update/${id}`, factura);
  }

  public deleteFactura(id: number): Observable<IResponse> {
    return this._Http.delete<IResponse>(this.urlBase + `delete/${id}`);
  }


}
