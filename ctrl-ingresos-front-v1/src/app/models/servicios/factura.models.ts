import { IUser } from "../user.models";
import { IServicio } from "./servicio.models";

export interface IFacturas {
    cantidadTotal: number;
    elementos: IFactura[];
}

export interface IDetallesFacturas {
    cantidadTotal: number;
    elementos: IDetalleFactura[];
}

export interface IFactura {
    id: number | null;
    fecha: Date | null;
    detallesFactura: IDetalleFactura[] | null;
    servicio: IServicio | null;
    saldoRest: number | null;
    totPag: number | null;
    estado: boolean | null;
    fechaPagoTotVto: Date | null;
    usuario: IUser | null;
}

export interface IDetalleFacturaId {
    id: number | null;
    idFactura: number | null;
}
export interface IDetalleFactura {
    detalleFacturaId: IDetalleFacturaId | null;
    fechaPago: Date | null;
    pago: number | null;
}

export interface IEstados {
    nombre : string | null;
    valor: boolean | null;
}