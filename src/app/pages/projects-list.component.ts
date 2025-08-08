import { Component, OnInit, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { Project } from '../core/models/project.model'
import { ProjectService } from '../services/project.service'

@Component({
  standalone: true,
  selector: 'app-projects-list',
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  styles: [`
    .grid {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }
    mat-card {
      transition: transform .2s ease, box-shadow .2s ease;
    }
    mat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
  `],
  template: `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
      <h2>Projects</h2>
      <button mat-stroked-button color="primary">
        <mat-icon>add</mat-icon>
        New Project
      </button>
    </div>

    <div class="grid">
      @for (p of projects(); track p.id) {
        <mat-card class="card-surface">
          <mat-card-header>
            <mat-card-title>{{ p.name }}</mat-card-title>
            <mat-card-subtitle>{{ p.key }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ p.description || 'No description' }}</p>
          </mat-card-content>
          <mat-card-actions align="end">
            <a mat-button color="primary" [routerLink]="['/projects', p.id, 'board']">Board</a>
            <a mat-button [routerLink]="['/projects', p.id, 'backlog']">Backlog</a>
          </mat-card-actions>
        </mat-card>
      }
    </div>
  `
})
export class ProjectsListComponent implements OnInit {
  private readonly projectService = inject(ProjectService)
  projects = signal<Project[]>([])

  ngOnInit() {
    this.projectService.list().subscribe(ps => this.projects.set(ps as Project[]))
  }
}
