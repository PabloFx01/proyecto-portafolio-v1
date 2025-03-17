import { IUser } from "../user.models";
import { IMetalCompra } from "./metal-compra.models";
import { IMetalVenta } from "./metal-venta.models";
import { ITicket } from "./ticket.models";

export interface IVentas {
    cantidadTotal: number;
    elementos: IVenta[];
}

export interface IVenta {
    id: number;
    descripcion: string;
    ticket: null | ITicket;
    fechaVenta: Date | null;
    ventaIndividual: boolean;
    gananciaTotal: null | number;
    detalleVenta?: IDetalleVenta[];
    editadoPor: null | string;
    modificadoEl: null | Date;
    usuario: IUser | null;
}

export interface IDetallesVenta {
    cantidadTotal: number;
    elementos: IDetalleVenta[];
}

export interface DetalleVentaId {
    id: number;
    idVenta: number;
}

export interface IDetalleVenta {
    detalleId: DetalleVentaId | null;
    metal: IMetalCompra;
    metalAsociadoVenta: IMetalVenta;
    pesoVendido: number;
    precioPromedio: null | number;
    gananciaUnitaria: null | number;
    venta: IVenta | null;
}

export interface IFechasComprasAsociadas{
    fechaIni:Date|null,
    fechaFin:Date|null
}

