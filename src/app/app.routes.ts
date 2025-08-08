import { Routes } from '@angular/router'
import { AuthGuard } from './core/auth.guard'
import {ProjectBoardComponent} from './pages/projects-backlog.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./layout/app-shell.component').then(m => m.AppShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'projects' },
      {
        path: 'projects',
        loadComponent: () => import('./pages/projects-list.component').then(m => m.ProjectsListComponent)
      },
      {
        path: 'projects/:id/board',
        loadComponent: () => import('./pages/projects-board.component').then(m => m.ProjectBoardComponent)
      },
      {
        path: 'projects/:id/backlog',
        loadComponent: () => import('./pages/projects-backlog.component').then(m => m.ProjectBoardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found.component').then(m => m.NotFoundComponent)
  }
]
