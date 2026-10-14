import React, { useState, useEffect } from 'react';
import { Complaint, StatusHistoryItem } from '../types';
import { getComplaintById, getComplaintHistory, calculateDaysOpen, isOverdue } from '../services/storage';
import { StatusIndicator } from './StatusIndicator';
import { IssueGraphic } from './IssueGraphic';
import {
  Search,
  Calendar,
  MapPin,
  School,
  Clock,
  AlertTriangle,
  CheckCircle2,
  User,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface TrackComplaintViewProps {
  initialComplaintId?: string;
  allComplaints: Complaint[];
  overdueThreshold: number;
  onNavigateVerify: (complaintId: string) => void;
  onNavigateAuthority: (complaintId: string) => void;
}

export const TrackComplaintView: React.FC<TrackComplaintViewProps> = ({
  initialComplaintId = '',
  allComplaints,
  overdueThreshold,
  onNavigateVerify,
  onNavigateAuthority,
}) => {
  const [searchId, setSearchId] = useState(initialComplaintId);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [history, setHistory] = useState<StatusHistoryItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialComplaintId) {
      setSearchId(initialComplaintId);
      performSearch(initialComplaintId);
    } else if (allComplaints.length > 0 && !complaint) {
      // Default to the first complaint for instant live view
      performSearch(allComplaints[0].id);
    }
  }, [initialComplaintId]);

  const performSearch = (idToSearch: string) => {
    const clean = idToSearch.trim();
    if (!clean) return;

    setHasSearched(true);
    const found = getComplaintById(clean);
    if (found) {
      setComplaint(found);
      setHistory(getComplaintHistory(found.id));
    } else {
      setComplaint(null);
      setHistory([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchId);
  };

  const overdue = complaint ? isOverdue(complaint, overdueThreshold) : false;
  const daysOpen = complaint ? calculateDaysOpen(complaint.submittedAt) : 0;

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Track a Complaint</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Enter your unique complaint ID to review verification milestones, audit timestamps, and current repair stage.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter complaint ID (e.g. SS-1001, SS-1003, SS-1005)..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-2xs transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick select demo complaint chips */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 text-[11px]">Quick Samples:</span>
          {allComplaints.slice(0, 5).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSearchId(c.id);
                performSearch(c.id);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                complaint?.id === c.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.id} ({c.status})
            </button>
          ))}
        </div>
      </form>

      {/* Complaint Not Found State */}
      {hasSearched && !complaint && (
        <div className="bg-white border border-rose-200 rounded-lg p-8 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">Complaint ID Not Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No record matches <span className="font-mono font-bold text-slate-700">{searchId}</span>. Please verify the ID format
            (e.g., SS-1001) or pick from the sample records above.
          </p>
        </div>
      )}

      {/* Complaint Details Card */}
      {complaint && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-6">
            
            {/* Top Bar: ID, Status, Days Open */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold font-mono text-slate-900">{complaint.id}</span>
                  {complaint.isDemo && (
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Demo Record
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Reported by {complaint.reporterRole} on {new Date(complaint.submittedAt).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <StatusIndicator status={complaint.status} isOverdue={overdue} size="md" />
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {daysOpen === 0 ? 'Logged today' : `${daysOpen} days open`}
                  </div>
                </div>
              </div>
            </div>

            {/* Overdue Warning Notice if applicable */}
            {overdue && complaint.status !== 'Verified Resolved' && (
              <div className="bg-rose-50/70 border border-rose-200 rounded-md p-3 text-xs text-rose-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Overdue Flag Triggered: </span>
                  This complaint has been open for <span className="font-mono font-bold">{daysOpen} days</span>, exceeding the configured
                  prototype demo threshold of {overdueThreshold} days.
                  <span className="text-rose-700/80 block mt-0.5 text-[11px]">
                    (Note: In this college ideathon prototype, this threshold demonstrates automatic escalation alerts rather than a statutory deadline.)
                  </span>
                </div>
              </div>
            )}

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Details */}
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">School / Anganwadi:</span>
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5 mt-0.5">
                      <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{complaint.schoolName}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Location / Block:</span>
                    <span className="font-medium text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{complaint.location}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Issue Category:</span>
                    <span className="font-semibold text-slate-900 mt-0.5 block">
                      {complaint.category}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Assigned Department:</span>
                    <span className="font-medium text-slate-800 mt-0.5 block">
                      {complaint.assignedDepartment || (
                        <span className="text-slate-400 italic">Pending Assignment</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs text-slate-500 block mb-1">Issue Description:</span>
                  <div className="text-xs sm:text-sm text-slate-800 bg-slate-50 p-3 rounded-md border border-slate-200 leading-relaxed">
                    {complaint.description}
                  </div>
                </div>

                {/* Delay reason or internal notes if present */}
                {complaint.delayReason && (
                  <div className="text-xs bg-amber-50 border border-amber-200 p-3 rounded-md text-amber-900 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Authority Recorded Delay Reason</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{complaint.delayReason}</p>
                  </div>
                )}

                {complaint.internalNotes && (
                  <div className="text-xs bg-slate-50 border border-slate-200 p-3 rounded-md text-slate-700">
                    <span className="font-semibold text-slate-800">Administrative Note: </span>
                    <span>{complaint.internalNotes}</span>
                  </div>
                )}
              </div>

              {/* Right Column: Visual Evidence */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-700 block">
                  Reported Photograph:
                </span>
                <IssueGraphic
                  category={complaint.category}
                  photoUrl={complaint.photoUrl}
                  className="w-full h-44"
                />

                {complaint.repairPhotoUrl && (
                  <div className="pt-2 space-y-1">
                    <span className="text-xs font-semibold text-slate-700 block">
                      Repair Completion Photo:
                    </span>
                    <div className="border border-purple-200 rounded-lg overflow-hidden bg-slate-100 max-h-36">
                      <img
                        src={complaint.repairPhotoUrl}
                        alt="Repair completed photograph"
                        className="w-full h-36 object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Context Action Links */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-500">
                Action Options for Demonstration:
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateAuthority(complaint.id)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium transition-colors cursor-pointer"
                >
                  Manage in Authority View
                </button>
                {complaint.status === 'Verification Pending' && (
                  <button
                    onClick={() => onNavigateVerify(complaint.id)}
                    className="px-3 py-1.5 bg-purple-900 hover:bg-purple-800 text-white rounded font-medium transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verify This Repair</span>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Audit Timeline Section */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">Status Progression & Audit History</h2>
            <p className="text-xs text-slate-500 mb-6">
              Immutable timestamped log of state transitions, department assignments, and verifications.
            </p>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {history.map((hist, index) => (
                <div key={hist.id} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-slate-800 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span>{hist.newStatus}</span>
                        {hist.previousStatus !== hist.newStatus && (
                          <span className="text-[11px] text-slate-400 font-normal">
                            (from {hist.previousStatus})
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400">
                        {new Date(hist.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                      {hist.note}
                    </p>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>Recorded by {hist.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
