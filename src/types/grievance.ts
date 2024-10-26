// app/types/grievance.ts
export interface Grievance {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "resolved" | "rejected";
  createdAt: number;
  createdBy: string;
  isAnonymous?: boolean;
  adminMessage: string;
  department: string;
}
