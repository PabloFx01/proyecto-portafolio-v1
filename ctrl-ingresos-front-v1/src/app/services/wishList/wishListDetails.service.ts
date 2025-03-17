import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '../../../environments/environments.prod';
import { Observable } from 'rxjs';
import { IResponse } from '../../models/response.models';
import { IWishListDetail } from '../../models/wishList/wishList.models';



@Injectable({
  providedIn: 'root'
})
export class WishListDetailService {
  private _Http = inject(HttpClient);
  private urlBase : string = environments.baseUrl + "/tools/ctrlPagos/wish-list/wish-list/details/"

  constructor() { }

  getDetalleWish(id: number, idWish: number): Observable<IWishListDetail> {
    return this._Http.get<IWishListDetail>(this.urlBase + `findDWByIdAndIdWishList/${id}/${idWish}`);
  }

  getAllDetalleWish(idWish: number):Observable<IWishListDetail[]>{
    return this._Http.get<IWishListDetail[]>(this.urlBase + `findAllByIdWish/${idWish}`) 
  }

  public saveDetalleWish(detalleWish: IWishListDetail): Observable<IWishListDetail> {
    return this._Http.post<IWishListDetail>(this.urlBase + `save`, detalleWish);
  }

  public updateWishListDetail(id: number, idWish: number, WishListDetail: IWishListDetail): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `update/${id}/${idWish}`, WishListDetail);
  }
  public updateProcesarWish(id: number, idWish: number, WishListDetail: IWishListDetail): Observable<IResponse> {
    return this._Http.put<IResponse>(this.urlBase + `updateProcesarWish/${id}/${idWish}`, WishListDetail);
  }

  public deleteWishListDetail(id: number, idWish: number): Observable<IResponse> {
    return this._Http.delete<IResponse>(this.urlBase + `delete/${id}/${idWish}`);
  }


}
