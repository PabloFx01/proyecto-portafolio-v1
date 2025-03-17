import { IUser } from "../user.models";
import { IMetalCompra } from "./metal-compra.models";

export interface InventarioId {
    id: number;
    metalId: string;    
}

export interface IInventario {
    inventarioId: InventarioId | null;
    metal: IMetalCompra | null;
    stock: number | null;
    fechaIni: Date | null ;
    importeTotal: number| null;
    fechaUltAct: Date | null;
    usuario : IUser | null
}

export interface IInventarios {
    cantidadTotal: number;
    elementos:     IInventario[];
}