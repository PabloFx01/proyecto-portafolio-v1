import { ISobre } from "./sobre.models";

export interface ICuenta{
    id:number | null;
    saldo: number | null;
    sobre: ISobre | null; 
}

export interface ICuentas {
    cantidadTotal: number;
    elementos: ICuenta[];
}





