import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '../../../environments/environments.prod';
import { Observable } from 'rxjs';
import { IIngreso, IIngresos } from '../../models/ingresos/ingreso.models';
import { IResponse } from '../../models/response.models';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {
  private _Http = inject(HttpClient);
  private urlBase: string = environments.baseUrl + "/tools/ctrlPagos/ingreso/ingresos/"

  constructor() { }

  getIngreso(id: number): Observable<IIngreso> {
    return this._Http.get<IIngreso>(this.urlBase + `findIAndChildrenById/${id}`);
  }

  getAllIngresosByUser(username: string | String): Observable<IIngreso[]> {
    return this._Http.get<IIngreso[]>(this.urlBase + `findAllByUser?username=${username}`)
  }

  public saveIngreso(ingreso: IIngreso): Observable<IIngreso> {
    return this._Http.post<IIngreso>(this.urlBase + `save`, ingreso);
  }

  public updateIngreso(id: number, ingreso: IIngreso): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `update/${id}`, ingreso);
  }

  public deleteIngreso(id: number): Observable<IResponse> {
    return this._Http.delete<IResponse>(this.urlBase + `delete/${id}`);
  }

  public getConsultaIngresoWithPaginador(
    cantidad: number,
    pagina: number,
    username: string,
    startDate: string | null,
    endDate: string | null,
    titulo: string | null): Observable<IIngresos> {
    let link = this.urlBase + `findAllConsultaIngresoWithPaginador/${cantidad}/${pagina}`;
    if (startDate != null && endDate != null) {
      link = link + `?startDate=${startDate}&endDate=${endDate}`;
    } else {
      link = link + `?startDate=not&endDate=not`
    }
    if (titulo != null) {
      link = link + `&titulo=${titulo}`
    } else {
      link = link + `&titulo=not`
    }

    link = link + `&username=${username}`

    return this._Http.get<IIngresos>(link);


  }

  public getConsultaIngreso(
    cantidad: number,
    pagina: number,
    username: string,
    startDate: string | null,
    endDate: string | null,
    titulo: string | null): Observable<IIngreso[]> {
    let link = this.urlBase + `findAllConsultaIngreso/${cantidad}/${pagina}`;
    if (startDate != null && endDate != null) {
      link = link + `?startDate=${startDate}&endDate=${endDate}`;
    } else {
      link = link + `?startDate=not&endDate=not`
    }
    if (titulo != null) {
      link = link + `&titulo=${titulo}`
    } else {
      link = link + `&titulo=not`
    }

    link = link + `&username=${username}`

    return this._Http.get<IIngreso[]>(link);
  }

}
