import { IUser } from "../user.models";
import { IMetalCompra } from "./metal-compra.models";
import { IMetalVenta } from "./metal-venta.models";

export interface ITickets {
    cantidadTotal: number;
    elementos:     ITicket[];
}

export interface IDetalleTicket {
    detalleId:   DetalleTicketId;
    metal:       IMetalCompra;
    metalAsociadoTicket: IMetalVenta;
    pesoVendido: number;
    precioVenta: number;
    importe: number;
    ticket:      ITicket | null;

}

export interface ITicket {
    id:             number;
    descripcion:    string;
    fechaTicket:    Date | null;
    detalleTicket?: IDetalleTicket[];
    importTotal: number | null;
    used: boolean;
    editadoPor:     null|string;
    modificadoEl:   null|Date;
    usuario: IUser | null;
}

export interface DetalleTicketId {
    id:       number;
    idTicket: number;
}

export interface IDetallesTicket {
    cantidadTotal: number;
    elementos:     IDetalleTicket[];
}
