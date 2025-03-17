import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '../../../environments/environments.prod';
import { Observable } from 'rxjs';
import { IIngreso } from '../../models/ingresos/ingreso.models';
import { IResponse } from '../../models/response.models';
import { IDetalleIngreso } from '../../models/ingresos/detalleIngreso.models';

@Injectable({
  providedIn: 'root'
})
export class DetalleIngresoService {
  private _Http = inject(HttpClient);
  private urlBase : string = environments.baseUrl + "/tools/ctrlPagos/ingreso/ingresos/detalles/"

  constructor() { }

  getDetalleIngreso(id: number, idIngreso : number): Observable<IDetalleIngreso> {
    return this._Http.get<IDetalleIngreso>(this.urlBase + `findDIAndChildrenByIdAndIdIngreso/${id}/${idIngreso}`);
  }
  getDetalleIngresoByCpto(cpto: string, idIngreso : number): Observable<IDetalleIngreso> {
    return this._Http.get<IDetalleIngreso>(this.urlBase + `findDIAndChildrenByCptoAndIdIngreso/${cpto}/${idIngreso}`);
  }

  getAllDetallesByIdIngreso(idIngreso : number | null):Observable<IDetalleIngreso[]>{
    return this._Http.get<IDetalleIngreso[]>(this.urlBase + `findAllAndChildrenByIdIngreso/${idIngreso}`) 
  }

  public saveDetalleIngreso(dIngreso: IDetalleIngreso): Observable<IDetalleIngreso> {
    return this._Http.post<IDetalleIngreso>(this.urlBase + `save`, dIngreso);
  }

  public updateDIngresoMontos(id: number, idIngreso:number, dIngreso: IDetalleIngreso): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `updateMontos/${id}/${idIngreso}`, dIngreso);
  }
  public updateDIngresoTransferir(id: number, idIngreso:number, dIngreso: IDetalleIngreso): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `updateTransferir/${id}/${idIngreso}`, dIngreso);
  }
  public updateDIngresoMontoRest(id: number, idIngreso:number, dIngreso: IDetalleIngreso): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `updateMontoRest/${id}/${idIngreso}`, dIngreso);
  }

  public updateDIngresoAndTotRest(id: number, idIngreso:number, dIngreso: IDetalleIngreso): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `updateDIngresoAndTotRest/${id}/${idIngreso}`, dIngreso);
  }
}
