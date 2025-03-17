import { IUserViewOnly } from "./user.models";

export interface ILogin {
    username: string;
    password: string;    
}

export interface ILoginResponse {
    token:string;
    username: string;
    role: string;    
}





