export type IssueCategory =
  | 'Toilets and Sanitation'
  | 'Drinking Water'
  | 'Electricity'
  | 'Roof or Building Damage'
  | 'Furniture'
  | 'Other';

export type ReporterRole =
  | 'Teacher'
  | 'Parent'
  | 'School Management Committee Member'
  | 'School Administrator';

export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Repair Reported'
  | 'Verification Pending'
  | 'Verified Resolved'
  | 'Reopened';

export interface StatusHistoryItem {
  id: string;
  complaintId: string;
  previousStatus: ComplaintStatus;
  newStatus: ComplaintStatus;
  note: string;
  author: string;
  timestamp: string;
}

export interface Complaint {
  id: string; // e.g. SS-1001
  schoolName: string;
  location: string;
  category: IssueCategory;
  description: string;
  photoUrl?: string;
  reporterRole: ReporterRole;
  submittedAt: string; // ISO String
  assignedDepartment?: string;
  status: ComplaintStatus;
  delayReason?: string;
  internalNotes?: string;
  repairPhotoUrl?: string;
  repairNotes?: string;
  repairReportedAt?: string;
  verifierName?: string;
  verifierRole?: string;
  verificationResult?: 'Verified Resolved' | 'Repair Incomplete — Reopen Complaint';
  verificationNotes?: string;
  verifiedAt?: string;
  isDemo?: boolean;
}

export interface StatsSummary {
  total: number;
  submitted: number;
  underReview: number;
  assigned: number;
  inProgress: number;
  repairReported: number;
  verificationPending: number;
  verifiedResolved: number;
  reopened: number;
  openTotal: number;
  overdueCount: number;
}
