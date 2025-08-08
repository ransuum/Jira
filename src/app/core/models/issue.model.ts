export type IssueType = 'task' | 'bug' | 'story'
export type IssueStatus = 'todo' | 'in-progress' | 'review' | 'done'
export type IssuePriority = 'critical' | 'high' | 'medium' | 'low'

export interface Issue {
  id: string
  type: IssueType
  key: string
  priority: IssuePriority
  title: string
  description?: string
  status: IssueStatus
  createdAt: string
  updatedAt: string
}
