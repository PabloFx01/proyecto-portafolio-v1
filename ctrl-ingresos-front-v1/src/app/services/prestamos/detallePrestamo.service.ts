import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '../../../environments/environments.prod';
import { Observable } from 'rxjs';
import { IResponse } from '../../models/response.models';
import { IDetallePrestamo } from '../../models/prestamos/prestamo.models';



@Injectable({
  providedIn: 'root'
})
export class DetallePrestamoService {
  private _Http = inject(HttpClient);
  private urlBase : string = environments.baseUrl + "/tools/ctrlPagos/prestamos/prestamos/detalles/"

  constructor() { }

  getDetallePrestamo(id: number, idPrestamo: number): Observable<IDetallePrestamo> {
    return this._Http.get<IDetallePrestamo>(this.urlBase + `findDPByIdAndIdPrestamo/${id}/${idPrestamo}`);
  }

  getAllDetallePrestamo(idPrestamo: number):Observable<IDetallePrestamo[]>{
    return this._Http.get<IDetallePrestamo[]>(this.urlBase + `findAllByIdPrestamo/${idPrestamo}`) 
  }


  public saveDetallePrestamo(detallePrestamo: IDetallePrestamo): Observable<IDetallePrestamo> {
    return this._Http.post<IDetallePrestamo>(this.urlBase + `save`, detallePrestamo);
  }

  public updateDetallePrestamo(id: number, idPrestamo: number, detallePrestamo: IDetallePrestamo): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `update/${id}/${idPrestamo}`, detallePrestamo);
  }
  public efectuarPagoDetallePrestamo(id: number, idPrestamo: number, detallePrestamo: IDetallePrestamo): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `efectuarPago/${id}/${idPrestamo}`, detallePrestamo);
  }

  public deleteDetallePrestamo(id: number, idPrestamo: number): Observable<IResponse> {
    return this._Http.delete<IResponse>(this.urlBase + `delete/${id}/${idPrestamo}`);
  }


}
