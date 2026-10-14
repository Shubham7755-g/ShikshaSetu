import React, { useState } from 'react';
import { IssueCategory, ReporterRole, Complaint } from '../types';
import { createComplaint } from '../services/storage';
import {
  Upload,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Camera,
  X,
  Sparkles,
} from 'lucide-react';

interface ReportIssueViewProps {
  onComplaintCreated: (complaint: Complaint) => void;
  onNavigateTrack: (complaintId: string) => void;
}

const ISSUE_CATEGORIES: IssueCategory[] = [
  'Drinking Water',
  'Toilets and Sanitation',
  'Electricity',
  'Roof or Building Damage',
  'Furniture',
  'Other',
];

const REPORTER_ROLES: ReporterRole[] = [
  'Teacher',
  'Parent',
  'School Management Committee Member',
  'School Administrator',
];

export const ReportIssueView: React.FC<ReportIssueViewProps> = ({
  onComplaintCreated,
  onNavigateTrack,
}) => {
  const [schoolName, setSchoolName] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Drinking Water');
  const [description, setDescription] = useState('');
  const [reporterRole, setReporterRole] = useState<ReporterRole>('Teacher');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [photoName, setPhotoName] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

  // File uploader handler converting to data URI
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setPhotoUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoUrl(undefined);
    setPhotoName('');
  };

  // Quick fill helper for judges (GNIOT INNOVEX 2026 test flow)
  const handleQuickFillJudgeDemo = () => {
    setSchoolName('Government Primary School, Surajpur');
    setLocation('Surajpur Block, Gautam Buddha Nagar');
    setCategory('Drinking Water');
    setDescription('Drinking water pipeline valve broken near the playground tap point. Water is overflowing and muddy puddle has formed, leaving 120 students without safe drinking water.');
    setReporterRole('Teacher');
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!schoolName.trim()) {
      errs.schoolName = 'School or Anganwadi name is required.';
    }
    if (!location.trim()) {
      errs.location = 'Location or block is required.';
    }
    if (!description.trim()) {
      errs.description = 'Please provide a short description of the problem.';
    } else if (description.trim().length < 10) {
      errs.description = 'Description should be at least 10 characters long.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate clicks

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const created = createComplaint({
        schoolName,
        location,
        category,
        description,
        reporterRole,
        photoUrl,
      });

      setSubmittedComplaint(created);
      onComplaintCreated(created);

      // Reset form fields
      setSchoolName('');
      setLocation('');
      setDescription('');
      setPhotoUrl(undefined);
      setPhotoName('');
      setErrors({});
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If complaint was just submitted, show success screen
  if (submittedComplaint) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white border border-emerald-200 rounded-lg p-8 shadow-xs text-center space-y-6">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Complaint Registered Successfully</h2>
            <p className="text-sm text-slate-600">
              Your infrastructure issue has been recorded in the ShikshaSetu system.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg inline-block text-left w-full max-w-md mx-auto space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Complaint ID:</span>
              <span className="font-mono font-bold text-sm text-slate-900">{submittedComplaint.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">School:</span>
              <span className="font-medium text-slate-900 truncate max-w-[200px]">{submittedComplaint.schoolName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Category:</span>
              <span className="font-medium text-slate-900">{submittedComplaint.category}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Initial Status:</span>
              <span className="font-semibold text-amber-700">Submitted</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-200 text-[11px] text-slate-400">
              <span>Timestamp:</span>
              <span>{new Date(submittedComplaint.submittedAt).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTrack(submittedComplaint.id)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <span>Track Complaint Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSubmittedComplaint(null)}
              className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md transition-colors cursor-pointer"
            >
              File Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Report an Infrastructure Issue</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Fill in the details below to notify school authorities and track resolution progress.
          </p>
        </div>

        {/* Quick Demo Fill Button */}
        <button
          type="button"
          onClick={handleQuickFillJudgeDemo}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-300 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Quick Demo Sample</span>
        </button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-2xs">
        
        {/* School Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1.5">
            School or Anganwadi Name <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            placeholder="e.g. Government Primary School, Surajpur"
            className={`w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 transition-colors ${
              errors.schoolName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
            }`}
          />
          {errors.schoolName && (
            <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.schoolName}</span>
            </p>
          )}
        </div>

        {/* Location or Block */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1.5">
            Location or Block <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Surajpur Block, Gautam Buddha Nagar"
            className={`w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 transition-colors ${
              errors.location ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
            }`}
          />
          {errors.location && (
            <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.location}</span>
            </p>
          )}
        </div>

        {/* Category & Reporter Role grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Issue Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Issue Category <span className="text-rose-600">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as IssueCategory)}
              className="w-full text-xs sm:text-sm px-3 py-2.5 bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 transition-colors cursor-pointer"
            >
              {ISSUE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Reporter Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Reporter Role <span className="text-rose-600">*</span>
            </label>
            <select
              value={reporterRole}
              onChange={(e) => setReporterRole(e.target.value as ReporterRole)}
              className="w-full text-xs sm:text-sm px-3 py-2.5 bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 transition-colors cursor-pointer"
            >
              {REPORTER_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1.5">
            Short Description of the Issue <span className="text-rose-600">*</span>
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the problem, severity, and exact location inside the campus (e.g. Girls toilet near library, tap leaking for 3 days)..."
            className={`w-full text-xs sm:text-sm p-3 bg-white border rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 transition-colors ${
              errors.description ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
            }`}
          />
          {errors.description && (
            <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.description}</span>
            </p>
          )}
        </div>

        {/* Photograph of the Issue (Optional) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Photograph of the Issue <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            {photoUrl && (
              <button
                type="button"
                onClick={removePhoto}
                className="text-[11px] text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Remove photo</span>
              </button>
            )}
          </div>

          {!photoUrl ? (
            <label className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50">
              <div className="w-9 h-9 rounded-full bg-white shadow-2xs flex items-center justify-center text-slate-600 mb-2">
                <Camera className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-800">Click to upload photo or take picture</span>
              <span className="text-[11px] text-slate-500 mt-0.5">PNG, JPG or WebP up to 5MB</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative border border-slate-200 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center max-h-60">
              <img
                src={photoUrl}
                alt="Uploaded issue evidence"
                className="max-h-60 object-contain w-full"
              />
              <div className="absolute bottom-2 left-2 text-[11px] bg-slate-900/80 text-white px-2 py-0.5 rounded backdrop-blur-xs font-mono">
                {photoName || 'Issue photograph'}
              </div>
            </div>
          )}
          <p className="text-[11px] text-slate-500 mt-1">
            Photographs help maintenance engineers determine exact spare parts and urgency before dispatching field staff.
          </p>
        </div>

        {/* Submit Complaint Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 text-xs sm:text-sm font-semibold text-white bg-slate-900 rounded-md transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-slate-800'
            }`}
          >
            {isSubmitting ? (
              <span>Recording Complaint...</span>
            ) : (
              <>
                <span>Submit Complaint</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <p className="text-[11px] text-center text-slate-400 mt-2">
            A unique complaint tracking ID (e.g. SS-1006) will be generated immediately upon submission.
          </p>
        </div>

      </form>
    </div>
  );
};
