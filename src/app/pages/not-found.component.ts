import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'

@Component({
  standalone: true,
  selector: 'app-not-found',
  imports: [RouterLink, MatButtonModule],
  template: `
    <div style="min-height:60dvh; display:grid; place-items:center; text-align:center;">
      <div>
        <h1>404</h1>
        <p>We couldn't find that page.</p>
        <a mat-stroked-button color="primary" routerLink="/">Go Home</a>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
