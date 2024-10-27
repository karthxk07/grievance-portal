// app/types/grievance.ts
export interface Grievance {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "resolved" | "rejected";
  createdAt: number;
  createdById: string;
  createdByName: string;
  isAnonymous?: boolean;
  adminMessage: string;
  department: string;
}
