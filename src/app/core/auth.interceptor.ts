import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http'
import { inject } from '@angular/core'
import { AuthService } from './auth.service'
import { catchError, switchMap, throwError } from 'rxjs'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService)
  const token = auth.token()

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // If token expired, try to refresh
      if (error.status === 401 && auth.isTokenExpired()) {
        return auth.refreshToken().pipe(
          switchMap(() => {
            // Retry the original request with new token
            const newToken = auth.token()
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            })
            return next(retryReq)
          }),
          catchError((refreshError) => {
            // Refresh failed, redirect to login
            auth.logout()
            return throwError(() => refreshError)
          })
        )
      }
      return throwError(() => error)
    })
  )
}
