import { IUser } from "../user.models";

export interface IMetalCompras {
    cantidadTotal: number;
    elementos:     IMetalCompra[];
}

export interface IMetalCompra {
    metalId:      MetalId | null;
    nombre:       string;
    precio:       number;
    fechaIni:     Date|null;
    fechaFin:     Date | null;
    editadoPor:   string;
    modificadoEl: Date|null;
    usuario: IUser | null
}

export interface MetalId {
    id:     string ;    
}