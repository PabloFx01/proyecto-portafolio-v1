import { ICuenta } from "../ctrlEfectivo/cuenta.models";
import { IUser } from "../user.models";

export interface IPrestamo {
    id: number | null;
    detallePrestamo: IDetallePrestamo[] | null;
    titulo: string | null;
    fechaCreacion: Date | null;
    monto: number | null;
    interes: number | null;
    cuotas: number | null;
    totAPagar: number | null;
    cuentaOrigen: ICuenta | null;
    cuentaBeneficiario: ICuenta | null;
    saldoRest: number | null;
    totPag: number | null;
    estado: boolean | null;
    procesarPrestamo:boolean | null;
    fechaTotPagado: Date | null;
    usuario: IUser | null;
}

export interface IDetallePrestamo {
    detallePrestamoId: IDetallePrestamoId | null;
    fechaPago: Date | null;
    montoPago: number | null;
    pagoEfectuado: boolean | null;
}

export interface IDetallePrestamoId {
    id: number | null;
    idPrestamo: number | null;
}

export interface IPrestamos {
    cantidadTotal: number;
    elementos: IPrestamo[];
}

export interface ICoutasPay{
    id: number;
    descripcion:string;
    interes: number;
}
