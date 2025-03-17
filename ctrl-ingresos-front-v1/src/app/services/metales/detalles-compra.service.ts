import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environments';
import { DetalleCompraId, IDetalleCompra, IDetallesCompra } from '../../models/metales/compra.models';
import { IResponse } from '../../models/response.models';


@Injectable({
  providedIn: 'root'
})
export class DetallesCompraService {

  private _Http = inject(HttpClient);
  private urlBase: string = environments.baseUrl + "/tools/ctrlPagos/metalesApp/compra/detalle-compra/";
  constructor() { }

  getDetallesCompra(idCompra: number): Observable<IDetalleCompra[]> {
    return this._Http.get<IDetalleCompra[]>(this.urlBase + `findAll/${idCompra}`);
  }

  getDetallesCompraPaginador(idCompra: number, cantidad: number, pagina: number, filter: string | null): Observable<IDetallesCompra> {
    if (filter == null) {
      return this._Http.get<IDetallesCompra>(this.urlBase + `findAllPaginado/${idCompra}/${cantidad}/${pagina}`);
    } else {
      return this._Http.get<IDetallesCompra>(this.urlBase + `findAllPaginado/${idCompra}/${cantidad}/${pagina}?filter=${filter}`);
    }
  }

  getDetalleCompra(id: number, idCompra: number): Observable<IDetalleCompra> {
    return this._Http.get<IDetalleCompra>(this.urlBase + `find/${id}/${idCompra}`);
  }

  getNextIdDetalleCompra( idCompra: number): Observable<DetalleCompraId> {
    return this._Http.get<DetalleCompraId>(this.urlBase + `nextIdDetalleByIdCompra/${idCompra}`);
  }

  public saveDetalleCompra(dc: IDetalleCompra): Observable<IResponse> {
    return this._Http.post<IResponse>(this.urlBase + `save`, dc);
  }

  public updateDetalleCompra(id: number, idCompra: number, detallecompra: IDetalleCompra): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `update/${id}/${idCompra}`, detallecompra);
  }

  public deleteDetalleCompra(id: number,idCompra: number): Observable<IResponse> {
    return this._Http.delete<IResponse>(this.urlBase + `delete/${id}/${idCompra}`);
  }
}
