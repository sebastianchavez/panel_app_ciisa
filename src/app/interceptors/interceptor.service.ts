import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {
  constructor(private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler,): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({
      'Authorization': localStorage.getItem('accessToken') ? `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}` : ''
    })

    const reqClone = req.clone({
      headers
    })
    return next.handle(reqClone)
    .pipe(
      tap(evt => {
        if (evt instanceof HttpResponse) {
            if(evt.body && evt.body.success){
              console.log('ok')
            }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('INTERCEPTOR', error)
        if (error instanceof HttpErrorResponse) {
          if(error.status === 401 || error.error.statusCode == 401){
            Swal.fire({icon: 'error', title: 'Token expirado'}).then(res => {
              localStorage.clear()
              this.router.navigateByUrl('/login');
              return throwError( error)
            })
          } else {
            return throwError( error )
          }
        }
      })
    )
  }
}
