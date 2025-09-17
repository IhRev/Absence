import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, EMPTY, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const accessToken = localStorage.getItem('accessToken');
  const router = inject(Router);
  const authService = inject(AuthService);

  const cloned = accessToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !req.url.includes('/refresh')) {
        return authService.refreshToken().pipe(
          switchMap((result) => {
            if (result.isSuccess) {
              const newToken = localStorage.getItem('accessToken');
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next(retryReq);
            }
            authService.logoutLocally();
            router.navigate(['/login']);
            return EMPTY;
          })
        );
      }
      return throwError(() => err);
    })
  );
};
