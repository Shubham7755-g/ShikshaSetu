import React from 'react';
import { ComplaintStatus } from '../types';
import { CheckCircle2, Clock, Wrench, ShieldCheck, AlertTriangle, RotateCcw, ArrowRight } from 'lucide-react';

interface StatusIndicatorProps {
  status: ComplaintStatus;
  isOverdue?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  isOverdue = false,
  size = 'md',
}) => {
  const getStatusConfig = () => {
    if (isOverdue && status !== 'Verified Resolved') {
      return {
        label: `${status} (Overdue)`,
        icon: AlertTriangle,
        textColor: 'text-rose-700',
        dotBg: 'bg-rose-600',
      };
    }

    switch (status) {
      case 'Submitted':
        return {
          label: 'Submitted',
          icon: Clock,
          textColor: 'text-amber-700',
          dotBg: 'bg-amber-600',
        };
      case 'Under Review':
        return {
          label: 'Under Review',
          icon: Clock,
          textColor: 'text-amber-800',
          dotBg: 'bg-amber-600',
        };
      case 'Assigned':
        return {
          label: 'Assigned',
          icon: ArrowRight,
          textColor: 'text-blue-800',
          dotBg: 'bg-blue-600',
        };
      case 'In Progress':
        return {
          label: 'In Progress',
          icon: Wrench,
          textColor: 'text-indigo-800',
          dotBg: 'bg-indigo-600',
        };
      case 'Repair Reported':
      case 'Verification Pending':
        return {
          label: 'Verification Pending',
          icon: ShieldCheck,
          textColor: 'text-purple-800',
          dotBg: 'bg-purple-600',
        };
      case 'Verified Resolved':
        return {
          label: 'Verified Resolved',
          icon: CheckCircle2,
          textColor: 'text-emerald-700',
          dotBg: 'bg-emerald-600',
        };
      case 'Reopened':
        return {
          label: 'Reopened',
          icon: RotateCcw,
          textColor: 'text-rose-700',
          dotBg: 'bg-rose-600',
        };
      default:
        return {
          label: status,
          icon: Clock,
          textColor: 'text-slate-700',
          dotBg: 'bg-slate-600',
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs gap-1.5',
    md: 'text-sm gap-2',
    lg: 'text-base gap-2.5',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={`inline-flex items-center font-medium ${sizeClasses[size]} ${config.textColor}`}>
      <IconComponent className={`${iconSizes[size]} shrink-0`} />
      <span>{config.label}</span>
    </div>
  );
};
