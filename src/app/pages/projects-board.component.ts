import { Component, OnInit, inject, computed, signal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { CdkDropListGroup, CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { Issue, IssueStatus } from '../core/models/issue.model'
import { IssueService } from '../services/issue.service'
import { IssueCardComponent } from '../shared/issue-card.component'
import { IssueDialogComponent } from '../shared/issue-dialog.component'

@Component({
  standalone: true,
  selector: 'app-project-board',
  imports: [
    CdkDropListGroup, CdkDropList, CdkDrag,
    MatCardModule, MatButtonModule, MatIconModule, MatDialogModule,
    IssueCardComponent
  ],
  styles: [`
    .board {
      display: grid;
      grid-auto-flow: column;
      gap: 16px;
      align-items: start;
    }
    .column {
      width: 320px;
    }
    .column-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
    }
    .list {
      min-height: 80px;
      display: grid;
      gap: 10px;
      padding: 12px;
    }
  `],
  template: `
    <h2 style="margin-bottom:12px;">Board</h2>
    <div class="board" cdkDropListGroup>
      @for (col of columns; track col.status) {
        <mat-card class="column card-surface">
          <div class="column-header">
            <strong>{{ col.title }}</strong>
            <button mat-icon-button (click)="createIssue(col.status)" aria-label="Add issue"><mat-icon>add</mat-icon></button>
          </div>
          <div class="list"
               [cdkDropListData]="byStatus(col.status)()"
               cdkDropList
               (cdkDropListDropped)="drop($event, col.status)">
            @for (issue of byStatus(col.status)(); track issue.id) {
              <app-issue-card
                cdkDrag
                [issue]="issue"
                (open)="openIssue(issue)">
              </app-issue-card>
            }
          </div>
        </mat-card>
      }
    </div>
  `
})
export class ProjectBoardComponent implements OnInit {
  private readonly route = inject(ActivatedRoute)
  private readonly issueService = inject(IssueService)
  private readonly dialog = inject(MatDialog)

  projectId = signal<string>('')

  columns = [
    { title: 'To Do', status: 'todo' as IssueStatus },
    { title: 'In Progress', status: 'in-progress' as IssueStatus },
    { title: 'In Review', status: 'review' as IssueStatus },
    { title: 'Done', status: 'done' as IssueStatus }
  ]

  issues = this.issueService.issues

  byStatus = (s: IssueStatus) => computed(() => this.issues().filter(i => i.status === s))

  ngOnInit() {
    this.projectId.set(this.route.snapshot.paramMap.get('id') ?? '')
    this.issueService.loadForProject(this.projectId())
  }

  drop(event: CdkDragDrop<Issue[]>, targetStatus: IssueStatus) {
    // Extract actual arrays from container data
    const prevData = [...event.previousContainer.data]
    const currentData = [...event.container.data]

    if (event.previousContainer === event.container) {
      moveItemInArray(currentData, event.previousIndex, event.currentIndex)
      // Update the signal with the new array
      this.updateIssuesAfterDrop(currentData, targetStatus)
    } else {
      transferArrayItem(prevData, currentData, event.previousIndex, event.currentIndex)
      const moved = currentData[event.currentIndex]
      // Update the signal and status
      this.updateIssuesAfterDrop(currentData, targetStatus)
      this.issueService.updateStatus(moved.id, targetStatus)
    }
  }

  private updateIssuesAfterDrop(updatedList: Issue[], status: IssueStatus) {
    // Update the main issues array with the changed items
    const otherIssues = this.issues().filter(i => i.status !== status)
    this.issueService.issues.set([...otherIssues, ...updatedList])
  }

  createIssue(status: IssueStatus) {
    this.issueService.quickCreate(this.projectId(), status)
  }

  openIssue(issue: Issue) {
    this.dialog.open(IssueDialogComponent, { data: issue, width: '640px' })
  }
}
