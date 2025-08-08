import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { NgClass } from '@angular/common'
import { Issue } from '../core/models/issue.model'

@Component({
  standalone: true,
  selector: 'app-issue-card',
  imports: [MatCardModule, MatChipsModule, MatIconModule, NgClass],
  styles: [`
    .issue {
      cursor: grab;
    }
    .header {
      display: flex; align-items: center; gap: 8px;
    }
  `],
  template: `
    <mat-card class="card-surface issue" appearance="outlined" (dblclick)="open.emit(issue)">
      <mat-card-header>
        <div class="header">
          <mat-chip-set>
            <mat-chip [ngClass]="issue.type">{{ issue.type }}</mat-chip>
          </mat-chip-set>
          <span style="opacity:.8;">{{ issue.key }}</span>
        </div>
        <div class="spacer" style="flex:1"></div>
        <mat-icon [style.color]="priorityColor(issue.priority)" aria-hidden="true">flag</mat-icon>
      </mat-card-header>
      <mat-card-content>
        <div style="font-weight:600;">{{ issue.title }}</div>
        @if (issue.description) {
          <div style="opacity:.8; font-size:12px;">{{ issue.description }}</div>
        }
      </mat-card-content>
    </mat-card>
  `
})
export class IssueCardComponent {
  @Input() issue!: Issue
  @Output() open = new EventEmitter<Issue>()

  priorityColor(p: Issue['priority']) {
    switch (p) {
      case 'critical': return '#ef5350'
      case 'high': return '#ff9800'
      case 'medium': return '#ffd54f'
      default: return '#90caf9'
    }
  }
}
