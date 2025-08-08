import { Component, inject } from '@angular/core'
import { AuthService } from '../core/auth.service'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [MatCardModule, MatButtonModule],
  template: `
    <h2 style="margin-bottom:12px;">Profile</h2>
    <mat-card class="card-surface">
      <mat-card-content>
        @if (auth.user(); as u) {
          <p><strong>Name:</strong> {{ u.name }}</p>
          <p><strong>Email:</strong> {{ u.email }}</p>
          <p><strong>Role:</strong> {{ u.role }}</p>
        } @else {
          <p>Not signed in.</p>
        }
      </mat-card-content>
    </mat-card>
  `
})
export class ProfileComponent {
  auth = inject(AuthService)
}
