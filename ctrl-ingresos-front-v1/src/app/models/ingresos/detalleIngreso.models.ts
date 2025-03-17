import { IConcepto } from "./concepto.models"
import { IIngreso } from "./ingreso.models"
import { IPorcentajeXConcepto } from "./porcentajeXConcepto.models"
import { IUser } from "../user.models"

export interface IDetalleIngreso {
    detalleIngresoId: IDetalleIngresoId | null,
    concepto: IConcepto | null,
    montoPorcentaje: number | null,
    montoPorcentajeRest: number | null;
    pctXCpto: IPorcentajeXConcepto | null,
    idPctXCpto: number | null;
    usuario: IUser | null,
    ingreso : IIngreso | null
}

export interface IDetalleIngresoId {
    id: number | null,
    idIngreso: number| null
}