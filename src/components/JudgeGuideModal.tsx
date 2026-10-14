import React, { useState } from 'react';
import { ActiveTab } from './Navbar';
import { X, CheckCircle, ArrowRight, RotateCcw, Sparkles, ExternalLink } from 'lucide-react';

interface JudgeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: ActiveTab, prefillId?: string) => void;
  onResetDemo: () => void;
}

interface StepItem {
  step: number;
  title: string;
  desc: string;
  targetTab: ActiveTab;
  buttonLabel: string;
  tip?: string;
}

const STEPS: StepItem[] = [
  {
    step: 1,
    title: 'Open Report an Issue',
    desc: 'Access the public community reporting form used by teachers and parents.',
    targetTab: 'report',
    buttonLabel: 'Go to Report an Issue',
  },
  {
    step: 2,
    title: 'Submit a Broken-Tap Complaint',
    desc: 'Click "Quick Demo Sample" or enter details with an optional photograph.',
    targetTab: 'report',
    buttonLabel: 'Open Form',
    tip: 'Clicking "Quick Demo Sample" pre-fills a realistic drinking-water complaint instantly.',
  },
  {
    step: 3,
    title: 'Receive Generated Complaint ID',
    desc: 'A unique complaint ID (e.g. SS-1006) is generated and committed to persistent storage.',
    targetTab: 'report',
    buttonLabel: 'View Submission Screen',
  },
  {
    step: 4,
    title: 'Search & Track Complaint',
    desc: 'Open Track a Complaint to view the audit timeline, days open, and status indicators.',
    targetTab: 'track',
    buttonLabel: 'Open Track a Complaint',
    tip: 'Notice the days open counter and prototype overdue threshold indicators.',
  },
  {
    step: 5,
    title: 'Authority Dashboard Assignment',
    desc: 'Open Authority View, select the complaint, and assign the Water Supply / Maintenance wing.',
    targetTab: 'authority',
    buttonLabel: 'Go to Authority View',
    tip: 'Check out the auto-suggest mapping between issue types and responsible wings.',
  },
  {
    step: 6,
    title: 'Update Status to In Progress',
    desc: 'Simulate field contractor mobilization by moving the ticket status to "In Progress".',
    targetTab: 'authority',
    buttonLabel: 'Manage Status in Authority View',
  },
  {
    step: 7,
    title: 'Report Repair as Completed',
    desc: 'Click "Report Repair as Completed" to attach work notes and move ticket to "Verification Pending".',
    targetTab: 'authority',
    buttonLabel: 'Simulate Repair Hand-off',
    tip: 'Notice that the complaint is NOT resolved yet! It safely stops at "Verification Pending".',
  },
  {
    step: 8,
    title: 'Open Verify Repairs',
    desc: 'School Management Committee accesses the dedicated verification module.',
    targetTab: 'verify',
    buttonLabel: 'Go to Verify Repairs',
  },
  {
    step: 9,
    title: 'Community Physical Sign-Off',
    desc: 'Inspect before vs after evidence, enter verifier credentials, and mark "Verified Resolved" or reopen.',
    targetTab: 'verify',
    buttonLabel: 'Inspect & Verify Repair',
    tip: 'Try both: "Verified Resolved" closes the ticket, or "Repair Incomplete" reopens it with reasons!',
  },
  {
    step: 10,
    title: 'Return to Dashboard for Updated KPIs',
    desc: 'Watch the live metrics reflect the verified resolution across schools dynamically.',
    targetTab: 'school',
    buttonLabel: 'View School Dashboard',
  },
];

export const JudgeGuideModal: React.FC<JudgeGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onResetDemo,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const current = STEPS[currentStep - 1];

  const handleStepJump = (stepNum: number) => {
    setCurrentStep(stepNum);
    const target = STEPS[stepNum - 1];
    onNavigateTab(target.targetTab);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs">
              10
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">
                GNIOT INNOVEX 2026 · 10-Step Judge Walkthrough
              </h3>
              <p className="text-[11px] text-slate-300">
                End-to-end lifecycle: Problem Reporting → Tracking → Authority Dispatch → Verified Resolution
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Active Step Spotlight Card */}
          <div className="bg-slate-50 border-2 border-blue-900/30 rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs bg-blue-900 text-white px-2.5 py-0.5 rounded">
                STEP {current.step} OF 10
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Ideathon Evaluation Sequence
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900">{current.title}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{current.desc}</p>
            </div>

            {current.tip && (
              <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded text-blue-900 text-[11px] flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                <span>{current.tip}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  disabled={currentStep === 1}
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700 font-medium disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  disabled={currentStep === 10}
                  onClick={() => setCurrentStep((prev) => Math.min(10, prev + 1))}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700 font-medium disabled:opacity-40 cursor-pointer"
                >
                  Next Step
                </button>
              </div>

              <button
                onClick={() => {
                  onNavigateTab(current.targetTab);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded shadow-xs cursor-pointer"
              >
                <span>{current.buttonLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* All 10 Steps Roadmap Grid */}
          <div>
            <h5 className="font-semibold text-slate-900 mb-2">Complete 10-Step Checklist:</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STEPS.map((s) => (
                <button
                  key={s.step}
                  onClick={() => handleStepJump(s.step)}
                  className={`p-2.5 rounded border text-left flex items-start gap-2.5 transition-colors cursor-pointer ${
                    currentStep === s.step
                      ? 'border-blue-900 bg-blue-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5 ${
                      currentStep === s.step
                        ? 'bg-blue-900 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {s.step}
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900 text-xs">{s.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{s.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer with Reset Demo Data */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              if (confirm('Reset all complaints back to initial demonstration state?')) {
                onResetDemo();
                setCurrentStep(1);
                onClose();
              }
            }}
            className="text-slate-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data (5 Clean Sample Tickets)</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
