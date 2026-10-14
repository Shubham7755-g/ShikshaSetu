import { Complaint, ComplaintStatus, IssueCategory, ReporterRole, StatusHistoryItem, StatsSummary } from '../types';
import { INITIAL_DEMO_COMPLAINTS, INITIAL_DEMO_HISTORY } from '../data/seedData';

const STORAGE_KEY_COMPLAINTS = 'shikshasetu_complaints_v1';
const STORAGE_KEY_HISTORY = 'shikshasetu_history_v1';
export const DEFAULT_OVERDUE_DAYS_THRESHOLD = 14;

// Default department recommendation mapping
export const DEPARTMENT_MAPPINGS: Record<IssueCategory, string> = {
  'Drinking Water': 'Water Supply / Maintenance',
  'Electricity': 'Electrical Maintenance',
  'Toilets and Sanitation': 'Sanitation / School Maintenance',
  'Roof or Building Damage': 'Building Maintenance',
  'Furniture': 'School Administration / Maintenance',
  'Other': 'General Infrastructure Wing',
};

export const ALL_DEPARTMENTS = [
  'Water Supply / Maintenance',
  'Electrical Maintenance',
  'Sanitation / School Maintenance',
  'Building Maintenance',
  'School Administration / Maintenance',
  'General Infrastructure Wing',
  'Public Works Department (PWD)',
];

export function calculateDaysOpen(submittedAt: string): number {
  const submitted = new Date(submittedAt).getTime();
  const now = new Date().getTime();
  const diffDays = Math.floor((now - submitted) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function isOverdue(complaint: Complaint, thresholdDays: number = DEFAULT_OVERDUE_DAYS_THRESHOLD): boolean {
  if (complaint.status === 'Verified Resolved') return false;
  return calculateDaysOpen(complaint.submittedAt) >= thresholdDays;
}

export function getStoredComplaints(): Complaint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLAINTS);
    if (!raw) {
      // First run initialize
      localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(INITIAL_DEMO_COMPLAINTS));
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(INITIAL_DEMO_HISTORY));
      return INITIAL_DEMO_COMPLAINTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read complaints from storage:', e);
    return INITIAL_DEMO_COMPLAINTS;
  }
}

export function saveStoredComplaints(complaints: Complaint[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(complaints));
  } catch (e) {
    console.error('Failed to save complaints to storage:', e);
  }
}

export function getStoredHistory(): StatusHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(INITIAL_DEMO_HISTORY));
      return INITIAL_DEMO_HISTORY;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read history from storage:', e);
    return INITIAL_DEMO_HISTORY;
  }
}

export function saveStoredHistory(history: StatusHistoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save history to storage:', e);
  }
}

export function getComplaintById(id: string): Complaint | undefined {
  const complaints = getStoredComplaints();
  const cleanId = id.trim().toUpperCase();
  return complaints.find(c => c.id.toUpperCase() === cleanId);
}

export function getComplaintHistory(complaintId: string): StatusHistoryItem[] {
  const history = getStoredHistory();
  const cleanId = complaintId.trim().toUpperCase();
  return history
    .filter(h => h.complaintId.toUpperCase() === cleanId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export function generateNextComplaintId(): string {
  const complaints = getStoredComplaints();
  let maxNum = 1000;
  for (const c of complaints) {
    const match = c.id.match(/^SS-(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  return `SS-${maxNum + 1}`;
}

export function createComplaint(params: {
  schoolName: string;
  location: string;
  category: IssueCategory;
  description: string;
  photoUrl?: string;
  reporterRole: ReporterRole;
}): Complaint {
  const complaints = getStoredComplaints();
  const history = getStoredHistory();

  const id = generateNextComplaintId();
  const now = new Date().toISOString();

  const newComplaint: Complaint = {
    id,
    schoolName: params.schoolName.trim(),
    location: params.location.trim(),
    category: params.category,
    description: params.description.trim(),
    photoUrl: params.photoUrl,
    reporterRole: params.reporterRole,
    submittedAt: now,
    status: 'Submitted',
    isDemo: false,
  };

  const initialHistoryItem: StatusHistoryItem = {
    id: `hist-${id}-init`,
    complaintId: id,
    previousStatus: 'Submitted',
    newStatus: 'Submitted',
    note: `Complaint registered by ${params.reporterRole} for ${params.category}.`,
    author: `${params.reporterRole}`,
    timestamp: now,
  };

  const updatedComplaints = [newComplaint, ...complaints];
  const updatedHistory = [...history, initialHistoryItem];

  saveStoredComplaints(updatedComplaints);
  saveStoredHistory(updatedHistory);

  return newComplaint;
}

export function updateComplaintStatus(
  id: string,
  newStatus: ComplaintStatus,
  note: string,
  author: string = 'Authorized Staff'
): Complaint | null {
  const complaints = getStoredComplaints();
  const history = getStoredHistory();
  const idx = complaints.findIndex(c => c.id.toUpperCase() === id.trim().toUpperCase());

  if (idx === -1) return null;

  const current = complaints[idx];
  const prevStatus = current.status;
  const now = new Date().toISOString();

  const updatedComplaint: Complaint = {
    ...current,
    status: newStatus,
  };

  const newHist: StatusHistoryItem = {
    id: `hist-${id}-${Date.now()}`,
    complaintId: current.id,
    previousStatus: prevStatus,
    newStatus: newStatus,
    note: note || `Status updated from ${prevStatus} to ${newStatus}.`,
    author,
    timestamp: now,
  };

  complaints[idx] = updatedComplaint;
  history.push(newHist);

  saveStoredComplaints(complaints);
  saveStoredHistory(history);

  return updatedComplaint;
}

export function assignDepartmentToComplaint(
  id: string,
  department: string,
  internalNotes?: string,
  delayReason?: string,
  advanceToAssigned: boolean = true,
  author: string = 'District Desk'
): Complaint | null {
  const complaints = getStoredComplaints();
  const history = getStoredHistory();
  const idx = complaints.findIndex(c => c.id.toUpperCase() === id.trim().toUpperCase());

  if (idx === -1) return null;

  const current = complaints[idx];
  const prevStatus = current.status;
  const now = new Date().toISOString();

  const targetStatus: ComplaintStatus =
    advanceToAssigned && (prevStatus === 'Submitted' || prevStatus === 'Under Review')
      ? 'Assigned'
      : current.status;

  const updatedComplaint: Complaint = {
    ...current,
    assignedDepartment: department,
    internalNotes: internalNotes || current.internalNotes,
    delayReason: delayReason || current.delayReason,
    status: targetStatus,
  };

  const histNote = `Assigned to department: ${department}.${internalNotes ? ' Note: ' + internalNotes : ''}${delayReason ? ' [Delay noted: ' + delayReason + ']' : ''}`;

  const newHist: StatusHistoryItem = {
    id: `hist-${id}-${Date.now()}`,
    complaintId: current.id,
    previousStatus: prevStatus,
    newStatus: targetStatus,
    note: histNote,
    author,
    timestamp: now,
  };

  complaints[idx] = updatedComplaint;
  history.push(newHist);

  saveStoredComplaints(complaints);
  saveStoredHistory(history);

  return updatedComplaint;
}

export function reportRepairCompletion(
  id: string,
  repairNotes: string,
  repairPhotoUrl?: string,
  author: string = 'Field Technician'
): Complaint | null {
  const complaints = getStoredComplaints();
  const history = getStoredHistory();
  const idx = complaints.findIndex(c => c.id.toUpperCase() === id.trim().toUpperCase());

  if (idx === -1) return null;

  const current = complaints[idx];
  const prevStatus = current.status;
  const now = new Date().toISOString();

  const updatedComplaint: Complaint = {
    ...current,
    status: 'Verification Pending',
    repairNotes: repairNotes.trim(),
    repairPhotoUrl: repairPhotoUrl || current.repairPhotoUrl,
    repairReportedAt: now,
  };

  const newHist: StatusHistoryItem = {
    id: `hist-${id}-${Date.now()}`,
    complaintId: current.id,
    previousStatus: prevStatus,
    newStatus: 'Verification Pending',
    note: `Repair completed by contractor/technician. Ready for School verification. Work note: ${repairNotes}`,
    author,
    timestamp: now,
  };

  complaints[idx] = updatedComplaint;
  history.push(newHist);

  saveStoredComplaints(complaints);
  saveStoredHistory(history);

  return updatedComplaint;
}

export function verifyRepairComplaint(
  id: string,
  result: 'Verified Resolved' | 'Repair Incomplete — Reopen Complaint',
  verificationNotes: string,
  verifierName: string,
  verifierRole: string
): Complaint | null {
  const complaints = getStoredComplaints();
  const history = getStoredHistory();
  const idx = complaints.findIndex(c => c.id.toUpperCase() === id.trim().toUpperCase());

  if (idx === -1) return null;

  const current = complaints[idx];
  const prevStatus = current.status;
  const now = new Date().toISOString();

  const newStatus: ComplaintStatus =
    result === 'Verified Resolved' ? 'Verified Resolved' : 'Reopened';

  const updatedComplaint: Complaint = {
    ...current,
    status: newStatus,
    verificationResult: result,
    verificationNotes: verificationNotes.trim(),
    verifierName: verifierName.trim(),
    verifierRole: verifierRole.trim(),
    verifiedAt: now,
  };

  const histNote =
    result === 'Verified Resolved'
      ? `VERIFIED RESOLVED by ${verifierName} (${verifierRole}). Inspection remarks: ${verificationNotes}`
      : `REOPENED by ${verifierName} (${verifierRole}) — Repair deemed incomplete: ${verificationNotes}`;

  const newHist: StatusHistoryItem = {
    id: `hist-${id}-${Date.now()}`,
    complaintId: current.id,
    previousStatus: prevStatus,
    newStatus: newStatus,
    note: histNote,
    author: `${verifierName} (${verifierRole})`,
    timestamp: now,
  };

  complaints[idx] = updatedComplaint;
  history.push(newHist);

  saveStoredComplaints(complaints);
  saveStoredHistory(history);

  return updatedComplaint;
}

export function getStatsSummary(thresholdDays: number = DEFAULT_OVERDUE_DAYS_THRESHOLD): StatsSummary {
  const complaints = getStoredComplaints();

  const summary: StatsSummary = {
    total: complaints.length,
    submitted: 0,
    underReview: 0,
    assigned: 0,
    inProgress: 0,
    repairReported: 0,
    verificationPending: 0,
    verifiedResolved: 0,
    reopened: 0,
    openTotal: 0,
    overdueCount: 0,
  };

  for (const c of complaints) {
    if (c.status === 'Submitted') summary.submitted++;
    else if (c.status === 'Under Review') summary.underReview++;
    else if (c.status === 'Assigned') summary.assigned++;
    else if (c.status === 'In Progress') summary.inProgress++;
    else if (c.status === 'Repair Reported') summary.repairReported++;
    else if (c.status === 'Verification Pending') summary.verificationPending++;
    else if (c.status === 'Verified Resolved') summary.verifiedResolved++;
    else if (c.status === 'Reopened') summary.reopened++;

    if (c.status !== 'Verified Resolved') {
      summary.openTotal++;
      if (isOverdue(c, thresholdDays)) {
        summary.overdueCount++;
      }
    }
  }

  return summary;
}

export function resetToDemoData(): void {
  localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(INITIAL_DEMO_COMPLAINTS));
  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(INITIAL_DEMO_HISTORY));
}
