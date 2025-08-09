import { Injectable, signal } from '@angular/core'
import { ApiService } from './api.service'
import { map, tap } from 'rxjs/operators'
import { User, AuthResponse, SignInRequest, SignUpRequest } from './models/user.model'

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

  private persist(authResponse: AuthResponse) {
    // Convert expiry to absolute timestamp if it's not already
    const now = Math.floor(Date.now() / 1000)
    const expiryTimestamp = authResponse.access_token_expiry > now + (24 * 60 * 60)
      ? authResponse.access_token_expiry  // Already absolute timestamp
      : now + authResponse.access_token_expiry  // Relative seconds, convert to absolute

    const user: User = {
      username: authResponse.user_name,
      email: '',
      accessToken: authResponse.access_token,
      accessTokenExpiry: expiryTimestamp, // Use calculated timestamp
      tokenType: authResponse.token_type
    }

    console.log('Persisting user:', user)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    localStorage.setItem(TOKEN_KEY, authResponse.access_token)
    this.user.set(user)
  }

  private clearAuth() {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
    this.user.set(null)
  }

  token(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  login(email: string | null | undefined, password: string | null | undefined) {
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    const signInRequest: SignInRequest = { email, password }

    return this.api.post<AuthResponse>('/sign-in', signInRequest).pipe(
      map(response => response as unknown as AuthResponse),
      tap(authResponse => this.persist(authResponse))
    )
  }

  register(username: string | null | undefined, email: string | null | undefined, password: string | null | undefined) {
    if (!username || !email || !password) {
      throw new Error('Username, email and password are required')
    }

    const signUpRequest: SignUpRequest = {
      username,
      email,
      password,
      providerId: undefined // Optional field
    }

    return this.api.post<AuthResponse>('/sign-up', signUpRequest).pipe(
      map(response => response as unknown as AuthResponse),
      tap(authResponse => this.persist(authResponse))
    )
  }

  refreshToken() {
    return this.api.post<AuthResponse>('/refresh-token', {}).pipe(
      map(response => response as unknown as AuthResponse),
      tap(authResponse => this.persist(authResponse))
    )
  }

  logout() {
    this.clearAuth()
    // Optionally call a logout endpoint if you have one
    // this.api.post('/logout', {}).subscribe()
  }

  isAuthenticated(): boolean {
    const user = this.user()
    console.log('Checking authentication for user:', user)

    if (!user || !user.accessToken) {
      console.log('No user or access token')
      return false
    }

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000)
    const isValid = user.accessTokenExpiry > now
    console.log(`Token expiry: ${user.accessTokenExpiry}, Now: ${now}, Valid: ${isValid}`)

    return isValid
  }

  isTokenExpired(): boolean {
    const user = this.user()
    if (!user) return true

    const now = Math.floor(Date.now() / 1000)
    return user.accessTokenExpiry <= now
  }
}
