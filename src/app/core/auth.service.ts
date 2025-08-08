import { Injectable, signal } from '@angular/core'
import { ApiService } from './api.service'
import { map, tap } from 'rxjs/operators'
import { User } from './models/user.model'

const TOKEN_KEY = 'ajc_token'
const USER_KEY = 'ajc_user'

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<User | null>(this.loadUser())

  constructor(private readonly api: ApiService) {}

  private loadUser(): User | null {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  }

  private persist(user: User | null) {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      if (user.token) localStorage.setItem(TOKEN_KEY, user.token)
    } else {
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(TOKEN_KEY)
    }
    this.user.set(user)
  }

  token(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  login(email: string | null | undefined, password: string | null | undefined) {
    return this.api.post<User>('/auth/login', { email, password }).pipe(
      map(response => response as unknown as User),
      tap(u => this.persist(u))
    )
  }

  register(name: string | null | undefined, email: string | null | undefined, password: string | null | undefined) {
    return this.api.post<User>('/auth/register', { name, email, password }).pipe(
      map(response => response as unknown as User),
      tap(u => this.persist(u))
    )
  }

  logout() {
    this.persist(null)
  }

  isAuthenticated(): boolean {
    return !!this.user() && !!this.token()
  }
}
