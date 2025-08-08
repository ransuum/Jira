import { Component, inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatButtonModule } from '@angular/material/button'
import { Issue, IssuePriority, IssueStatus, IssueType } from '../core/models/issue.model'

@Component({
  standalone: true,
  selector: 'app-issue-dialog',
  imports: [
    MatDialogModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Edit Issue {{ data.key }}</h2>
    <div mat-dialog-content>
      <form [formGroup]="form" style="display:grid; gap:12px;">
        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput rows="4" formControlName="description"></textarea>
        </mat-form-field>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px;">
          <mat-form-field appearance="outline">
            <mat-label>Type</mat-label>
            <mat-select formControlName="type">
              @for (t of types; track t) {
                <mat-option [value]="t">{{ t }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              @for (s of statuses; track s) {
                <mat-option [value]="s">{{ s }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority">
              @for (p of priorities; track p) {
                <mat-option [value]="p">{{ p }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" (click)="save()">Save</button>
    </div>
  `
})
export class IssueDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<IssueDialogComponent>);
  readonly data = inject<Issue>(MAT_DIALOG_DATA);

  types: IssueType[] = ['task', 'bug', 'story']
  statuses: IssueStatus[] = ['todo', 'in-progress', 'review', 'done']
  priorities: IssuePriority[] = ['low', 'medium', 'high', 'critical']

  form = this.fb.nonNullable.group({
    title: this.data.title,
    description: this.data.description ?? '',
    type: this.data.type,
    status: this.data.status,
    priority: this.data.priority
  })

  save() {
    this.ref.close(this.form.getRawValue())
  }
}
