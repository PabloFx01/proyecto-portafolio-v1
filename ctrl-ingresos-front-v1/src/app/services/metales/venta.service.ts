import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environments';
import { IFechasComprasAsociadas, IVenta, IVentas } from '../../models/metales/venta.models';
import { IResponse } from '../../models/response.models';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private _Http = inject(HttpClient);
  private urlBase: string = environments.baseUrl + "/tools/ctrlPagos/metalesApp/venta/";

  constructor() { }
  getVentas(): Observable<IVenta[]> {
    return this._Http.get<IVenta[]>(this.urlBase + `findAll`);
  }

  getVentaPaginador(cantidad: number, pagina: number, filter: string | null, username:string): Observable<IVentas> {
    if (filter == null) {
      return this._Http.get<IVentas>(this.urlBase + `findAllPaginado/${cantidad}/${pagina}?filter=not&username=${username}`);
    } else {
      return this._Http.get<IVentas>(this.urlBase + `findAllPaginado/${cantidad}/${pagina}?filter=${filter}&username=${username}`);
    }
  }

  getVenta(id: number): Observable<IVenta> {
    return this._Http.get<IVenta>(this.urlBase + `find/${id}`);
  }

  getAsociarComprasDiariasByIdVenta(id: number): Observable<IResponse> {
    return this._Http.get<IResponse>(this.urlBase + `asociarComprasDiariasByIdVenta/${id}`);
  }

  getFechaComprasDiariasByIdVenta(id: number): Observable<IFechasComprasAsociadas> {
    return this._Http.get<IFechasComprasAsociadas>(this.urlBase + `findFechasCompraAsociadasByIdVenta/${id}`);
  }

  getMaxIdVenta(): Observable<number> {
    return this._Http.get<number>(this.urlBase + `findMaxId`);
  }

  public saveVenta(v: IVenta): Observable<IResponse> {
    return this._Http.post<IResponse>(this.urlBase + `save`, v);
  }

  public updateVenta(id: number, venta: IVenta): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `update/${id}`, venta);
  }

  public deleteVenta(id: number): Observable<IResponse> {
    return this._Http.delete<IResponse>(this.urlBase + `delete/${id}`);
  }
}
