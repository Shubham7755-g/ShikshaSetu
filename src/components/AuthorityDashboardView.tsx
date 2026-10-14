import React, { useState } from 'react';
import { Complaint, IssueCategory } from '../types';
import {
  ALL_DEPARTMENTS,
  DEPARTMENT_MAPPINGS,
  assignDepartmentToComplaint,
  reportRepairCompletion,
  updateComplaintStatus,
  calculateDaysOpen,
  isOverdue,
} from '../services/storage';
import { StatusIndicator } from './StatusIndicator';
import { IssueGraphic } from './IssueGraphic';
import {
  Building2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Send,
  Wrench,
  X,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  Camera,
} from 'lucide-react';

interface AuthorityDashboardViewProps {
  complaints: Complaint[];
  overdueThreshold: number;
  onRefreshData: () => void;
  onNavigateVerify: (complaintId: string) => void;
  onNavigateTrack: (complaintId: string) => void;
}

export const AuthorityDashboardView: React.FC<AuthorityDashboardViewProps> = ({
  complaints,
  overdueThreshold,
  onRefreshData,
  onNavigateVerify,
  onNavigateTrack,
}) => {
  const [activeTab, setActiveTab] = useState<'awaiting' | 'open' | 'overdue' | 'repairs'>('awaiting');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Form states for assignment
  const [assignedDept, setAssignedDept] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [delayReason, setDelayReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Repair completion reporting modal inside authority view (for contractor simulation)
  const [showRepairReportModal, setShowRepairReportModal] = useState(false);
  const [repairWorkNotes, setRepairWorkNotes] = useState('');
  const [repairPhotoUrl, setRepairPhotoUrl] = useState<string | undefined>(undefined);

  // Categorize complaints
  const awaitingAssignment = complaints.filter(
    (c) => (c.status === 'Submitted' || c.status === 'Under Review') && !c.assignedDepartment
  );

  const openComplaints = complaints.filter(
    (c) => c.status !== 'Verified Resolved'
  );

  const overdueComplaints = complaints.filter(
    (c) => isOverdue(c, overdueThreshold) && c.status !== 'Verified Resolved'
  );

  const awaitingVerification = complaints.filter(
    (c) => c.status === 'Verification Pending'
  );

  const handleOpenComplaint = (c: Complaint) => {
    setSelectedComplaint(c);
    setSuccessBanner(null);
    setAssignedDept(c.assignedDepartment || DEPARTMENT_MAPPINGS[c.category] || ALL_DEPARTMENTS[0]);
    setInternalNote(c.internalNotes || '');
    setDelayReason(c.delayReason || '');
  };

  const handleApplyAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setIsSubmitting(true);
    try {
      const updated = assignDepartmentToComplaint(
        selectedComplaint.id,
        assignedDept,
        internalNote,
        delayReason,
        true, // advance status to 'Assigned' if currently 'Submitted' or 'Under Review'
        'District Education Authority'
      );

      if (updated) {
        setSelectedComplaint(updated);
        onRefreshData();
        setSuccessBanner(`Complaint ${updated.id} successfully assigned to ${assignedDept}.`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdvanceToInProgress = () => {
    if (!selectedComplaint) return;
    setIsSubmitting(true);
    try {
      const updated = updateComplaintStatus(
        selectedComplaint.id,
        'In Progress',
        'Field contractor dispatched on-site. Repair work initiated.',
        'District Works Supervisor'
      );
      if (updated) {
        setSelectedComplaint(updated);
        onRefreshData();
        setSuccessBanner(`Complaint ${updated.id} marked as In Progress.`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upload repair completion photo
  const handleRepairPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setRepairPhotoUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitRepairCompletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    if (!repairWorkNotes.trim()) {
      alert('Please specify the work completed by the repair team.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = reportRepairCompletion(
        selectedComplaint.id,
        repairWorkNotes,
        repairPhotoUrl,
        'Field Contractor Lead'
      );
      if (updated) {
        setSelectedComplaint(updated);
        onRefreshData();
        setShowRepairReportModal(false);
        setSuccessBanner(
          `Repair reported as completed! Ticket ${updated.id} moved to "Verification Pending" for school verification.`
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentTabList = () => {
    switch (activeTab) {
      case 'awaiting':
        return awaitingAssignment;
      case 'open':
        return openComplaints;
      case 'overdue':
        return overdueComplaints;
      case 'repairs':
        return awaitingVerification;
    }
  };

  const list = currentTabList();

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">District & Authority Portal</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Department dispatch, delay logging, and contractor coordination for school infrastructure complaints.
          </p>
        </div>
        <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded self-start sm:self-auto font-medium">
          Demonstration Environment · Prototype Mappings
        </div>
      </div>

      {/* Authority Segmented Filter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab('awaiting')}
          className={`p-3.5 rounded-lg border text-left cursor-pointer transition-colors ${
            activeTab === 'awaiting'
              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs font-semibold">Awaiting Assignment</div>
          <div className="text-xl font-bold font-mono mt-1 tabular-nums">
            {awaitingAssignment.length}
          </div>
          <div className={`text-[10px] mt-0.5 ${activeTab === 'awaiting' ? 'text-slate-300' : 'text-slate-500'}`}>
            Needs department dispatch
          </div>
        </button>

        <button
          onClick={() => setActiveTab('open')}
          className={`p-3.5 rounded-lg border text-left cursor-pointer transition-colors ${
            activeTab === 'open'
              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs font-semibold">All Open Issues</div>
          <div className="text-xl font-bold font-mono mt-1 tabular-nums">
            {openComplaints.length}
          </div>
          <div className={`text-[10px] mt-0.5 ${activeTab === 'open' ? 'text-slate-300' : 'text-slate-500'}`}>
            Unresolved tickets
          </div>
        </button>

        <button
          onClick={() => setActiveTab('overdue')}
          className={`p-3.5 rounded-lg border text-left cursor-pointer transition-colors ${
            activeTab === 'overdue'
              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs font-semibold text-rose-500">Overdue (&gt;{overdueThreshold}d)</div>
          <div className="text-xl font-bold font-mono mt-1 tabular-nums text-rose-600">
            {overdueComplaints.length}
          </div>
          <div className={`text-[10px] mt-0.5 ${activeTab === 'overdue' ? 'text-slate-300' : 'text-slate-500'}`}>
            Requires urgent intervention
          </div>
        </button>

        <button
          onClick={() => setActiveTab('repairs')}
          className={`p-3.5 rounded-lg border text-left cursor-pointer transition-colors ${
            activeTab === 'repairs'
              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs font-semibold text-purple-400">Repairs Pending Verification</div>
          <div className="text-xl font-bold font-mono mt-1 tabular-nums text-purple-400">
            {awaitingVerification.length}
          </div>
          <div className={`text-[10px] mt-0.5 ${activeTab === 'repairs' ? 'text-slate-300' : 'text-slate-500'}`}>
            Ready for SMC inspection
          </div>
        </button>
      </div>

      {/* Success Banner if applicable */}
      {successBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
          <span>{successBanner}</span>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-emerald-900 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Table of Complaints in Current Tab */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-900">
            Queue: {activeTab === 'awaiting' ? 'Complaints Awaiting Assignment' : activeTab === 'overdue' ? 'Overdue Complaints' : activeTab === 'repairs' ? 'Repairs Awaiting Verification' : 'All Open Complaints'} ({list.length})
          </span>
          <span className="text-[11px] text-slate-400">
            Click row to assign department or record delay notes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-medium">
                <th className="py-2.5 px-4 font-mono">ID</th>
                <th className="py-2.5 px-4">School & Block</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4">Age</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No complaints currently in this queue.
                  </td>
                </tr>
              ) : (
                list.map((c) => {
                  const overdue = isOverdue(c, overdueThreshold);
                  const days = calculateDaysOpen(c.submittedAt);
                  return (
                    <tr
                      key={c.id}
                      onClick={() => handleOpenComplaint(c)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{c.id}</td>
                      <td className="py-3 px-4 text-slate-800">
                        <div className="font-semibold text-slate-900">{c.schoolName}</div>
                        <div className="text-[11px] text-slate-500">{c.location}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{c.category}</td>
                      <td className="py-3 px-4 text-slate-700">
                        {c.assignedDepartment || (
                          <span className="text-amber-800 font-medium">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className={overdue ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                          {days === 0 ? 'Today' : `${days}d`}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusIndicator status={c.status} isOverdue={overdue} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-xs font-semibold text-blue-900 inline-flex items-center gap-1">
                          <span>Action</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complaint Authority Action Drawer / Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-lg text-slate-900">{selectedComplaint.id}</span>
                  <StatusIndicator
                    status={selectedComplaint.status}
                    isOverdue={isOverdue(selectedComplaint, overdueThreshold)}
                    size="sm"
                  />
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {selectedComplaint.schoolName} · {selectedComplaint.location}
                </div>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs">
              {/* Problem summary */}
              <div>
                <span className="text-slate-500 block mb-1 font-semibold">Reported Issue:</span>
                <p className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-800 leading-relaxed">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Department Assignment Section */}
              <form onSubmit={handleApplyAssignment} className="space-y-4 bg-slate-50/70 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-sm">Assign Responsible Wing</span>
                  <button
                    type="button"
                    onClick={() => {
                      const suggested = DEPARTMENT_MAPPINGS[selectedComplaint.category];
                      if (suggested) setAssignedDept(suggested);
                    }}
                    className="text-[11px] text-blue-900 font-medium hover:underline cursor-pointer"
                  >
                    Auto-suggest for {selectedComplaint.category}
                  </button>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Department / Division:</label>
                  <select
                    value={assignedDept}
                    onChange={(e) => setAssignedDept(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded font-medium text-slate-800 cursor-pointer"
                  >
                    {ALL_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Internal Work Order / Directive Note:</label>
                  <input
                    type="text"
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="e.g. Work order #WO-108 dispatched to local plumbing contractor..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">
                    Reason for Delay <span className="text-slate-400 font-normal">(Optional if work is delayed)</span>:
                  </label>
                  <input
                    type="text"
                    value={delayReason}
                    onChange={(e) => setDelayReason(e.target.value)}
                    placeholder="e.g. Awaiting spare pump valve delivery from district warehouse..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded text-slate-800"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded shadow-xs cursor-pointer transition-colors"
                  >
                    {isSubmitting ? 'Saving...' : 'Save & Assign Department'}
                  </button>
                </div>
              </form>

              {/* Status Action Buttons for Demonstration */}
              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="text-slate-500">
                  Lifecycle Stage Progression:
                </div>

                <div className="flex items-center gap-2">
                  {selectedComplaint.status === 'Assigned' && (
                    <button
                      type="button"
                      onClick={handleAdvanceToInProgress}
                      disabled={isSubmitting}
                      className="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white font-semibold rounded cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Start Work (Mark In Progress)</span>
                    </button>
                  )}

                  {(selectedComplaint.status === 'In Progress' || selectedComplaint.status === 'Assigned' || selectedComplaint.status === 'Reopened') && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowRepairReportModal(true);
                        setRepairWorkNotes(`Physical repair completed. Replacement materials installed and inspected on-site.`);
                      }}
                      className="px-3 py-1.5 bg-purple-900 hover:bg-purple-800 text-white font-semibold rounded cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Report Repair as Completed</span>
                    </button>
                  )}

                  {selectedComplaint.status === 'Verification Pending' && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateVerify(selectedComplaint.id);
                        setSelectedComplaint(null);
                      }}
                      className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Proceed to Verification</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Contractor Repair Report Sub-Modal */}
      {showRepairReportModal && selectedComplaint && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-semibold text-sm text-slate-900">
                Report Repair as Completed · {selectedComplaint.id}
              </h3>
              <button
                onClick={() => setShowRepairReportModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitRepairCompletion} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Work Completion Notes:</label>
                <textarea
                  rows={3}
                  value={repairWorkNotes}
                  onChange={(e) => setRepairWorkNotes(e.target.value)}
                  placeholder="Detail the physical repair performed, parts replaced, and operational test results..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  After-Repair Completion Photograph (Optional):
                </label>
                {!repairPhotoUrl ? (
                  <label className="border border-dashed border-slate-300 hover:border-slate-400 rounded p-3 flex flex-col items-center justify-center cursor-pointer bg-slate-50">
                    <Camera className="w-5 h-5 text-slate-500 mb-1" />
                    <span className="text-[11px] font-medium text-slate-700">Upload completion photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleRepairPhotoUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative border border-slate-200 rounded overflow-hidden max-h-36 flex items-center justify-center bg-slate-100">
                    <img
                      src={repairPhotoUrl}
                      alt="Repair evidence"
                      className="max-h-36 object-contain w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setRepairPhotoUrl(undefined)}
                      className="absolute top-2 right-2 p-1 bg-slate-900/80 text-white rounded text-[10px]"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-purple-50 p-3 rounded text-purple-900 text-[11px]">
                Submitting this report transitions the complaint to <strong>"Verification Pending"</strong>.
                It will NOT be marked resolved until verified by the School Management Committee.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRepairReportModal(false)}
                  className="px-3 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white font-semibold rounded cursor-pointer"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Completed Repair'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
