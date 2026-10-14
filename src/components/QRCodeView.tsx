import React, { useState } from 'react';
import { Printer, Download, Copy, Check, School, QrCode as QrIcon, ExternalLink } from 'lucide-react';

interface QRCodeViewProps {
  onNavigateReport: () => void;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({ onNavigateReport }) => {
  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const reportUrl = `${currentHost}?view=report`;
  const [copied, setCopied] = useState(false);
  const [schoolLabel, setSchoolLabel] = useState('Government Model School');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campus QR Code & Noticeboard Poster</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Display this QR code at school entrances, staff rooms, and Anganwadis for instant community reporting.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Poster</span>
          </button>
        </div>
      </div>

      {/* School Name Customizer */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <label className="text-slate-700 font-medium">Customise Poster School Name:</label>
        <input
          type="text"
          value={schoolLabel}
          onChange={(e) => setSchoolLabel(e.target.value)}
          className="w-full sm:w-72 p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-semibold"
          placeholder="Enter school name..."
        />
      </div>

      {/* Printable Poster Canvas */}
      <div id="printable-poster" className="bg-white border-2 border-slate-900 rounded-lg p-8 sm:p-12 shadow-md text-center max-w-xl mx-auto space-y-6">
        
        {/* National / State Edu Banner Style */}
        <div className="space-y-1 border-b-2 border-slate-900 pb-5">
          <div className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
            School Infrastructure Accountability Cell
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase">
            {schoolLabel}
          </h2>
          <div className="text-xs font-semibold text-slate-600">
            ShikshaSetu Community Reporting Station
          </div>
        </div>

        {/* Poster Heading */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">
            Report a Problem · समस्या की रिपोर्ट करें
          </h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            Scan with any smartphone camera to report broken taps, damaged toilets, power failures, or roof damage.
          </p>
        </div>

        {/* QR Code Container */}
        <div className="p-6 bg-slate-50 border-2 border-slate-900 rounded-xl inline-block mx-auto shadow-inner">
          {/* High-contrast crisp SVG QR Code representation */}
          <div className="w-52 h-52 bg-white p-3 rounded-lg border border-slate-300 flex flex-col items-center justify-center relative">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-slate-950"
              fill="currentColor"
            >
              {/* Top-left position detection pattern */}
              <rect x="5" y="5" width="28" height="28" fill="black" />
              <rect x="9" y="9" width="20" height="20" fill="white" />
              <rect x="13" y="13" width="12" height="12" fill="black" />

              {/* Top-right position detection pattern */}
              <rect x="67" y="5" width="28" height="28" fill="black" />
              <rect x="71" y="9" width="20" height="20" fill="white" />
              <rect x="75" y="13" width="12" height="12" fill="black" />

              {/* Bottom-left position detection pattern */}
              <rect x="5" y="67" width="28" height="28" fill="black" />
              <rect x="9" y="71" width="20" height="20" fill="white" />
              <rect x="13" y="75" width="12" height="12" fill="black" />

              {/* Timing pattern lines */}
              <rect x="37" y="17" width="4" height="4" fill="black" />
              <rect x="45" y="17" width="4" height="4" fill="black" />
              <rect x="53" y="17" width="4" height="4" fill="black" />
              <rect x="17" y="37" width="4" height="4" fill="black" />
              <rect x="17" y="45" width="4" height="4" fill="black" />
              <rect x="17" y="53" width="4" height="4" fill="black" />

              {/* Data blocks */}
              <rect x="37" y="37" width="8" height="8" fill="black" />
              <rect x="49" y="37" width="8" height="4" fill="black" />
              <rect x="61" y="37" width="4" height="8" fill="black" />
              <rect x="41" y="49" width="8" height="8" fill="black" />
              <rect x="53" y="49" width="8" height="8" fill="black" />
              <rect x="65" y="49" width="8" height="4" fill="black" />
              <rect x="37" y="61" width="4" height="8" fill="black" />
              <rect x="45" y="61" width="8" height="8" fill="black" />
              <rect x="61" y="61" width="8" height="8" fill="black" />

              <rect x="37" y="73" width="8" height="8" fill="black" />
              <rect x="49" y="73" width="4" height="8" fill="black" />
              <rect x="57" y="73" width="8" height="8" fill="black" />
              <rect x="69" y="73" width="8" height="4" fill="black" />

              <rect x="73" y="41" width="8" height="8" fill="black" />
              <rect x="85" y="41" width="8" height="8" fill="black" />
              <rect x="73" y="57" width="8" height="8" fill="black" />
              <rect x="85" y="57" width="8" height="8" fill="black" />
            </svg>
            <div className="absolute inset-x-0 -bottom-1 text-center">
              <span className="text-[9px] bg-slate-900 text-white font-mono px-2 py-0.5 rounded">
                SCAN TO REPORT
              </span>
            </div>
          </div>
        </div>

        {/* 3 Step Instructions */}
        <div className="grid grid-cols-3 gap-2 text-left text-xs border-t border-slate-200 pt-4">
          <div className="p-2 bg-slate-50 rounded">
            <span className="font-bold text-slate-900 block">1. Scan QR</span>
            <span className="text-[11px] text-slate-500">Open camera on your phone</span>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <span className="font-bold text-slate-900 block">2. Snap Photo</span>
            <span className="text-[11px] text-slate-500">Upload broken item photo</span>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <span className="font-bold text-slate-900 block">3. Track ID</span>
            <span className="text-[11px] text-slate-500">Follow repair progress</span>
          </div>
        </div>

        {/* Footer & direct access button */}
        <div className="text-[11px] text-slate-500 pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-100">
          <span>Portal: {reportUrl}</span>
          <button
            onClick={onNavigateReport}
            className="text-blue-900 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open Report Form Directly</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* Deployment Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-1">
        <div className="font-semibold text-slate-800">Deployment & Field Note</div>
        <p className="leading-relaxed">
          In this local / staging environment, the QR code encodes the current active origin ({currentHost}).
          When deployed to a district production domain (e.g. <code>shikshasetu.up.gov.in</code>), laminated copies of this poster
          are affixed beside school entry gates and Anganwadi verandas so parents and village committee members can file complaints without downloading any heavy app.
        </p>
      </div>
    </div>
  );
};
