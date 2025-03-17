import { IUser } from "../user.models";
import { IDetalleIngreso } from "./detalleIngreso.models";

export interface IIngresos {
    cantidadTotal: number;
    elementos: IIngreso[];
}

export interface IIngreso {
    id: number | null,
    montoIngreso: number ,
    detallesIngreso: IDetalleIngreso[] | null,
    fechaDeposito: Date ,
    comentario: string ,
    tmoneda: string ,
    asociarConceptos: boolean,
    usuario: IUser  | null
}

export interface IInfoIngreso{
    valor : number,
    descripcion: string
}