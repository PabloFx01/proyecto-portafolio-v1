import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
export const SpinnerInterceptor: HttpInterceptorFn = (req, next)=>
    next(req).pipe(catchError(handleErrorResponse))

function handleErrorResponse(error: HttpErrorResponse){
    const errorResponse = `Error status ${error.status}, message: ${error.message}`
    return throwError(()=>errorResponse);
}
