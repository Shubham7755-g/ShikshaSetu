import React, { useState, useMemo } from 'react';
import { Complaint, ComplaintStatus, IssueCategory, StatsSummary } from '../types';
import { updateComplaintStatus, calculateDaysOpen, isOverdue } from '../services/storage';
import { StatusIndicator } from './StatusIndicator';
import { IssueGraphic } from './IssueGraphic';
import {
  Filter,
  Search,
  School,
  Calendar,
  Clock,
  ArrowRight,
  X,
  AlertCircle,
  CheckCircle2,
  Lock,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface SchoolDashboardViewProps {
  complaints: Complaint[];
  stats: StatsSummary;
  onRefreshData: () => void;
  onNavigateTrack: (complaintId: string) => void;
  onNavigateVerify: (complaintId: string) => void;
  overdueThreshold: number;
}

export const SchoolDashboardView: React.FC<SchoolDashboardViewProps> = ({
  complaints,
  stats,
  onRefreshData,
  onNavigateTrack,
  onNavigateVerify,
  overdueThreshold,
}) => {
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected complaint for details drawer
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);

  // Status update state
  const [newStatusChoice, setNewStatusChoice] = useState<ComplaintStatus>('Under Review');
  const [statusUpdateNote, setStatusUpdateNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Extract unique schools
  const uniqueSchools = useMemo(() => {
    const list = Array.from(new Set(complaints.map((c) => c.schoolName)));
    return list.sort();
  }, [complaints]);

  // Filtered complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      if (selectedSchool !== 'all' && c.schoolName !== selectedSchool) return false;
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = c.id.toLowerCase().includes(query);
        const matchesDesc = c.description.toLowerCase().includes(query);
        const matchesSchool = c.schoolName.toLowerCase().includes(query);
        if (!matchesId && !matchesDesc && !matchesSchool) return false;
      }
      return true;
    });
  }, [complaints, selectedSchool, selectedCategory, selectedStatus, searchQuery]);

  const handleOpenDetails = (c: Complaint) => {
    setActiveComplaint(c);
    setFeedbackMsg(null);
    setStatusUpdateNote('');
    // Suggest the next natural status
    if (c.status === 'Submitted') setNewStatusChoice('Under Review');
    else if (c.status === 'Under Review') setNewStatusChoice('Assigned');
    else if (c.status === 'Assigned') setNewStatusChoice('In Progress');
    else setNewStatusChoice(c.status);
  };

  const handleApplyStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint) return;

    // Safety constraint: Verified Resolved CANNOT be selected here
    if (newStatusChoice === 'Verified Resolved') {
      setFeedbackMsg({
        type: 'error',
        text: 'Policy Violation: "Verified Resolved" requires the dedicated physical inspection workflow in the "Verify Repairs" module.',
      });
      return;
    }

    setIsUpdating(true);
    try {
      const updated = updateComplaintStatus(
        activeComplaint.id,
        newStatusChoice,
        statusUpdateNote.trim() || `Status updated to ${newStatusChoice} by School Administrator.`,
        'School Administrator'
      );

      if (updated) {
        setActiveComplaint(updated);
        onRefreshData();
        setFeedbackMsg({
          type: 'success',
          text: `Status updated to ${newStatusChoice} successfully.`,
        });
        setStatusUpdateNote('');
      }
    } catch (err) {
      console.error(err);
      setFeedbackMsg({ type: 'error', text: 'Failed to update complaint status.' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="py-6 space-y-6">
      {/* Page Title & Scope */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">School Maintenance Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Institutional overview for Headmasters, Teachers, and School Management Committee members.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1.5 rounded self-start sm:self-auto">
          Overdue Benchmark: {overdueThreshold} Days
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Total School Records</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{stats.total}</div>
          <div className="text-[11px] text-slate-400 mt-1">All registered complaints</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
          <div className="text-xs font-medium text-amber-700 mb-1">Open Complaints</div>
          <div className="text-2xl font-bold text-amber-800 font-mono tabular-nums">{stats.openTotal}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {stats.overdueCount > 0 ? (
              <span className="text-rose-600 font-semibold">{stats.overdueCount} overdue</span>
            ) : (
              'All within threshold'
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
          <div className="text-xs font-medium text-indigo-700 mb-1">In-Progress Repairs</div>
          <div className="text-2xl font-bold text-indigo-900 font-mono tabular-nums">
            {stats.inProgress + stats.verificationPending}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Active site works</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
          <div className="text-xs font-medium text-emerald-700 mb-1">Verified Resolved</div>
          <div className="text-2xl font-bold text-emerald-800 font-mono tabular-nums">
            {stats.verifiedResolved}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Inspected & closed</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 pb-2 border-b border-slate-100">
          <Filter className="w-4 h-4 text-slate-500" />
          <span>Filter Records</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* School filter */}
          <div>
            <label className="block text-slate-500 mb-1">School / Anganwadi:</label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Schools ({complaints.length})</option>
              {uniqueSchools.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div>
            <label className="block text-slate-500 mb-1">Issue Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Categories</option>
              <option value="Drinking Water">Drinking Water</option>
              <option value="Toilets and Sanitation">Toilets & Sanitation</option>
              <option value="Electricity">Electricity</option>
              <option value="Roof or Building Damage">Roof or Building Damage</option>
              <option value="Furniture">Furniture</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-slate-500 mb-1">Current Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Verification Pending">Verification Pending</option>
              <option value="Verified Resolved">Verified Resolved</option>
              <option value="Reopened">Reopened</option>
            </select>
          </div>

          {/* Search query */}
          <div>
            <label className="block text-slate-500 mb-1">Search ID or Text:</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Complaints Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-900">
            Complaints List ({filteredComplaints.length} Records)
          </div>
          <div className="text-[11px] text-slate-500">
            Click any row to inspect details and advance status stages
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-medium">
                <th className="py-3 px-4 font-mono">Complaint ID</th>
                <th className="py-3 px-4">School & Block</th>
                <th className="py-3 px-4">Issue Category</th>
                <th className="py-3 px-4">Date Reported</th>
                <th className="py-3 px-4">Days Pending</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No complaints match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => {
                  const overdue = isOverdue(c, overdueThreshold);
                  const days = calculateDaysOpen(c.submittedAt);
                  return (
                    <tr
                      key={c.id}
                      onClick={() => handleOpenDetails(c)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {c.id}
                      </td>
                      <td className="py-3.5 px-4 text-slate-800">
                        <div className="font-semibold text-slate-900">{c.schoolName}</div>
                        <div className="text-[11px] text-slate-500">{c.location}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <span>{c.category}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono">
                        {new Date(c.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className={overdue ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                          {days === 0 ? 'Today' : `${days} days`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusIndicator status={c.status} isOverdue={overdue} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-xs font-semibold text-blue-900 hover:text-blue-950 inline-flex items-center gap-1">
                          <span>Inspect</span>
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

      {/* Details & Status Update Modal/Drawer */}
      {activeComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-mono font-bold text-lg text-slate-900">{activeComplaint.id}</h3>
                  <StatusIndicator
                    status={activeComplaint.status}
                    isOverdue={isOverdue(activeComplaint, overdueThreshold)}
                    size="sm"
                  />
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {activeComplaint.schoolName} · {activeComplaint.location}
                </div>
              </div>
              <button
                onClick={() => setActiveComplaint(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs">
              {/* Feedback Alert */}
              {feedbackMsg && (
                <div
                  className={`p-3 rounded-md text-xs flex items-start gap-2 ${
                    feedbackMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{feedbackMsg.text}</span>
                </div>
              )}

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Issue Category:</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{activeComplaint.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Reporter Role:</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{activeComplaint.reporterRole}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Reported Date:</span>
                  <span className="font-mono text-slate-800 mt-0.5 block">
                    {new Date(activeComplaint.submittedAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Assigned Wing:</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">
                    {activeComplaint.assignedDepartment || 'None assigned yet'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1 font-semibold">Problem Description:</span>
                <p className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-800 leading-relaxed">
                  {activeComplaint.description}
                </p>
              </div>

              {/* Demonstration Status Progression Form */}
              <form onSubmit={handleApplyStatusUpdate} className="border-t border-slate-200 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-sm">Update Complaint Stage (Demo)</span>
                  <span className="text-[11px] text-slate-400">Timestamped in SQLite / Local Storage</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Next Status Stage:</label>
                    <select
                      value={newStatusChoice}
                      onChange={(e) => setNewStatusChoice(e.target.value as ComplaintStatus)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded font-medium text-slate-800 cursor-pointer"
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      {/* Note: 'Verified Resolved' is blocked with policy warning */}
                      <option value="Verified Resolved">Verified Resolved (Requires Verification)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Audit Note / Remark:</label>
                    <input
                      type="text"
                      value={statusUpdateNote}
                      onChange={(e) => setStatusUpdateNote(e.target.value)}
                      placeholder="e.g. Discussed at weekly SMC review..."
                      className="w-full p-2.5 bg-white border border-slate-300 rounded"
                    />
                  </div>
                </div>

                {newStatusChoice === 'Verified Resolved' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 flex items-start gap-2">
                    <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                    <div>
                      <span className="font-bold">System Rule: </span>
                      Complaints cannot be marked "Verified Resolved" from this general dropdown.
                      Resolution must be validated via physical inspection on the dedicated <strong>Verify Repairs</strong> page.
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateTrack(activeComplaint.id);
                      setActiveComplaint(null);
                    }}
                    className="text-xs text-blue-900 hover:underline cursor-pointer"
                  >
                    View Full Audit Timeline →
                  </button>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded shadow-xs cursor-pointer transition-colors"
                  >
                    {isUpdating ? 'Saving...' : 'Save Status Update'}
                  </button>
                </div>
              </form>

              {/* If complaint is ready for verification */}
              {activeComplaint.status === 'Verification Pending' && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-purple-900">Repair Reported by Field Worker</div>
                    <div className="text-[11px] text-purple-700">Awaiting School Management Committee verification</div>
                  </div>
                  <button
                    onClick={() => {
                      onNavigateVerify(activeComplaint.id);
                      setActiveComplaint(null);
                    }}
                    className="px-3 py-1.5 bg-purple-900 hover:bg-purple-800 text-white font-semibold rounded text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Go to Verify Repairs</span>
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </div>
  );
};
