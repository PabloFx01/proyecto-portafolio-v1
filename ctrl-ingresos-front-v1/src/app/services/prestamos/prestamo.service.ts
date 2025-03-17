import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environments.prod';
import { IResponse } from '../../models/response.models';
import { IPrestamo, IPrestamos } from '../../models/prestamos/prestamo.models';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  private _Http = inject(HttpClient);
  private urlBase: string = environments.baseUrl +"/tools/ctrlPagos/prestamos/prestamos/";
  constructor() { }

  getPrestamoPaginadorByUsername(cantidad: number, pagina: number,state : string, filter: string | null, username: string): Observable<IPrestamos> {
    if (filter == null) {
      return this._Http.get<IPrestamos>(this.urlBase + `findAllPaginadoByUsername/${cantidad}/${pagina}/${state}?filter=not&username=${username}`);
    } else {
      return this._Http.get<IPrestamos>(this.urlBase + `findAllPaginadoByUsername/${cantidad}/${pagina}/${state}?filter=${filter}&username=${username}`);
    }
  }

  getPrestamo(id: number): Observable<IPrestamo> {
    return this._Http.get<IPrestamo>(this.urlBase + `find/${id}`);
  }

  getPrestamos(username: string): Observable<IPrestamo[]> {
    return this._Http.get<IPrestamo[]>(this.urlBase + `findAllPaidAndChildrenByUser?username=${username}`);
  }

  public procesarPrestamo(idPrestamo: number, prestamo: IPrestamo): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `procesarPrestamo/${idPrestamo}`, prestamo);
  }

  public savePrestamo(prestamo: IPrestamo): Observable<IResponse> {
    return this._Http.post<IResponse>(this.urlBase+`save`, prestamo);
  }

  public updatePrestamo(id: number, prestamo: IPrestamo): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase+ `update/${id}`, prestamo);
  }


  public deletePrestamo(id: number): Observable<IResponse> {
    return this._Http.delete<IResponse>(this.urlBase + `delete/${id}`);
  }
}
