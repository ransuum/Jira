import { Component, inject, signal } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { AuthService } from '../core/auth.service'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule
  ],
  styleUrls: ['./styles/auth-layout.scss'],
  styles: [`
    mat-card {
      max-width: 420px;
    }
  `],
  template: `
    <div class="page">
      <!-- Hero Section (Left) -->
      <div class="hero">
        <div class="hero-inner">
          <h1 class="hero-title">Welcome to Angular Project Manager</h1>
          <p class="hero-sub">Streamline your development workflow with our powerful project management tools</p>
        </div>
      </div>

      <!-- Form Section (Right) -->
      <div class="form-col">
        <mat-card class="card-surface" appearance="outlined">
          <mat-card-header>
            <mat-card-title>Welcome back</mat-card-title>
            <mat-card-subtitle>Sign in to continue</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" required autocomplete="email" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <input matInput [type]="hide() ? 'password' : 'text'" formControlName="password" required autocomplete="current-password" />
                <button type="button" mat-icon-button matSuffix (click)="hide.set(!hide())" [attr.aria-label]="hide() ? 'Show password' : 'Hide password'">
                  <mat-icon>{{ hide() ? 'visibility' : 'visibility_off' }}</mat-icon>
                </button>
              </mat-form-field>

              <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading()">
                {{ loading() ? 'Signing in...' : 'Sign In' }}
              </button>
            </form>

            <div class="muted">
              No account? <a routerLink="/register">Create one</a>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder)
  private readonly auth = inject(AuthService)
  private readonly snack = inject(MatSnackBar)
  private readonly router = inject(Router)

  hide = signal(true)
  loading = signal(false)

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  onSubmit() {
    if (this.form.invalid) return
    this.loading.set(true)
    const { email, password } = this.form.value
    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading.set(false)
        this.router.navigate(['/projects']).then(r => {})
      },
      error: (err) => {
        this.loading.set(false)
        this.snack.open(err?.error?.message || 'Login failed', 'Close', { duration: 3000 })
      }
    })
  }
}
