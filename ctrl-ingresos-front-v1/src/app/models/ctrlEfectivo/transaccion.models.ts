import { ICuenta } from "./cuenta.models";

export interface ITransaccion{
    id:number | null;
    tipoTransaccion:string | null;
    cantidad: number;
    fecha:Date;
    cuentaOrigen:ICuenta;
    cuentaDestino:ICuenta;

}

export interface ITransacciones{
    cantidadTotal: number;
    elementos: ITransaccion[];
}