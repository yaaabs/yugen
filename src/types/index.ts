export type ProjectStatus =
  | "Submitted"
  | "Under Review"
  | "In Progress"
  | "Pending Client Feedback"
  | "Completed";

export type ProjectType =
  | "Website Development"
  | "Data Integration"
  | "Sustainability Dashboard"
  | "Custom Solution";

export type Currency = "PHP" | "USD";

export type BudgetRange =
  | "Under ₱50,000"
  | "₱50,000 - ₱150,000"
  | "₱150,000 - ₱300,000"
  | "₱300,000 - ₱500,000"
  | "Over ₱500,000";

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string; // base64 encoded for simulation
  uploadedAt: Date;
}

export interface ProjectSubmission {
  id: string;
  companyName: string;
  contactEmail: string;
  contactPhone?: string;
  projectType: ProjectType;
  description: string;
  timeline: string;
  budgetRange: BudgetRange;
  files: FileAttachment[];
  status: ProjectStatus;
  submittedAt: Date;
  lastUpdated: Date;
  adminNotes?: string;
  estimatedCompletion?: Date;
}

export interface StatusUpdate {
  id: string;
  projectId: string;
  previousStatus: ProjectStatus;
  newStatus: ProjectStatus;
  updatedAt: Date;
  notes?: string;
}

export interface NotificationEvent {
  type: "submission" | "status_change" | "file_upload";
  projectId: string;
  message: string;
  timestamp: Date;
}

// Form validation types
export interface FormErrors {
  companyName?: string;
  contactEmail?: string;
  contactPhone?: string;
  projectType?: string;
  description?: string;
  timeline?: string;
  budgetRange?: string;
  files?: string;
}

export interface FormData {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  projectType: ProjectType | "";
  description: string;
  timeline: string;
  budgetRange: BudgetRange | "";
  files: FileAttachment[];
}
