import React from 'react';
import { IssueCategory } from '../types';
import { Droplets, Wrench, Zap, Home, Armchair, AlertCircle } from 'lucide-react';

interface IssueGraphicProps {
  category: IssueCategory;
  photoUrl?: string;
  className?: string;
  altText?: string;
  compact?: boolean;
}

export const IssueGraphic: React.FC<IssueGraphicProps> = ({
  category,
  photoUrl,
  className = 'w-full h-48',
  altText = 'Issue photograph',
  compact = false,
}) => {
  if (photoUrl && photoUrl.startsWith('data:image')) {
    return (
      <div className={`relative overflow-hidden rounded-lg bg-slate-100 border border-slate-200 ${className}`}>
        <img
          src={photoUrl}
          alt={altText}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Domain styled visual illustration matching the specific category
  const renderIconAndStyle = () => {
    switch (category) {
      case 'Drinking Water':
        return {
          icon: <Droplets className={compact ? 'w-5 h-5 text-sky-700' : 'w-10 h-10 text-sky-700'} />,
          bg: 'bg-sky-50',
          border: 'border-sky-200',
          accent: 'text-sky-900',
          tag: 'Clean Water Infra',
          sub: 'Drinking water taps, submersible pumps & pipeline',
        };
      case 'Toilets and Sanitation':
        return {
          icon: <Wrench className={compact ? 'w-5 h-5 text-teal-700' : 'w-10 h-10 text-teal-700'} />,
          bg: 'bg-teal-50',
          border: 'border-teal-200',
          accent: 'text-teal-900',
          tag: 'Sanitation Facility',
          sub: 'Latrines, running water, drainage & hygiene',
        };
      case 'Electricity':
        return {
          icon: <Zap className={compact ? 'w-5 h-5 text-amber-700' : 'w-10 h-10 text-amber-700'} />,
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          accent: 'text-amber-900',
          tag: 'Electrical Safety',
          sub: 'Switchboards, ceiling fans, wiring & breakers',
        };
      case 'Roof or Building Damage':
        return {
          icon: <Home className={compact ? 'w-5 h-5 text-rose-700' : 'w-10 h-10 text-rose-700'} />,
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          accent: 'text-rose-900',
          tag: 'Civil Structural',
          sub: 'Ceiling plaster, roof leakage, boundary walls',
        };
      case 'Furniture':
        return {
          icon: <Armchair className={compact ? 'w-5 h-5 text-indigo-700' : 'w-10 h-10 text-indigo-700'} />,
          bg: 'bg-indigo-50',
          border: 'border-indigo-200',
          accent: 'text-indigo-900',
          tag: 'Classroom Furniture',
          sub: 'Dual desks, teacher chairs, blackboards',
        };
      default:
        return {
          icon: <AlertCircle className={compact ? 'w-5 h-5 text-slate-700' : 'w-10 h-10 text-slate-700'} />,
          bg: 'bg-slate-100',
          border: 'border-slate-300',
          accent: 'text-slate-900',
          tag: 'General Facility',
          sub: 'Playground, gates, kitchen sheds & windows',
        };
    }
  };

  const style = renderIconAndStyle();

  if (compact) {
    return (
      <div className={`flex items-center justify-center p-2 rounded-md ${style.bg} border ${style.border}`}>
        {style.icon}
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-6 text-center rounded-lg ${style.bg} border ${style.border} ${className}`}
    >
      <div className="p-3 bg-white/90 rounded-full shadow-xs mb-3">
        {style.icon}
      </div>
      <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
        {category}
      </span>
      <span className="text-xs text-slate-500 mt-1 max-w-xs line-clamp-2">
        {style.sub}
      </span>
      <div className="absolute top-2 right-2 text-[10px] text-slate-400 bg-white/80 px-2 py-0.5 rounded">
        Demonstration Visual
      </div>
    </div>
  );
};
