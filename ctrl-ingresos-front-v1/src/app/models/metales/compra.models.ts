import { IUser } from "../user.models";
import { IMetalCompra } from "./metal-compra.models";
import { IVenta } from "./venta.models";

export interface ICompras {
    cantidadTotal: number;
    elementos:     ICompra[];
}

export interface ICompra {
    id:            number | null;
    fechaCompra:   Date;
    detalleCompra: IDetalleCompra[];
    totalComprado: number;
    cierre: boolean;
    comentario?: string;
    ficticio?: boolean;
    venta: IVenta | null;
    editadoPor:    string;
    modificadoEl:  Date | null;
    usuario: IUser | null ;
}

export interface DetalleCompraId {
    id:      number;
    idCompra: number;
}

export interface IDetalleCompra {
    detalleId:  DetalleCompraId | null;
    metal:   IMetalCompra | null;
    peso:    number;
    precioCompra:    number;
    importe: number;
    compra: ICompra | null;
}

export interface IDetallesCompra {
    cantidadTotal: number;
    elementos:     IDetalleCompra[];
}

