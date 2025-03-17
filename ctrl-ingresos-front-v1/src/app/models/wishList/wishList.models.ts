import { ICuenta } from "../ctrlEfectivo/cuenta.models";
import { IUser } from "../user.models";

export interface IWishList {
    id: number | null;
    wishListDetails: IWishListDetail[] | null;
    titulo: string | null;
    fechaCreacion: Date | null;
    meta: string | null;
    cuentaOrigen: ICuenta | null;
    estado: boolean | null;
    fechaFin: Date | null;
    procesarWish: boolean | null;
    usuario: IUser | null;
}

export interface IWishLists {
    cantidadTotal: number;
    elementos: IWishList[];
}

export interface IWishDetailId {
    id: number | null;
    idWish: number | null;
}
export interface IWishListDetail {
    wishDetailId: IWishDetailId | null;
    fechaDetail: Date | null;
    itemName: string | null;
    precio: number | null;
    comentario: string | null;
    link: string | null;
    procesarDetail: boolean | null;
    wishList: IWishList | null;
}