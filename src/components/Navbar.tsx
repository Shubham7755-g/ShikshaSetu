import React from 'react';
import { PlusCircle, HelpCircle } from 'lucide-react';

export type ActiveTab = 'home' | 'report' | 'track' | 'school' | 'authority' | 'verify' | 'qr';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenJudgeGuide: () => void;
  overdueCount?: number;
  verificationCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenJudgeGuide,
  verificationCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onSelectTab('home')}
          className="text-left cursor-pointer group focus:outline-hidden"
        >
          <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors whitespace-nowrap shrink-0">
            ShikshaSetu
          </span>
        </button>

        {/* Zone 2: Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('home')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'home'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onSelectTab('report')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'report'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            Report an Issue
          </button>

          <button
            onClick={() => onSelectTab('track')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'track'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            Track a Complaint
          </button>

          <button
            onClick={() => onSelectTab('school')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'school'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            School Dashboard
          </button>

          <button
            onClick={() => onSelectTab('authority')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'authority'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            Authority View
          </button>

          <button
            onClick={() => onSelectTab('verify')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'verify'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            <span>Verify Repairs</span>
            {verificationCount > 0 && (
              <span className="text-[11px] font-mono text-purple-700 font-bold">
                ({verificationCount})
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('qr')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'qr'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            QR Poster
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenJudgeGuide}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
            title="10-step interactive walkthrough for ideathon judges"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Judge Guide (10 Steps)</span>
          </button>

          <button
            onClick={() => onSelectTab('report')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs whitespace-nowrap cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Issue</span>
          </button>
        </div>
      </div>

      {/* Mobile sub-navigation bar */}
      <div className="lg:hidden flex items-center gap-4 px-4 py-2 bg-slate-50 border-t border-slate-200 overflow-x-auto text-xs font-medium scrollbar-none">
        <button
          onClick={() => onSelectTab('home')}
          className={`whitespace-nowrap px-2 py-1 rounded cursor-pointer ${
            activeTab === 'home' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => onSelectTab('report')}
          className={`whitespace-nowrap px-2 py-1 rounded cursor-pointer ${
            activeTab === 'report' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Report
        </button>
        <button
          onClick={() => onSelectTab('track')}
          className={`whitespace-nowrap px-2 py-1 rounded cursor-pointer ${
            activeTab === 'track' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Track
        </button>
        <button
          onClick={() => onSelectTab('school')}
          className={`whitespace-nowrap px-2 py-1 rounded cursor-pointer ${
            activeTab === 'school' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          School
        </button>
        <button
          onClick={() => onSelectTab('authority')}
          className={`whitespace-nowrap px-2 py-1 rounded cursor-pointer ${
            activeTab === 'authority' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Authority
        </button>
        <button
          onClick={() => onSelectTab('verify')}
          className={`whitespace-nowrap px-2 py-1 rounded cursor-pointer ${
            activeTab === 'verify' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Verify {verificationCount > 0 ? `(${verificationCount})` : ''}
        </button>
        <button
          onClick={() => onSelectTab('qr')}
          className={`whitespace-nowrap px-2 py-1 rounded cursor-pointer ${
            activeTab === 'qr' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          QR Poster
        </button>
        <button
          onClick={onOpenJudgeGuide}
          className="whitespace-nowrap px-2 py-1 rounded text-blue-700 cursor-pointer"
        >
          Judge Guide
        </button>
      </div>
    </header>
  );
};
