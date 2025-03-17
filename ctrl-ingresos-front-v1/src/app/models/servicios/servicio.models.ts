import { IUser } from "../user.models";

export interface IServicios {
    cantidadTotal: number;
    elementos:     IServicio[];
}

export interface IServicio{
    id:number | null,
    nombre: string | null,
    valor: number | null,
    periodoPago: number | null,
    fechaIniVto : Date | null,
    fechaFinVto : Date | null,
    comentario : string | null,
    activo : boolean | null,
    usuario : IUser | null
}

export interface IPeriodPay{
    id: number;
    descripcion:string;
}