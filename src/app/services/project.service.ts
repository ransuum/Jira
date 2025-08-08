import { Injectable, signal } from '@angular/core'
import { ApiService } from '../core/api.service'
import { Project } from '../core/models/project.model'
import { catchError, map, of, tap } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ProjectService {
  projects = signal<Project[]>([])

  constructor(private readonly api: ApiService) {}

  list() {
    return this.api.get<Project[]>('/projects').pipe(
      map(response => response as unknown as Project[]),
      tap(ps => this.projects.set(ps)),
      catchError(() => {
        const demo: Project[] = [
          { id: 'P1', key: 'PROJ', name: 'Demo Project', description: 'Sample project for board and backlog', leadId: '1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        ]
        this.projects.set(demo)
        return of(demo)
      })
    )
  }

  get(id: string) {
    return this.api.get<Project>(`/projects/${id}`).pipe(
      map(response => response as unknown as Project),
      catchError(() => of(this.projects().find(p => p.id === id)))
    )
  }
}
