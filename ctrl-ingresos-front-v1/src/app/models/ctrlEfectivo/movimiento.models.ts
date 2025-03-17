import { IUser } from "../user.models";
import { ICuenta } from "./cuenta.models";
import { ITransaccion } from "./transaccion.models";


export interface IMovimiento{
    id:number|null;
    fecha:Date;
    tipoMovimiento:string;
    comentario:string;
    monto:number;
    cuenta: ICuenta;
    transaccion: ITransaccion | null;
    usuario: IUser | null; 
    
}

export interface IMovimientoConsulta{
    fecha:Date;
    tipo_movimiento:string;
    monto: number;
    sobre_descripcion: string;
    sobre_descripcion_destino: string|null;
    comentario: String|null;
}

export interface IMovimientos {
    cantidadTotal: number;
    elementos: IMovimiento[];
}

export interface ITipoMovimiento{
    id: string;
    descripcion:string;
}

export interface IInfoMovimiento{
    valor : number,
    descripcion: string
}
