import { IUser } from "../user.models"

export interface IConceptos {
    cantidadTotal: number;
    elementos:     IConcepto[];
}

export interface IConcepto {
    conceptoId : IConceptoId | null,
    nombre: string | null,
    porcentaje: number | null,
    activo: boolean | null,
    usuario : IUser | null
}

export interface IConceptoId {
    idConcepto : number | null,
    idUsuario: number | null
}