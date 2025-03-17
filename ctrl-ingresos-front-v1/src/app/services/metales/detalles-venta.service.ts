import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environments.prod';
import { DetalleVentaId, IDetallesVenta, IDetalleVenta } from '../../models/metales/venta.models';
import { IResponse } from '../../models/response.models';


@Injectable({
  providedIn: 'root'
})
export class DetallesVentaService {
  private _Http = inject(HttpClient);
  private urlBase: string = environments.baseUrl + "/tools/ctrlPagos/metalesApp/venta/detalle-venta/";

  constructor() { }
  
  getDetallesVenta(idVenta: number): Observable<IDetalleVenta[]> {
    return this._Http.get<IDetalleVenta[]>(this.urlBase + `findAll/${idVenta}`);
  }

  getDetallesVentaPaginador(idVenta: number, cantidad: number, pagina: number, filter: string | null): Observable<IDetallesVenta> {
    if (filter == null) {
      return this._Http.get<IDetallesVenta>(this.urlBase + `findAllPaginado/${idVenta}/${cantidad}/${pagina}`);
    } else {
      return this._Http.get<IDetallesVenta>(this.urlBase + `findAllPaginado/${idVenta}/${cantidad}/${pagina}?filter=${filter}`);
    }
  }

  getDetalleVenta(id: number, idVenta: number): Observable<IDetalleVenta> {
    return this._Http.get<IDetalleVenta>(this.urlBase + `find/${id}/${idVenta}`);
  }

  getNextIdDetalleVenta( idVenta: number): Observable<DetalleVentaId> {
    return this._Http.get<DetalleVentaId>(this.urlBase + `nextIdDetalleByIdVenta/${idVenta}`);    
  }

  public saveDetalleVenta(dc: IDetalleVenta): Observable<IResponse> {
    return this._Http.post<IResponse>(this.urlBase + `save`, dc);
  }

  public updateDetalleVenta(id: number, idVenta: number, detallecompra: IDetalleVenta): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `update/${id}/${idVenta}`, detallecompra);
  }

  public deleteDetalleVenta(id: number,idVenta: number): Observable<IResponse> {
    return this._Http.delete<IResponse>(this.urlBase + `delete/${id}/${idVenta}`);
  }
}
