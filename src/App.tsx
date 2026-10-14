import React, { useState, useEffect } from 'react';
import { ActiveTab, Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { ReportIssueView } from './components/ReportIssueView';
import { TrackComplaintView } from './components/TrackComplaintView';
import { SchoolDashboardView } from './components/SchoolDashboardView';
import { AuthorityDashboardView } from './components/AuthorityDashboardView';
import { VerifyRepairsView } from './components/VerifyRepairsView';
import { QRCodeView } from './components/QRCodeView';
import { JudgeGuideModal } from './components/JudgeGuideModal';
import {
  getStoredComplaints,
  getStatsSummary,
  resetToDemoData,
  DEFAULT_OVERDUE_DAYS_THRESHOLD,
} from './services/storage';
import { Complaint, StatsSummary } from './types';
import { RotateCcw, Sliders, Shield } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<StatsSummary>({
    total: 0,
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
  });

  const [prefillId, setPrefillId] = useState<string>('');
  const [isJudgeGuideOpen, setIsJudgeGuideOpen] = useState(false);
  const [overdueThreshold, setOverdueThreshold] = useState<number>(DEFAULT_OVERDUE_DAYS_THRESHOLD);

  // Check URL query parameters on load (e.g. ?view=report)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const view = urlParams.get('view');
      const id = urlParams.get('id');
      if (view === 'report') setActiveTab('report');
      else if (view === 'track') setActiveTab('track');
      else if (view === 'verify') setActiveTab('verify');
      else if (view === 'school') setActiveTab('school');
      else if (view === 'authority') setActiveTab('authority');

      if (id) setPrefillId(id);
    }
  }, []);

  const refreshData = () => {
    const data = getStoredComplaints();
    setComplaints(data);
    setStats(getStatsSummary(overdueThreshold));
  };

  useEffect(() => {
    refreshData();
  }, [overdueThreshold]);

  const handleNavigate = (tab: ActiveTab, idToPrefill?: string) => {
    if (idToPrefill) {
      setPrefillId(idToPrefill);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetDemo = () => {
    resetToDemoData();
    refreshData();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => handleNavigate(tab)}
        onOpenJudgeGuide={() => setIsJudgeGuideOpen(true)}
        overdueCount={stats.overdueCount}
        verificationCount={stats.verificationPending}
      />

      {/* Main Container Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {activeTab === 'home' && (
          <HomeView
            stats={stats}
            recentComplaints={complaints}
            onNavigate={handleNavigate}
            onOpenJudgeGuide={() => setIsJudgeGuideOpen(true)}
            overdueThreshold={overdueThreshold}
          />
        )}

        {activeTab === 'report' && (
          <ReportIssueView
            onComplaintCreated={(newComp) => {
              refreshData();
            }}
            onNavigateTrack={(newId) => handleNavigate('track', newId)}
          />
        )}

        {activeTab === 'track' && (
          <TrackComplaintView
            initialComplaintId={prefillId}
            allComplaints={complaints}
            overdueThreshold={overdueThreshold}
            onNavigateVerify={(id) => handleNavigate('verify', id)}
            onNavigateAuthority={(id) => handleNavigate('authority', id)}
          />
        )}

        {activeTab === 'school' && (
          <SchoolDashboardView
            complaints={complaints}
            stats={stats}
            onRefreshData={refreshData}
            onNavigateTrack={(id) => handleNavigate('track', id)}
            onNavigateVerify={(id) => handleNavigate('verify', id)}
            overdueThreshold={overdueThreshold}
          />
        )}

        {activeTab === 'authority' && (
          <AuthorityDashboardView
            complaints={complaints}
            overdueThreshold={overdueThreshold}
            onRefreshData={refreshData}
            onNavigateVerify={(id) => handleNavigate('verify', id)}
            onNavigateTrack={(id) => handleNavigate('track', id)}
          />
        )}

        {activeTab === 'verify' && (
          <VerifyRepairsView
            complaints={complaints}
            initialComplaintId={prefillId}
            onRefreshData={refreshData}
            onNavigateTrack={(id) => handleNavigate('track', id)}
          />
        )}

        {activeTab === 'qr' && (
          <QRCodeView onNavigateReport={() => handleNavigate('report')} />
        )}
      </main>

      {/* 10-Step Interactive Judge Guide Modal */}
      <JudgeGuideModal
        isOpen={isJudgeGuideOpen}
        onClose={() => setIsJudgeGuideOpen(false)}
        onNavigateTab={handleNavigate}
        onResetDemo={handleResetDemo}
      />

      {/* Footer & Evaluator Bar */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Top footer row: Title, ideathon badge, threshold adjuster */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <span>ShikshaSetu</span>
                <span className="text-slate-400 font-normal">·</span>
                <span className="font-normal text-slate-600">GNIOT INNOVEX 2026 Ideathon Prototype</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                "Report the Problem. Track the Solution." · Built for government school & Anganwadi infrastructure accountability.
              </p>
            </div>

            {/* Prototype settings for judges */}
            <div className="flex flex-wrap items-center gap-4 text-xs bg-slate-50 p-2.5 rounded-md border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-700">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span>Overdue Benchmark:</span>
                <select
                  value={overdueThreshold}
                  onChange={(e) => setOverdueThreshold(Number(e.target.value))}
                  className="bg-white border border-slate-300 rounded px-1.5 py-0.5 font-mono font-semibold text-slate-900 cursor-pointer"
                  title="Configure demonstration overdue threshold"
                >
                  <option value={7}>7 Days</option>
                  <option value={14}>14 Days (Default)</option>
                  <option value={21}>21 Days</option>
                </select>
              </div>

              <button
                onClick={handleResetDemo}
                className="text-slate-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer font-medium"
                title="Resets demo data to initial state"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Demo Tickets</span>
              </button>
            </div>
          </div>

          {/* Bottom footer row: Disclaimers & Ethics */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                Demonstration Prototype: Notifications and department workflows are simulated. No unnecessary personal data collected.
              </span>
            </div>
            <div>
              Designed for GNIOT INNOVEX 2026 Evaluation
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
