export type IssueStatus = "todo" | "in_progress" | "done";
export type IssuePriority = "low" | "medium" | "high" | "critical";
export type IssueLabel = "bug" | "feature" | "improvement";

export interface Issue {
  id: string;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  label: IssueLabel;
  spaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Update your existing Classification type to include optional issues
export interface Classification {
  id: string;
  name: string;
  issues?: Issue[]; // Optional because we might not always fetch them
  createdAt: Date

  _count?: {
    issues: number;
  };
}