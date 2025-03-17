import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environments';
import { IInventario, IInventarios } from '../../models/metales/inventario.models';
import { IResponse } from '../../models/response.models';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private _Http = inject(HttpClient);
  private urlBase: string = environments.baseUrl + "/tools/ctrlPagos/metalesApp/compra/inventario/";

  constructor() { }

  getInventarioPaginador(cantidad: number, pagina: number, filter: string | null, username : string): Observable<IInventarios> {
    if (filter == null) {
      return this._Http.get<IInventarios>(this.urlBase + `findAllPaginado/${cantidad}/${pagina}?filter=not&username=${username}`);
    } else {
      return this._Http.get<IInventarios>(this.urlBase + `findAllPaginado/${cantidad}/${pagina}?filter=${filter}&username=${username}`);
    }
  }

  getInventario(id: number,metalId: string): Observable<IInventario> {
    return this._Http.get<IInventario>(this.urlBase + `find/${id}/${metalId}`);
  }

  getInventarioByIdMetal(metalId: string): Observable<IInventario> {
    return this._Http.get<IInventario>(this.urlBase + `findByIdMetal/${metalId}`);
  }

  getNextIdInventario(): Observable<number> {
    return this._Http.get<number>(this.urlBase + `nextIdDetalleByIdCompra`);
  }

  public saveInventario(inventario: IInventario): Observable<IInventario> {
    return this._Http.post<IInventario>(this.urlBase + `save`, inventario);
  }

  public updateInventario(id: number,metalId: string, inventario: IInventario): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `update/${id}/${metalId}`, inventario);
  }

  public deleteInventario(id: number,metalId: string): Observable<IResponse> {
    return this._Http.delete<IResponse>(this.urlBase + `delete/${id}/${metalId}`);
  }
}
