import { IUser } from "../user.models";

export interface ISobre{
    id:number | null;
    descripcion: string | null;
    activo?: boolean | null
    usuario: IUser | null;
}

export interface ISobres {
    cantidadTotal: number;
    elementos: ISobre[];
}





