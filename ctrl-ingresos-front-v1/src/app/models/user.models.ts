
export interface IUser {
    id: number | null;
    username: string;
    password?: string;
    role?: string;
}

export interface IUserViewOnly {
    username: string;
    role: string;
}

export interface IUsers {
    cantidadTotal: number;
    elementos: IUser[];
}

export interface IUserChangePass {
    username: string;
    oldPassword: string;
    newPassword: string;
}



