import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environments';
import { ICompra, ICompras } from '../../models/metales/compra.models';
import { IResponse } from '../../models/response.models';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private _Http = inject(HttpClient);
  private urlBase: string = environments.baseUrl + "/tools/ctrlPagos/metalesApp/compra/";
  constructor() { }

  getComprasPaginador(cantidad: number, pagina: number, username:string): Observable<ICompras> {
    return this._Http.get<ICompras>(this.urlBase + `findAllPagination/${cantidad}/${pagina}?username=${username}`);

  }

  getComprasWithPaginador(cantidad: number,
    pagina: number,
    startBuyFilter: string | null,
    endBuyFilter: string | null,
    startSaleFilter: string | null,
    endSaleFilter: string | null,
    descriptionSaleFilter: string | null,
    username: string): Observable<ICompras> {
    let link = this.urlBase;
    if (startBuyFilter != null && endBuyFilter != null) {
      link = link + `findAllWithVentaPagination/${cantidad}/${pagina}?startBuyFilter=${startBuyFilter}&endBuyFilter=${endBuyFilter}`
    } else{
      link = link + `findAllWithVentaPagination/${cantidad}/${pagina}?startBuyFilter=not&endBuyFilter=not`
    }
    
    if (startSaleFilter != null && endSaleFilter != null) {
      link = link + `&startSaleFilter=${startSaleFilter}&endSaleFilter=${endSaleFilter}`
    } else{
      link = link + `&startSaleFilter=not&endSaleFilter=not`
    }
    
    if (descriptionSaleFilter != null) {
      link = link + `&descriptionSaleFilter=${descriptionSaleFilter}`
    }else{
      link = link + `&descriptionSaleFilter=not`
    }
    link = link + `&username=${username}`
    console.log(link);
    
    return this._Http.get<ICompras>(link);

  }

  getConsultaCompras(cantidad: number,
    pagina: number,
    startBuyFilter: string | null,
    endBuyFilter: string | null,
    startSaleFilter: string | null,
    endSaleFilter: string | null,
    descriptionSaleFilter: string | null,
    username: string): Observable<ICompra[]> {
    let link = this.urlBase;
    if (startBuyFilter != null && endBuyFilter != null) {
      link = link + `findAllWithVenta/${cantidad}/${pagina}?startBuyFilter=${startBuyFilter}&endBuyFilter=${endBuyFilter}`
    } else{
      link = link + `findAllWithVenta/${cantidad}/${pagina}?startBuyFilter=not&endBuyFilter=not`
    }
    
    if (startSaleFilter != null && endSaleFilter != null) {
      link = link + `&startSaleFilter=${startSaleFilter}&endSaleFilter=${endSaleFilter}`
    } else{
      link = link + `&startSaleFilter=not&endSaleFilter=not`
    }
    
    if (descriptionSaleFilter != null) {
      link = link + `&descriptionSaleFilter=${descriptionSaleFilter}`
    }else{
      link = link + `&descriptionSaleFilter=not`
    }
    link = link + `&username=${username}`
    console.log(link);
    
    return this._Http.get<ICompra[]>(link);

  }

  getCompra(id: number): Observable<ICompra> {
    return this._Http.get<ICompra>(this.urlBase + `find/${id}`);
  }

  getComprasNotVenta(username : string): Observable<ICompra[]> {
    return this._Http.get<ICompra[]>(this.urlBase + `findAllNotIdVenta?username=${username}`);
  }
  getComprasWithVenta(username : string): Observable<ICompra[]> {
    return this._Http.get<ICompra[]>(this.urlBase + `findAllWithIdVenta?username=${username}`);
  }

  getMaxIdCompra(username: string): Observable<number> {
    return this._Http.get<number>(this.urlBase + `findMaxId?username=${username}`);
  }

  public saveCompra(compra: ICompra): Observable<ICompra> {
    return this._Http.post<ICompra>(this.urlBase + `save`, compra);
  }

  public updateCompra(id: number, compra: ICompra): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `update/${id}`, compra);
  }

  public deleteCompra(id: number): Observable<IResponse> {
    return this._Http.delete<IResponse>(this.urlBase + `delete/${id}`);
  }
}
