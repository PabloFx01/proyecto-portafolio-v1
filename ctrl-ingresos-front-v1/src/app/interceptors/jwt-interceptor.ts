import { HttpInterceptorFn } from "@angular/common/http";
import { LoginService } from "../services/login.service";
import { inject } from "@angular/core";


export const jwtInterceptor: HttpInterceptorFn = (req, next)=>{
    let loginService = inject(LoginService);
    let token:String= loginService.userToken;
   
    if (token!=""){
      req=req.clone(
        {
          setHeaders: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
    }
    return next(req);
}

 

