import { Component, inject, signal } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'

import { AuthService } from '../core/auth.service'

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule
  ],
  styleUrls: ['../auth/styles/auth-layout.scss'], // Reference the external file
  styles: [`
    mat-card {
      max-width: 480px; /* Register-specific width */
    }
  `],
  template: `
    <div class="page">
      <!-- Hero Section (Left) -->
      <div class="hero">
        <div class="hero-inner">
          <h1 class="hero-title">Join Angular Project Manager</h1>
          <p class="hero-sub">Create your account and start building amazing projects with your team</p>
        </div>
      </div>

      <!-- Form Section (Right) -->
      <div class="form-col">
        <mat-card class="card-surface" appearance="outlined">
          <mat-card-header>
            <mat-card-title>Create your account</mat-card-title>
            <mat-card-subtitle>Start collaborating in minutes</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline">
                <mat-label>Username</mat-label>
                <input matInput formControlName="username" required autocomplete="username" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" required autocomplete="email" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <input matInput type="password" formControlName="password" required autocomplete="new-password" />
              </mat-form-field>

              <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading()">
                {{ loading() ? 'Creating...' : 'Create Account' }}
              </button>
            </form>

            <div class="muted">
              Already have an account? <a routerLink="/login">Sign in</a>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder)
  private readonly auth = inject(AuthService)
  private readonly snack = inject(MatSnackBar)
  private readonly router = inject(Router)

  loading = signal(false)

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]], // Changed from 'name'
    email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(50),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*#?&_-]+$/)
    ]]
  })

  onSubmit() {
    if (this.form.invalid) return
    this.loading.set(true)
    const { username, email, password } = this.form.value
    this.auth.register(username, email, password).subscribe({
      next: () => {
        this.loading.set(false)
        this.router.navigate(['/projects']).then(_ => {})
      },
      error: (err) => {
        this.loading.set(false)
        // Handle validation errors from backend
        if (err.status === 400 && Array.isArray(err.error)) {
          this.snack.open(err.error.join(', '), 'Close', { duration: 5000 })
        } else {
          this.snack.open(err?.error?.message || 'Registration failed', 'Close', { duration: 3000 })
        }
      }
    })
  }
}
