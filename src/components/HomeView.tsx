import React from 'react';
import { ActiveTab } from './Navbar';
import { Complaint, StatsSummary } from '../types';
import { StatusIndicator } from './StatusIndicator';
import { calculateDaysOpen, isOverdue } from '../services/storage';
import {
  FileText,
  Search,
  LayoutDashboard,
  CheckCircle2,
  ArrowRight,
  School,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface HomeViewProps {
  stats: StatsSummary;
  recentComplaints: Complaint[];
  onNavigate: (tab: ActiveTab, prefillId?: string) => void;
  onOpenJudgeGuide: () => void;
  overdueThreshold: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  stats,
  recentComplaints,
  onNavigate,
  onOpenJudgeGuide,
  overdueThreshold,
}) => {
  return (
    <div className="space-y-10 py-6">
      {/* Ideathon & Context Banner */}
      <div className="bg-slate-100/70 border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-blue-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
            SS
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-800">
              GNIOT INNOVEX 2026 · College Ideathon Working Prototype
            </div>
            <div className="text-xs text-slate-500">
              ShikshaSetu: Report the Problem. Track the Solution. (Simulated Demonstration Environment)
            </div>
          </div>
        </div>
        <button
          onClick={onOpenJudgeGuide}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-900 hover:text-blue-950 bg-white border border-slate-300 px-3 py-1.5 rounded-md hover:border-slate-400 transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Launch 10-Step Judge Flow</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
          School problems shouldn't go unnoticed.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Report infrastructure issues, follow their progress, and check whether repairs have been completed.
          Built for teachers, parents, and school management committees to ensure accountable resolutions.
        </p>
      </div>

      {/* Four Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Action 1 */}
        <button
          onClick={() => onNavigate('report')}
          className="group text-left p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-lg shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-800 mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">Report an Issue</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Submit broken taps, damaged benches, electrical hazards, or roof leakage with photo evidence.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-900 group-hover:translate-x-0.5 transition-transform">
            <span>Open form</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Action 2 */}
        <button
          onClick={() => onNavigate('track')}
          className="group text-left p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-lg shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-800 mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">Track a Complaint</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Enter any complaint ID (e.g. SS-1001) to view audit timeline, days pending, and assignment status.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-900 group-hover:translate-x-0.5 transition-transform">
            <span>Search complaint</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Action 3 */}
        <button
          onClick={() => onNavigate('school')}
          className="group text-left p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-lg shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-800 mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">School Dashboard</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Monitor active school maintenance tickets, filter by category, and update inspection stages.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-900 group-hover:translate-x-0.5 transition-transform">
            <span>View records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Action 4 */}
        <button
          onClick={() => onNavigate('verify')}
          className="group text-left p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-lg shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-800 mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">Verify a Repair</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Compare before/after photos and approve resolution or reopen incomplete repairs with feedback.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-900 group-hover:translate-x-0.5 transition-transform">
            <span>Inspect repairs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      {/* Compact Summary of Complaint Records (Calculated from Database) */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Current Complaint Metrics</h2>
            <p className="text-xs text-slate-500">Live counts calculated dynamically from database records</p>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Overdue Benchmark: {overdueThreshold} Days
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-5">
          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">Total Complaints</div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {stats.total}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Across registered schools</div>
          </div>

          <div>
            <div className="text-xs font-medium text-amber-700 mb-1">Pending Action</div>
            <div className="text-2xl font-bold text-amber-800 font-mono tabular-nums">
              {stats.submitted + stats.underReview + stats.assigned}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {stats.submitted} submitted · {stats.assigned} assigned
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-indigo-700 mb-1">In-Progress Repairs</div>
            <div className="text-2xl font-bold text-indigo-900 font-mono tabular-nums">
              {stats.inProgress + stats.verificationPending}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {stats.verificationPending} awaiting verification
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-emerald-700 mb-1">Verified Resolved</div>
            <div className="text-2xl font-bold text-emerald-800 font-mono tabular-nums">
              {stats.verifiedResolved}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Inspected & sign-off complete</div>
          </div>
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Recent Complaints</h2>
            <p className="text-xs text-slate-500">Recently filed infrastructure issues and verification status</p>
          </div>
          <button
            onClick={() => onNavigate('school')}
            className="text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-medium">
                <th className="py-2.5 px-3">Complaint ID</th>
                <th className="py-2.5 px-3">School</th>
                <th className="py-2.5 px-3">Issue Category</th>
                <th className="py-2.5 px-3">Date Reported</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentComplaints.slice(0, 5).map((complaint) => {
                const overdue = isOverdue(complaint, overdueThreshold);
                const days = calculateDaysOpen(complaint.submittedAt);
                return (
                  <tr
                    key={complaint.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900">
                      {complaint.id}
                    </td>
                    <td className="py-3 px-3 text-slate-800">
                      <div className="font-medium text-slate-900">{complaint.schoolName}</div>
                      <div className="text-[11px] text-slate-500">{complaint.location}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      <span>{complaint.category}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono">
                      <div>{new Date(complaint.submittedAt).toLocaleDateString()}</div>
                      <div className="text-[11px] text-slate-400">
                        {days === 0 ? 'Today' : `${days}d open`}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <StatusIndicator status={complaint.status} isOverdue={overdue} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onNavigate('track', complaint.id)}
                        className="text-xs font-semibold text-blue-900 hover:text-blue-950 px-2 py-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        Track
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Practical Notice for School Community */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <School className="w-4 h-4 text-slate-700" />
          <span>About ShikshaSetu at GNIOT INNOVEX 2026</span>
        </div>
        <p className="leading-relaxed">
          ShikshaSetu bridges the accountability gap in public school infrastructure. Traditional complaint boxes and verbal requests
          often lead to lost records or unverified completion. By connecting a simple mobile-friendly submission form with
          transparent tracking and a mandatory post-repair verification sign-off, schools ensure that reported repairs are physically completed.
        </p>
      </div>
    </div>
  );
};
