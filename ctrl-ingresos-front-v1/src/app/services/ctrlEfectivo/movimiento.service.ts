import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environments.prod';
import { IMovimiento, IMovimientos } from '../../models/ctrlEfectivo/movimiento.models';
import { IResponse } from '../../models/response.models';


@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

  private _Http = inject(HttpClient);
  private urlBase: string = environments.baseUrl + "/tools/ctrlPagos/ctrlEfectivo/movimientos/";
  constructor() { }

  getMovimientoPaginadorByUsername(cantidad: number, pagina: number, filter: string | null, username: string): Observable<IMovimientos> {
    if (filter == null) {
      return this._Http.get<IMovimientos>(this.urlBase + `findAllPaginadoByUsername/${cantidad}/${pagina}?filter=not&username=${username}`);
    } else {
      return this._Http.get<IMovimientos>(this.urlBase + `findAllPaginadoByUsername/${cantidad}/${pagina}?filter=${filter}&username=${username}`);
    }
  }

  getConsultaMovWithPaginadorByUsername(cantidad: number,
    pagina: number,
    startDateFilter: string | null,
    endDateFilter: string | null,
    sobreFilter: number | null,
    tipoMovFilter: string | null,
    username: string): Observable<IMovimientos> {
    let link = this.urlBase;
    
    link = link + `findAllConsultaMovWithPaginationByUsername/${cantidad}/${pagina}`

    if (startDateFilter != null && endDateFilter != null) {
      link = link + `?startDateFilter=${startDateFilter}&endDateFilter=${endDateFilter}`
    }else{
      link = link + `?startDateFilter=not&endDateFilter=not`
    }
    if (sobreFilter != null) {
      link = link + `&idSobreFilter=${sobreFilter}`
    }else{
      link = link + `&idSobreFilter=not`
    }
    if(tipoMovFilter != null) {
      link = link + `&tipoMovFilter=${tipoMovFilter}`
    }else{
      link = link + `&tipoMovFilter=not`
    }  
    link = link + `&username=${username}`    
    console.log("link " + link);
    
    
    return this._Http.get<IMovimientos>(link);

  }

  getConsultaMovByUsername(
    startDateFilter: string | null,
    endDateFilter: string | null,
    sobreFilter: number | null,
    tipoMovFilter: string | null,
    username: string ): Observable<IMovimiento[]> {
    let link = this.urlBase;
    
    link = link + `findAllConsultaMovByUsername`

    if (startDateFilter != null && endDateFilter != null) {
      link = link + `?startDateFilter=${startDateFilter}&endDateFilter=${endDateFilter}`
    }else{
      link = link + `?startDateFilter=not&endDateFilter=not`
    }
    if (sobreFilter != null) {
      link = link + `&idSobreFilter=${sobreFilter}`
    }else{
      link = link + `&idSobreFilter=not`
    }
    if(tipoMovFilter != null) {
      link = link + `&tipoMovFilter=${tipoMovFilter}`
    }else{
      link = link + `&tipoMovFilter=not`
    } 
    link = link + `&username=${username}`  
    
    return this._Http.get<IMovimiento[]>(link);

  }


  getAllConsultaMovByUsername(
    startDateFilter: string | null,
    endDateFilter: string | null,
    sobreFilter: number | null,
    tipoMovFilter: string | null,
    username: string ): Observable<IMovimiento[]> {
    let link = this.urlBase;
    
    link = link + `getAllConsultaMovByUsername`

    if (startDateFilter != null && endDateFilter != null) {
      link = link + `?startDateFilter=${startDateFilter}&endDateFilter=${endDateFilter}`
    }else{
      link = link + `?startDateFilter=not&endDateFilter=not`
    }
    if (sobreFilter != null) {
      link = link + `&idSobreFilter=${sobreFilter}`
    }else{
      link = link + `&idSobreFilter=not`
    }
    if(tipoMovFilter != null) {
      link = link + `&tipoMovFilter=${tipoMovFilter}`
    }else{
      link = link + `&tipoMovFilter=not`
    } 
    link = link + `&username=${username}`  
    
    return this._Http.get<IMovimiento[]>(link);

  }
  getAllConsultaADDMovByUsername(
    startDateFilter: string | null,
    endDateFilter: string | null,
    sobreFilter: number | null,
    tipoMovFilter: string | null,
    username: string ): Observable<IMovimiento[]> {
    let link = this.urlBase;
    
    link = link + `getAllConsultaADDMovByUsername`

    if (startDateFilter != null && endDateFilter != null) {
      link = link + `?startDateFilter=${startDateFilter}&endDateFilter=${endDateFilter}`
    }else{
      link = link + `?startDateFilter=not&endDateFilter=not`
    }
    if (sobreFilter != null) {
      link = link + `&idSobreFilter=${sobreFilter}`
    }else{
      link = link + `&idSobreFilter=not`
    }
    if(tipoMovFilter != null) {
      link = link + `&tipoMovFilter=${tipoMovFilter}`
    }else{
      link = link + `&tipoMovFilter=not`
    } 
    link = link + `&username=${username}`  
    
    return this._Http.get<IMovimiento[]>(link);

  }


  getMovimiento(id: number): Observable<IMovimiento> {
    return this._Http.get<IMovimiento>(this.urlBase + `find/${id}`);
  }

  public saveMovimiento(movimiento: IMovimiento): Observable<IResponse> {
    return this._Http.post<IResponse>(this.urlBase+`save`, movimiento);
  }

  public saveMovimientoWhithTransaccion(movimiento: IMovimiento): Observable<IResponse> {
    return this._Http.post<IResponse>(this.urlBase+`saveWithTransaccion`, movimiento);
  }



  public updateMovimiento(id: number, movimiento: IMovimiento): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase+ `update/${id}`, movimiento);
  }

  public deleteMovimiento(id: number): Observable<IResponse> {
    return this._Http.delete<IResponse>(this.urlBase + `delete/${id}`);
  }
}
