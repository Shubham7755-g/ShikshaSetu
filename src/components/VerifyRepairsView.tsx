import React, { useState, useEffect } from 'react';
import { Complaint } from '../types';
import { verifyRepairComplaint } from '../services/storage';
import { IssueGraphic } from './IssueGraphic';
import { StatusIndicator } from './StatusIndicator';
import {
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  FileText,
  User,
  ArrowRight,
  School,
  Clock,
  Sparkles,
} from 'lucide-react';

interface VerifyRepairsViewProps {
  complaints: Complaint[];
  initialComplaintId?: string;
  onRefreshData: () => void;
  onNavigateTrack: (complaintId: string) => void;
}

export const VerifyRepairsView: React.FC<VerifyRepairsViewProps> = ({
  complaints,
  initialComplaintId,
  onRefreshData,
  onNavigateTrack,
}) => {
  // Pending verification complaints
  const pendingComplaints = complaints.filter(
    (c) => c.status === 'Verification Pending'
  );

  const [selectedId, setSelectedId] = useState<string>('');
  const [verifierName, setVerifierName] = useState('Smt. Geeta Rawat');
  const [verifierRole, setVerifierRole] = useState('School Management Committee Member');
  const [decision, setDecision] = useState<'Verified Resolved' | 'Repair Incomplete — Reopen Complaint'>(
    'Verified Resolved'
  );
  const [inspectionNotes, setInspectionNotes] = useState(
    'Personally inspected site alongside Headmaster. Water tap valve replaced with new brass fixture, no leakage observed, pressure tested satisfactory.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifiedResultItem, setVerifiedResultItem] = useState<Complaint | null>(null);

  useEffect(() => {
    if (initialComplaintId) {
      setSelectedId(initialComplaintId);
    } else if (pendingComplaints.length > 0 && !selectedId) {
      setSelectedId(pendingComplaints[0].id);
    }
  }, [initialComplaintId, pendingComplaints]);

  const selectedComplaint = complaints.find(
    (c) => c.id.toUpperCase() === selectedId.trim().toUpperCase()
  );

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    if (!verifierName.trim()) {
      alert('Please enter the name of the verifier.');
      return;
    }
    if (!inspectionNotes.trim()) {
      alert('Please provide on-site inspection observations.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = verifyRepairComplaint(
        selectedComplaint.id,
        decision,
        inspectionNotes,
        verifierName,
        verifierRole
      );

      if (updated) {
        setVerifiedResultItem(updated);
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Verify Completed Repairs</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Ensure accountability by requiring physical verification before a school complaint is closed.
          </p>
        </div>
        <div className="text-[11px] text-purple-900 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded self-start sm:self-auto font-medium">
          Demonstration Workflow · Community Sign-Off
        </div>
      </div>

      {/* Verification Queue Selector */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-900">
            Select Complaint Awaiting Verification ({pendingComplaints.length} in queue):
          </label>
          <span className="text-[11px] text-slate-500 font-mono">
            Requires on-site inspection
          </span>
        </div>

        {pendingComplaints.length === 0 ? (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded text-center text-xs text-slate-500">
            No complaints are currently awaiting verification.
            <div className="mt-1 text-[11px] text-slate-400">
              (You can submit a repair in Authority View or select any demo complaint to test)
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {pendingComplaints.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedId(c.id);
                  setVerifiedResultItem(null);
                }}
                className={`px-3 py-2 rounded-md text-xs font-medium cursor-pointer transition-colors text-left flex items-center gap-2 border ${
                  selectedId === c.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="font-mono font-bold">{c.id}</span>
                <span>·</span>
                <span className="truncate max-w-[150px]">{c.category}</span>
                <span className="text-[10px] opacity-80">({c.schoolName.split('—')[0].trim()})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Success / Result Screen if just verified */}
      {verifiedResultItem && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs text-center space-y-4">
          <div
            className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
              verifiedResultItem.status === 'Verified Resolved'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {verifiedResultItem.status === 'Verified Resolved' ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <RotateCcw className="w-6 h-6" />
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {verifiedResultItem.status === 'Verified Resolved'
                ? 'Repair Verified & Closed'
                : 'Repair Deemed Incomplete — Complaint Reopened'}
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Verification statement recorded in audit log by {verifiedResultItem.verifierName} ({verifiedResultItem.verifierRole}).
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => onNavigateTrack(verifiedResultItem.id)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded cursor-pointer transition-colors"
            >
              View Updated Timeline
            </button>
            <button
              onClick={() => setVerifiedResultItem(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded cursor-pointer transition-colors"
            >
              Verify Another Record
            </button>
          </div>
        </div>
      )}

      {/* Main Verification Form */}
      {selectedComplaint && !verifiedResultItem && (
        <form onSubmit={handleSubmitVerification} className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-2xs">
          
          {/* Ticket Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-slate-900">{selectedComplaint.id}</span>
                <span className="text-xs font-medium text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {selectedComplaint.status}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {selectedComplaint.schoolName} · {selectedComplaint.location}
              </div>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Reported: {new Date(selectedComplaint.submittedAt).toLocaleDateString()}
            </div>
          </div>

          {/* Side-by-Side Before vs After Inspection Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Original Reported Problem */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 text-xs">
              <div className="font-semibold text-slate-900 flex items-center justify-between">
                <span>1. Original Problem Reported</span>
                <span className="text-[11px] text-slate-500 font-normal">By {selectedComplaint.reporterRole}</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 block">Category:</span>
                <span className="font-medium text-slate-800">{selectedComplaint.category}</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 block">Description:</span>
                <p className="bg-white p-2.5 rounded border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedComplaint.description}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 block">Reported Photo Evidence:</span>
                <IssueGraphic
                  category={selectedComplaint.category}
                  photoUrl={selectedComplaint.photoUrl}
                  className="w-full h-36"
                />
              </div>
            </div>

            {/* Right: Repair Completed by Contractor */}
            <div className="p-4 bg-purple-50/40 rounded-lg border border-purple-200 space-y-3 text-xs">
              <div className="font-semibold text-purple-950 flex items-center justify-between">
                <span>2. Repair Completed by Field Crew</span>
                <span className="text-[11px] text-purple-700 font-normal">
                  {selectedComplaint.assignedDepartment || 'Field Contractor'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 block">Work Completion Notes:</span>
                <p className="bg-white p-2.5 rounded border border-purple-200 text-slate-800 leading-relaxed">
                  {selectedComplaint.repairNotes ||
                    'Waterproofing compound applied and joint cracks sealed. Physical repairs finished.'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 block">Technician Photo Evidence:</span>
                {selectedComplaint.repairPhotoUrl ? (
                  <div className="border border-purple-200 rounded overflow-hidden max-h-36 bg-white">
                    <img
                      src={selectedComplaint.repairPhotoUrl}
                      alt="Repair completion evidence"
                      className="w-full h-36 object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full h-36 rounded border border-dashed border-purple-300 bg-white flex flex-col items-center justify-center text-center p-3">
                    <span className="text-[11px] font-medium text-purple-900">Work Verified On-Site</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Technician logged completion without photo</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Verifier Credentials & Decision Form */}
          <div className="pt-4 border-t border-slate-200 space-y-4 text-xs">
            <div className="font-semibold text-slate-900 text-sm">
              Physical Inspection & Verification Decision
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Verifier Name:</label>
                <input
                  type="text"
                  value={verifierName}
                  onChange={(e) => setVerifierName(e.target.value)}
                  placeholder="e.g. Smt. Geeta Rawat"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Verifier Role:</label>
                <select
                  value={verifierRole}
                  onChange={(e) => setVerifierRole(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded font-medium text-slate-800 cursor-pointer"
                >
                  <option value="School Management Committee Member">School Management Committee Member</option>
                  <option value="Teacher">Teacher / Headmaster</option>
                  <option value="Parent">Parent Representative</option>
                  <option value="School Administrator">School Administrator</option>
                  <option value="Village Pradhan / Local Representative">Village Pradhan / Local Representative</option>
                </select>
              </div>
            </div>

            {/* Decision Radio Choice */}
            <div>
              <label className="block text-slate-600 mb-2 font-medium">Verification Result:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer transition-colors ${
                    decision === 'Verified Resolved'
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 ring-1 ring-emerald-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="verification_result"
                    checked={decision === 'Verified Resolved'}
                    onChange={() => {
                      setDecision('Verified Resolved');
                      setInspectionNotes(
                        'Personally inspected site alongside Headmaster. Work completed satisfactorily, functional test passed.'
                      );
                    }}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="font-semibold text-xs flex items-center gap-1.5 text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Verified Resolved</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Confirm physical completion and close this complaint.
                    </div>
                  </div>
                </label>

                <label
                  className={`p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer transition-colors ${
                    decision === 'Repair Incomplete — Reopen Complaint'
                      ? 'border-rose-500 bg-rose-50/50 text-rose-950 ring-1 ring-rose-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="verification_result"
                    checked={decision === 'Repair Incomplete — Reopen Complaint'}
                    onChange={() => {
                      setDecision('Repair Incomplete — Reopen Complaint');
                      setInspectionNotes(
                        'Physical inspection revealed repair is incomplete. Water tap is still leaking at the joint valve.'
                      );
                    }}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="font-semibold text-xs flex items-center gap-1.5 text-rose-900">
                      <RotateCcw className="w-4 h-4 text-rose-600" />
                      <span>Repair Incomplete — Reopen</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Reject resolution and return to active maintenance queue.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Inspection Observation Notes */}
            <div>
              <label className="block text-slate-600 mb-1 font-medium">
                Inspection Remarks / Feedback <span className="text-rose-600">*</span>:
              </label>
              <textarea
                rows={3}
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
                placeholder="Document your physical verification remarks, tests conducted, or reasons if rejecting..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded text-slate-800"
              />
            </div>

            {/* Prototype notice */}
            <p className="text-[11px] text-slate-400">
              Note: In this prototype, verification demonstrates the intended multi-party accountability workflow,
              preventing contractors or authorities from closing complaints without community sign-off.
            </p>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-5 py-2.5 text-xs font-semibold text-white rounded shadow-xs cursor-pointer transition-colors ${
                  decision === 'Verified Resolved'
                    ? 'bg-emerald-800 hover:bg-emerald-900'
                    : 'bg-rose-800 hover:bg-rose-900'
                }`}
              >
                {isSubmitting
                  ? 'Saving Verification...'
                  : decision === 'Verified Resolved'
                  ? 'Confirm & Mark Verified Resolved'
                  : 'Reopen Complaint for Further Repair'}
              </button>
            </div>

          </div>

        </form>
      )}
    </div>
  );
};
