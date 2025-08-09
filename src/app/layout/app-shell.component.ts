import { Component, computed, inject } from '@angular/core'
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { AuthService } from '../core/auth.service'

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [
    RouterOutlet, RouterLink, MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule, RouterLinkActive
  ],
  styles: [`
    .shell {
      height: calc(100dvh - 0px);
    }
    .sidenav {
      width: 280px;
      background: var(--panel);
      border-right: 1px solid rgba(255,255,255,0.06);
    }
    .topbar {
      position: sticky;
      top: 0;
      z-index: 10;
      background: linear-gradient(90deg, #18212b, #121a23);
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .brand {
      font-weight: 700;
      letter-spacing: .4px;
    }
  `],
  template: `
    <div class="app-container">
      <mat-toolbar class="topbar" color="primary">
        <button mat-icon-button (click)="drawer.toggle()" aria-label="Toggle navigation">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="brand" style="margin-left:8px;">Angular Jira Clone</span>
        <span class="spacer" style="flex:1"></span>
        <a routerLink="/profile" mat-button>
          <mat-icon>person</mat-icon>
          {{ userName() }}
        </a>
        <button mat-button (click)="logout()" aria-label="Sign out">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </mat-toolbar>

      <mat-sidenav-container class="shell">
        <mat-sidenav #drawer class="sidenav" mode="side" opened>
          <mat-nav-list>
            <a mat-list-item routerLink="/projects" routerLinkActive="active">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Projects</span>
            </a>
            <a mat-list-item [routerLink]="['/projects', sampleProjectId, 'board']">
              <mat-icon matListItemIcon>view_kanban</mat-icon>
              <span matListItemTitle>Board</span>
            </a>
            <a mat-list-item [routerLink]="['/projects', sampleProjectId, 'backlog']">
              <mat-icon matListItemIcon>list_alt</mat-icon>
              <span matListItemTitle>Backlog</span>
            </a>
            <a mat-list-item routerLink="/profile">
              <mat-icon matListItemIcon>person</mat-icon>
              <span matListItemTitle>Profile</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="content-scroll" style="padding:16px;">
          <router-outlet />
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `
})
export class AppShellComponent {
  private readonly auth = inject(AuthService)
  private readonly router = inject(Router)
  sampleProjectId = 'P1'

  userName = computed(() => this.auth.user()?.username ?? 'Guest')

  logout() {
    this.auth.logout()
    this.router.navigate(['/login'])
  }
}
