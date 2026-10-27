import React from 'react';
import { ReportStatus, PriorityLevel, AlertSeverity, UserRole } from '../../types/civic';

export const StatusBadge: React.FC<{ status: ReportStatus; size?: 'sm' | 'md' }> = ({ status, size = 'sm' }) => {
  const configs: Record<ReportStatus, { label: string; bg: string; text: string; border: string }> = {
    submitted: { label: 'Submitted', bg: 'bg-blue-50 dark:bg-blue-950/60', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
    under_review: { label: 'Under Review', bg: 'bg-purple-50 dark:bg-purple-950/60', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
    assigned: { label: 'Assigned', bg: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
    in_progress: { label: 'In Progress', bg: 'bg-orange-50 dark:bg-orange-950/60', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
    awaiting_verification: { label: 'Awaiting Verification', bg: 'bg-yellow-50 dark:bg-yellow-950/60', text: 'text-yellow-800 dark:text-yellow-300', border: 'border-yellow-300 dark:border-yellow-700' },
    resolved: { label: 'Resolved', bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
    closed: { label: 'Closed', bg: 'bg-stone-100 dark:bg-stone-800', text: 'text-stone-700 dark:text-stone-300', border: 'border-stone-300 dark:border-stone-700' },
    more_info_required: { label: 'Info Requested', bg: 'bg-cyan-50 dark:bg-cyan-950/60', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800' },
    rejected: { label: 'Rejected', bg: 'bg-rose-50 dark:bg-rose-950/60', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800' },
    on_hold: { label: 'On Hold', bg: 'bg-stone-100 dark:bg-stone-800', text: 'text-stone-600 dark:text-stone-400', border: 'border-stone-300 dark:border-stone-700' },
    reopened: { label: 'Disputed / Reopened', bg: 'bg-red-50 dark:bg-red-950/60', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800' }
  };

  const c = configs[status] || configs.submitted;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${c.bg} ${c.text} ${c.border} ${padding}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {c.label}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: PriorityLevel }> = ({ priority }) => {
  const configs: Record<PriorityLevel, { label: string; bg: string; text: string; border: string }> = {
    low: { label: 'Low', bg: 'bg-slate-100 text-slate-700 border-slate-200', text: 'text-slate-700', border: 'border-slate-200' },
    medium: { label: 'Medium', bg: 'bg-blue-100/70 text-blue-800 border-blue-200', text: 'text-blue-800', border: 'border-blue-200' },
    high: { label: 'High Priority', bg: 'bg-amber-100 text-amber-900 border-amber-300', text: 'text-amber-900', border: 'border-amber-300' },
    urgent: { label: 'Urgent SLA', bg: 'bg-red-100 text-red-900 border-red-300 font-bold animate-pulse', text: 'text-red-900', border: 'border-red-300' }
  };

  const c = configs[priority] || configs.medium;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border ${c.bg}`}>
      {priority === 'urgent' && <span className="w-1.5 h-1.5 rounded-full bg-red-600" />}
      {c.label}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: AlertSeverity }> = ({ severity }) => {
  const configs: Record<AlertSeverity, { label: string; badgeClass: string }> = {
    advisory: { label: 'Public Advisory', badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40' },
    watch: { label: 'Public Watch', badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    warning: { label: 'Official Warning', badgeClass: 'bg-orange-500/25 text-orange-300 border-orange-500/50' },
    emergency: { label: 'Critical Emergency', badgeClass: 'bg-red-600/30 text-red-200 border-red-500 font-semibold animate-pulse' }
  };

  const c = configs[severity] || configs.advisory;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs uppercase tracking-wider font-semibold border ${c.badgeClass}`}>
      <span className="w-2 h-2 rounded-full bg-current" />
      {c.label}
    </span>
  );
};

export const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  const configs: Record<UserRole, { label: string; bg: string; text: string; border: string }> = {
    citizen: { label: 'Citizen Resident', bg: 'bg-[#176B52]/15', text: 'text-[#176B52] dark:text-[#9ADBC0]', border: 'border-[#176B52]/30' },
    org_admin: { label: 'Organization Admin', bg: 'bg-[#762E42]/15', text: 'text-[#762E42] dark:text-[#E9A7B2]', border: 'border-[#762E42]/30' },
    field_staff: { label: 'Field Operations', bg: 'bg-[#F28C45]/15', text: 'text-[#B45309] dark:text-[#F28C45]', border: 'border-[#F28C45]/30' },
    super_admin: { label: 'Platform Super Admin', bg: 'bg-[#49345F]/15', text: 'text-[#49345F] dark:text-[#B8A0E3]', border: 'border-[#49345F]/30' }
  };

  const c = configs[role] || configs.citizen;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
  );
};
