import { Injectable, inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from './auth.service'

@Injectable({ providedIn: 'root' })
class AuthGuardService {
  constructor(private readonly auth: AuthService, private readonly router: Router) {}
  can(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']).then(r => {})
      return false
    }
    return true
  }
}

export const AuthGuard: CanActivateFn = () => {
  const svc = inject(AuthGuardService)
  return svc.can()
}
