import { Injectable, signal } from '@angular/core'
import { ApiService } from '../core/api.service'
import { Issue, IssuePriority, IssueStatus, IssueType } from '../core/models/issue.model'
import { catchError, map, of, tap } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class IssueService {
  issues = signal<Issue[]>([])

  constructor(private readonly api: ApiService) {}

  loadForProject(projectId: string) {
    this.api.get<Issue[]>(`/projects/${projectId}/issues`).pipe(
      map(response => response as unknown as Issue[]),
      tap(list => this.issues.set(list)),
      catchError(() => {
        const demo = this.demoData(projectId)
        this.issues.set(demo)
        return of(demo)
      })
    ).subscribe()
  }

  updateStatus(issueId: string, status: IssueStatus) {
    const current = this.issues().map(i => i.id === issueId ? { ...i, status } : i)
    this.issues.set(current)
    this.api.put(`/issues/${issueId}`, { status })
      .pipe(map(response => response))
      .subscribe({ error: () => {} })
  }

  quickCreate(projectId: string, status: IssueStatus) {
    const now = new Date().toISOString()
    const newIssue: Issue = {
      id: crypto.randomUUID(),
      key: `PROJ-${Math.floor(Math.random() * 1000)}`,
      title: 'New Issue',
      description: '',
      type: 'task',
      status,
      priority: 'medium',
      createdAt: now,
      updatedAt: now
    }
    this.issues.set([newIssue, ...this.issues()])
    this.api.post(`/projects/${projectId}/issues`, newIssue)
      .pipe(map(response => response))
      .subscribe({ error: () => {} })
  }

  private demoData(projectId: string): Issue[] {
    const mk = (n: number, title: string, type: IssueType, status: IssueStatus, priority: IssuePriority): Issue => ({
      id: `${projectId}-${n}`,
      key: `PROJ-${n}`,
      title,
      type,
      status,
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    return [
      mk(1, 'Build authentication flows', 'task', 'todo', 'high'),
      mk(2, 'Fix login validation bug', 'bug', 'in-progress', 'critical'),
      mk(3, 'Implement board drag & drop', 'story', 'review', 'medium'),
      mk(4, 'Add backlog search', 'task', 'done', 'low'),
      mk(5, 'Dark theme polish', 'task', 'todo', 'low')
    ]
  }
}
