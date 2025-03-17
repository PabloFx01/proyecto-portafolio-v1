import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environments.prod';
import { IResponse } from '../../models/response.models';
import { IWishList, IWishLists } from '../../models/wishList/wishList.models';

@Injectable({
  providedIn: 'root'
})
export class WishListService {

  private _Http = inject(HttpClient);
  private urlBase: string = environments.baseUrl +"/tools/ctrlPagos/wish-list/wish-list/";
  constructor() { }

  getWishListPaginadorByUsername(cantidad: number, pagina: number,state : string, filter: string | null, username: string): Observable<IWishLists> {
    if (filter == null) {
      return this._Http.get<IWishLists>(this.urlBase + `findAllPaginadoByUsername/${cantidad}/${pagina}/${state}?filter=not&username=${username}`);
    } else {
      return this._Http.get<IWishLists>(this.urlBase + `findAllPaginadoByUsername/${cantidad}/${pagina}/${state}?filter=${filter}&username=${username}`);
    }
  }

  getWishList(id: number): Observable<IWishList> {
    return this._Http.get<IWishList>(this.urlBase + `find/${id}`);
  }

  getWishListsNotFin(username: string): Observable<IWishList[]> {
    return this._Http.get<IWishList[]>(this.urlBase + `findAllNotFinAndChildrenByUser?username=${username}`);
  }

  getWishListsFin(username: string): Observable<IWishList[]> {
    return this._Http.get<IWishList[]>(this.urlBase + `findAllFinAndChildrenByUser?username=${username}`);
  }



  public saveWishList(wishList: IWishList): Observable<IResponse> {
    return this._Http.post<IResponse>(this.urlBase+`save`, wishList);
  }

  public updateWishList(id: number, wishList: IWishList): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase+ `update/${id}`, wishList);
  }
  public finalWish(id: number, wishList: IWishList): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase+ `finalWish/${id}`, wishList);
  }

  public procesarWishList(id: number, wishList: IWishList): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase+ `procesarWishList/${id}`, wishList);
  }



  // public procesarWishList(idWishList: number, wishList: IWishList): Observable<IResponse> {
  //   return this._Http.put<IResponse>(this.urlBase + `procesarWishList/${idWishList}`, wishList);
  // }


  public deleteWishList(id: number): Observable<IResponse> {
    return this._Http.delete<IResponse>(this.urlBase + `delete/${id}`);
  }
}
