import React, { useState } from 'react';
import {
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  PlusCircle,
  Search,
  Filter,
  Download,
  ShieldCheck,
  MapPin,
  ExternalLink,
  X,
  FileCheck2,
  SlidersHorizontal,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { CivicReport, PublicAlert, IssueCategory, Department, UserProfile, PriorityLevel, AlertSeverity } from '../../types/civic';
import { StatusBadge, PriorityBadge, SeverityBadge } from '../common/Badge';
import { civicStore } from '../../services/store';

interface OrgAdminDashboardProps {
  currentUser: UserProfile;
  reports: CivicReport[];
  alerts: PublicAlert[];
  departments: Department[];
  categories: IssueCategory[];
  users: UserProfile[];
  onOpenReportDetail: (report: CivicReport) => void;
}

export const OrgAdminDashboard: React.FC<OrgAdminDashboardProps> = ({
  currentUser,
  reports,
  alerts,
  departments,
  categories,
  users,
  onOpenReportDetail
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'review_queue' | 'all_reports' | 'verification' | 'alerts_mgmt' | 'staff' | 'audit'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [assigningReport, setAssigningReport] = useState<CivicReport | null>(null);
  const [assignStaffId, setAssignStaffId] = useState(users.find(u => u.role === 'field_staff')?.id || '');
  const [assignDeptId, setAssignDeptId] = useState(departments[0]?.id || '');
  const [assignInstructions, setAssignInstructions] = useState('');
  const [assignPriority, setAssignPriority] = useState<PriorityLevel>('urgent');
  const [assignTargetDate, setAssignTargetDate] = useState('2026-10-28T18:00');

  const [reviewModalReport, setReviewModalReport] = useState<CivicReport | null>(null);
  const [reviewDecision, setReviewDecision] = useState<'approve' | 'reject' | 'request_info'>('approve');
  const [reviewNotes, setReviewNotes] = useState('');

  const [verifyModalReport, setVerifyModalReport] = useState<CivicReport | null>(null);
  const [verifyNotes, setVerifyNotes] = useState('');

  // New Alert Creation State
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDesc, setAlertDesc] = useState('');
  const [alertCat, setAlertCat] = useState('Severe Weather & Drainage');
  const [alertSev, setAlertSev] = useState<AlertSeverity>('warning');
  const [alertArea, setAlertArea] = useState('Highland Corridor & 4th Street');
  const [alertInst, setAlertInst] = useState('Follow marked detour routes and deploy sandbags if near baseline drainage.');
  const [alertExpiry, setAlertExpiry] = useState('2026-10-29T23:59');

  // Filter organization reports
  const orgReports = reports;
  const reviewQueue = orgReports.filter(r => r.status === 'submitted' || r.status === 'more_info_required');
  const activeWork = orgReports.filter(r => r.status === 'assigned' || r.status === 'in_progress');
  const awaitingVerification = orgReports.filter(r => r.status === 'awaiting_verification');
  const resolvedReports = orgReports.filter(r => r.status === 'resolved' || r.status === 'closed');

  const fieldStaffMembers = users.filter(u => u.role === 'field_staff');

  const handleExportCSV = () => {
    const csvContent = civicStore.exportReportsToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CivicSync_Reports_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningReport) return;
    try {
      civicStore.assignReport({
        reportId: assigningReport.id,
        staffId: assignStaffId,
        departmentId: assignDeptId,
        instructions: assignInstructions.trim() || 'Inspect site, execute required repairs, and upload completion evidence.',
        priority: assignPriority,
        targetCompletionDate: assignTargetDate ? new Date(assignTargetDate).toISOString() : undefined
      });
      alert(`Assigned ${assigningReport.reportNumber} to selected field lead.`);
      setAssigningReport(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleConfirmReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalReport) return;
    try {
      civicStore.reviewReport(
        reviewModalReport.id,
        reviewDecision,
        reviewNotes.trim() || 'Reviewed and triaged according to municipal operational guidelines.',
        assignDeptId
      );
      alert(`Report ${reviewModalReport.reportNumber} updated.`);
      setReviewModalReport(null);
      setReviewNotes('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleConfirmVerification = (approved: boolean) => {
    if (!verifyModalReport) return;
    try {
      civicStore.verifyResolution(
        verifyModalReport.id,
        approved,
        verifyNotes.trim() || (approved ? 'Visual evidence meets civic infrastructure specifications.' : 'Rework requested.')
      );
      alert(`Resolution verification ${approved ? 'APPROVED' : 'RETURNED FOR REWORK'}.`);
      setVerifyModalReport(null);
      setVerifyNotes('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      civicStore.createAlert({
        title: alertTitle,
        description: alertDesc,
        category: alertCat,
        severity: alertSev,
        affectedArea: alertArea,
        instructions: alertInst.split('\n').filter(Boolean),
        expiresAt: alertExpiry ? new Date(alertExpiry).toISOString() : undefined,
        status: 'published'
      });
      alert('Official Public Safety Alert published to live feed!');
      setShowAlertModal(false);
      setAlertTitle('');
      setAlertDesc('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-[#F8F0EA] min-h-screen text-[#34262B]">
      {/* Top Banner (Deep Burgundy + Rose + Sand palette) */}
      <div className="bg-gradient-to-r from-[#762E42] via-[#652436] to-[#4F1A28] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-[#762E42]/40 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-14 h-14 rounded-full border-2 border-[#E9A7B2] object-cover shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                  {currentUser.name}
                </h1>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#E9A7B2]/20 text-[#E9A7B2] border border-[#E9A7B2]/30 font-bold">
                  Municipal Operations Director
                </span>
              </div>
              <p className="text-[#E9A7B2]/90 text-xs sm:text-sm mt-0.5">
                {currentUser.organizationName} &bull; Triage Desk &amp; Field Dispatch Authority
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAlertModal(true)}
              className="px-5 py-3 rounded-xl bg-[#D8B36A] hover:bg-[#c49f57] text-[#34262B] font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-[#34262B]" />
              <span>Broadcast Public Alert</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-4 mb-6 border-b border-[#762E42]/20">
          {[
            { id: 'overview', label: 'Command Center' },
            { id: 'review_queue', label: `Review Queue (${reviewQueue.length})` },
            { id: 'all_reports', label: `All Reports (${orgReports.length})` },
            { id: 'verification', label: `Verification Sign-off (${awaitingVerification.length})` },
            { id: 'alerts_mgmt', label: `Public Alerts (${alerts.length})` },
            { id: 'staff', label: 'Staff Directory' },
            { id: 'audit', label: 'Audit Trail' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#762E42] text-white shadow-md'
                  : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: COMMAND CENTER OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Counters */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#762E42]/15 shadow-sm">
                <span className="text-xs font-mono uppercase text-stone-500 font-bold">Total Inbound</span>
                <div className="font-mono text-3xl font-extrabold text-[#762E42] mt-1">{orgReports.length}</div>
                <div className="text-[11px] text-stone-400 mt-1">Managed district tickets</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-sm">
                <span className="text-xs font-mono uppercase text-purple-700 font-bold">Awaiting Review</span>
                <div className="font-mono text-3xl font-extrabold text-purple-800 mt-1">{reviewQueue.length}</div>
                <div className="text-[11px] text-stone-400 mt-1">Pending approval & routing</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-orange-200 shadow-sm">
                <span className="text-xs font-mono uppercase text-orange-700 font-bold">Field Active</span>
                <div className="font-mono text-3xl font-extrabold text-orange-700 mt-1">{activeWork.length}</div>
                <div className="text-[11px] text-stone-400 mt-1">Crews assigned on-site</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-yellow-200 shadow-sm">
                <span className="text-xs font-mono uppercase text-amber-700 font-bold">Awaiting Sign-off</span>
                <div className="font-mono text-3xl font-extrabold text-amber-800 mt-1">{awaitingVerification.length}</div>
                <div className="text-[11px] text-stone-400 mt-1">Evidence submitted by crew</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm">
                <span className="text-xs font-mono uppercase text-emerald-700 font-bold">Completed & Closed</span>
                <div className="font-mono text-3xl font-extrabold text-emerald-700 mt-1">{resolvedReports.length}</div>
                <div className="text-[11px] text-stone-400 mt-1">Certified resolutions</div>
              </div>
            </div>

            {/* Department Workloads & Urgent Issues */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Department Workload Breakdown */}
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#762E42]/15 shadow-md">
                <h3 className="font-heading font-bold text-base text-stone-900 mb-4">
                  Department Workload Distribution
                </h3>
                <div className="space-y-4">
                  {departments.map((dept) => {
                    const deptCount = orgReports.filter(r => r.departmentId === dept.id).length;
                    const pct = orgReports.length > 0 ? (deptCount / orgReports.length) * 100 : 0;
                    return (
                      <div key={dept.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                        <div className="flex justify-between items-center text-xs font-bold text-stone-800 mb-1.5">
                          <span>{dept.name}</span>
                          <span className="font-mono text-[#762E42]">{deptCount} Active Tickets ({dept.staffCount} Staff)</span>
                        </div>
                        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#762E42] h-full rounded-full transition-all"
                            style={{ width: `${Math.max(pct, 12)}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-stone-500 mt-1 font-mono">Lead: {dept.contactLead}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Emergency / Urgent Issues */}
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#762E42]/15 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-bold text-base text-stone-900">
                      High Priority & Urgent Queue
                    </h3>
                    <span className="text-xs font-mono text-red-600 font-bold">24-hour SLA Target</span>
                  </div>

                  <div className="space-y-3">
                    {orgReports.filter(r => r.priority === 'urgent' || r.priority === 'high').map((rep) => (
                      <div
                        key={rep.id}
                        onClick={() => onOpenReportDetail(rep)}
                        className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-[#762E42] transition cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono font-bold text-[#762E42]">{rep.reportNumber}</span>
                            <StatusBadge status={rep.status} size="sm" />
                            <PriorityBadge priority={rep.priority} />
                          </div>
                          <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#762E42] transition truncate">
                            {rep.title}
                          </h4>
                          <p className="text-[11px] text-stone-500 truncate">{rep.location.address}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 mt-4 text-[11px] text-stone-500 text-center">
                  Automatic escalations trigger when reports exceed 75% of department SLA window.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REPORT REVIEW QUEUE */}
        {activeTab === 'review_queue' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#762E42]/15 shadow-md">
            <div className="mb-6">
              <h3 className="font-heading font-bold text-lg text-stone-900">
                Inbound Intake & Triage Queue
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Assess citizen submissions for jurisdiction legitimacy, assign responsible department, or request additional site photos.
              </p>
            </div>

            {reviewQueue.length === 0 ? (
              <div className="text-center py-16 text-stone-400 text-xs">
                All inbound tickets have been reviewed and triaged!
              </div>
            ) : (
              <div className="space-y-4">
                {reviewQueue.map((rep) => {
                  const dups = civicStore.checkPossibleDuplicates(rep.categoryId, rep.location.lat, rep.location.lng, rep.title);
                  const hasDups = dups.filter(d => d.id !== rep.id).length > 0;

                  return (
                    <div key={rep.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#762E42]">{rep.reportNumber}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                            {rep.categoryName}
                          </span>
                          <PriorityBadge priority={rep.priority} />
                        </div>
                        <span className="text-xs text-stone-400 font-mono">
                          Submitted {new Date(rep.createdAt).toLocaleString()} by {rep.submittedBy.name}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-base text-stone-900 mb-1">{rep.title}</h4>
                        <p className="text-xs text-stone-600 leading-relaxed bg-white p-3 rounded-xl border border-stone-200">
                          {rep.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
                        <span className="flex items-center gap-1.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#762E42]" />
                          {rep.location.address}
                        </span>
                        {hasDups && (
                          <span className="px-2 py-1 rounded bg-amber-100 text-amber-900 text-[11px] font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            Possible duplicate nearby
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center justify-between pt-3 border-t border-stone-200 gap-2">
                        <button
                          onClick={() => onOpenReportDetail(rep)}
                          className="text-xs font-bold text-stone-600 hover:text-stone-900"
                        >
                          View Full Details &rarr;
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setReviewModalReport(rep);
                              setReviewDecision('request_info');
                            }}
                            className="px-3.5 py-2 rounded-xl bg-cyan-100 text-cyan-900 font-bold text-xs hover:bg-cyan-200 transition cursor-pointer"
                          >
                            Request More Info
                          </button>
                          <button
                            onClick={() => {
                              setReviewModalReport(rep);
                              setReviewDecision('reject');
                            }}
                            className="px-3.5 py-2 rounded-xl bg-rose-100 text-rose-900 font-bold text-xs hover:bg-rose-200 transition cursor-pointer"
                          >
                            Reject Report
                          </button>
                          <button
                            onClick={() => {
                              setAssigningReport(rep);
                            }}
                            className="px-5 py-2 rounded-xl bg-[#762E42] text-white font-bold text-xs hover:bg-[#5f2434] transition flex items-center gap-1.5 shadow-md cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Approve & Dispatch Crew</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ALL REPORTS TABLE */}
        {activeTab === 'all_reports' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#762E42]/15 shadow-md">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by report ID, title, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#762E42]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                {['all', 'submitted', 'under_review', 'assigned', 'in_progress', 'awaiting_verification', 'resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
                      statusFilter === st
                        ? 'bg-[#762E42] text-white shadow-sm'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600 border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-800 uppercase font-mono text-[11px]">
                    <th className="py-3 px-3">Report ID</th>
                    <th className="py-3 px-3">Headline / Title</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Priority</th>
                    <th className="py-3 px-3">Assigned Lead</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orgReports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-stone-50 transition">
                      <td className="py-3 px-3 font-mono font-bold text-[#762E42]">{rep.reportNumber}</td>
                      <td className="py-3 px-3 font-semibold text-stone-900 max-w-xs truncate">{rep.title}</td>
                      <td className="py-3 px-3">{rep.categoryName}</td>
                      <td className="py-3 px-3"><StatusBadge status={rep.status} size="sm" /></td>
                      <td className="py-3 px-3"><PriorityBadge priority={rep.priority} /></td>
                      <td className="py-3 px-3">{rep.assignedStaff?.name || <span className="text-stone-400 italic">Unassigned</span>}</td>
                      <td className="py-3 px-3 font-mono text-stone-400">{new Date(rep.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onOpenReportDetail(rep)}
                          className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-[#762E42] hover:text-white transition font-medium text-[11px]"
                        >
                          Inspect &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: RESOLUTION VERIFICATION */}
        {activeTab === 'verification' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#762E42]/15 shadow-md">
            <div className="mb-6">
              <h3 className="font-heading font-bold text-lg text-stone-900">
                Resolution Sign-off & Photographic Evidence Verification
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Inspect physical repair evidence submitted by field technicians before granting official municipal resolution.
              </p>
            </div>

            {awaitingVerification.length === 0 ? (
              <div className="text-center py-16 text-stone-400 text-xs">
                No tickets currently awaiting verification.
              </div>
            ) : (
              <div className="space-y-6">
                {awaitingVerification.map((rep) => (
                  <div key={rep.id} className="p-6 rounded-2xl border-2 border-amber-300 bg-amber-50/20 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#762E42]">{rep.reportNumber}</span>
                        <h4 className="font-bold text-base text-stone-900 mt-0.5">{rep.title}</h4>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        Field Completion Ready
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-2">
                      <div><strong>Crew Lead:</strong> {rep.assignedStaff?.name}</div>
                      <div><strong>Work Notes:</strong> {rep.workPerformedNotes || 'Repairs completed on site.'}</div>
                      {rep.materialsUsed && <div><strong>Materials Used:</strong> {rep.materialsUsed}</div>}
                    </div>

                    {/* Evidence photos side-by-side */}
                    <div>
                      <h5 className="font-bold text-xs text-stone-700 uppercase tracking-wider mb-2">
                        Submitted Visual Evidence
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {rep.evidence.map((ev) => (
                          <div key={ev.id} className="rounded-xl overflow-hidden border border-stone-300 bg-white shadow-sm">
                            <img src={ev.url} alt={ev.caption} className="w-full h-48 object-cover" />
                            <div className="p-2.5 text-xs">
                              <span className="font-mono uppercase font-bold text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-800">
                                {ev.type.replace('_', ' ')}
                              </span>
                              <p className="mt-1 font-medium text-stone-800">{ev.caption}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                      <button
                        onClick={() => {
                          setVerifyModalReport(rep);
                          handleConfirmVerification(false);
                        }}
                        className="px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                      >
                        Request Rework
                      </button>
                      <button
                        onClick={() => {
                          setVerifyModalReport(rep);
                          handleConfirmVerification(true);
                        }}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Certify Resolved</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PUBLIC ALERTS MANAGEMENT */}
        {activeTab === 'alerts_mgmt' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#762E42]/15 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-heading font-bold text-lg text-stone-900">
                  Municipal Public Alert Broadcasts
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Draft, broadcast, or withdraw official emergency notices displayed to all city residents.
                </p>
              </div>

              <button
                onClick={() => setShowAlertModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#762E42] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#5f2434] transition flex items-center gap-2 cursor-pointer shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Alert Broadcast</span>
              </button>
            </div>

            <div className="space-y-4">
              {alerts.map((alt) => (
                <div key={alt.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={alt.severity} />
                      <span className="font-mono text-xs font-bold text-stone-500">{alt.alertNumber}</span>
                      <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-bold">
                        {alt.publicationStatus}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-stone-900">{alt.title}</h4>
                    <p className="text-xs text-stone-500 line-clamp-1">{alt.affectedArea}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {alt.publicationStatus === 'published' ? (
                      <button
                        onClick={() => civicStore.updateAlertStatus(alt.id, 'withdrawn')}
                        className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold"
                      >
                        Withdraw Broadcast
                      </button>
                    ) : (
                      <button
                        onClick={() => civicStore.updateAlertStatus(alt.id, 'published')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold"
                      >
                        Re-Publish Alert
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: STAFF DIRECTORY */}
        {activeTab === 'staff' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#762E42]/15 shadow-md">
            <h3 className="font-heading font-bold text-lg text-stone-900 mb-4">
              Authorized Field Operations Staff
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fieldStaffMembers.map((staff) => {
                const assignedCount = orgReports.filter(r => r.assignedStaff?.id === staff.id && r.status !== 'closed' && r.status !== 'resolved').length;
                return (
                  <div key={staff.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex items-center gap-3">
                    <img src={staff.avatarUrl} alt={staff.name} className="w-12 h-12 rounded-full object-cover border border-stone-300" />
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">{staff.name}</h4>
                      <p className="text-xs text-stone-500">{staff.departmentName || 'Rapid Response'}</p>
                      <div className="text-[11px] text-[#762E42] font-mono font-bold mt-1">
                        {assignedCount} Active Tasks Assigned
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 7: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#762E42]/15 shadow-md">
            <h3 className="font-heading font-bold text-lg text-stone-900 mb-4">
              Immutable Operations Audit Log
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600 border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-800 uppercase font-mono text-[11px]">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Actor</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Target</th>
                    <th className="py-2.5 px-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                  {civicStore.getState().auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50">
                      <td className="py-2.5 px-3 text-stone-400">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-semibold text-stone-800">{log.actorName}</td>
                      <td className="py-2.5 px-3 text-[#762E42] font-bold">{log.action}</td>
                      <td className="py-2.5 px-3">{log.targetType} #{log.targetId}</td>
                      <td className="py-2.5 px-3 text-stone-600 truncate max-w-sm">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ASSIGNMENT MODAL */}
        {assigningReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-stone-200">
              <button
                onClick={() => setAssigningReport(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-heading font-bold text-xl text-stone-900 mb-1">
                Dispatch Field Crew
              </h3>
              <p className="text-xs text-stone-500 mb-4 font-mono">
                Assigning {assigningReport.reportNumber}: {assigningReport.title}
              </p>

              <form onSubmit={handleConfirmAssignment} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Department</label>
                  <select
                    value={assignDeptId}
                    onChange={(e) => setAssignDeptId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Field Crew Lead</label>
                  <select
                    value={assignStaffId}
                    onChange={(e) => setAssignStaffId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  >
                    {fieldStaffMembers.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.departmentName || 'Field Lead'})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Priority SLA</label>
                  <select
                    value={assignPriority}
                    onChange={(e) => setAssignPriority(e.target.value as PriorityLevel)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Supervisor Task Instructions</label>
                  <textarea
                    rows={3}
                    value={assignInstructions}
                    onChange={(e) => setAssignInstructions(e.target.value)}
                    placeholder="Enter on-site safety precautions, equipment needs, or priority milestones..."
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#762E42] hover:bg-[#5f2434] text-white font-bold text-xs uppercase tracking-wider transition shadow-md cursor-pointer"
                >
                  Confirm & Dispatch Task
                </button>
              </form>
            </div>
          </div>
        )}

        {/* BROADCAST ALERT MODAL */}
        {showAlertModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
            <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-stone-200">
              <button
                onClick={() => setShowAlertModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-heading font-bold text-xl text-stone-900 mb-1">
                Broadcast Official Public Safety Alert
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                This notice will be immediately published to the Public Alert portal and delivered to subscribed citizens.
              </p>

              <form onSubmit={handleCreateAlert} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Alert Headline *</label>
                  <input
                    type="text"
                    required
                    value={alertTitle}
                    onChange={(e) => setAlertTitle(e.target.value)}
                    placeholder="e.g. Flash Flood Precaution & Catch-Basin Watch"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Severity Level</label>
                    <select
                      value={alertSev}
                      onChange={(e) => setAlertSev(e.target.value as AlertSeverity)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900"
                    >
                      <option value="advisory">Advisory</option>
                      <option value="watch">Watch</option>
                      <option value="warning">Warning</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Category</label>
                    <input
                      type="text"
                      value={alertCat}
                      onChange={(e) => setAlertCat(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Affected Area / Corridor *</label>
                  <input
                    type="text"
                    required
                    value={alertArea}
                    onChange={(e) => setAlertArea(e.target.value)}
                    placeholder="e.g. Riverfront Promenade, 1st to 8th Avenues"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Detailed Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={alertDesc}
                    onChange={(e) => setAlertDesc(e.target.value)}
                    placeholder="Provide actionable guidance, hazards, and estimated duration..."
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#762E42] hover:bg-[#5f2434] text-white font-bold text-xs uppercase tracking-wider transition shadow-md cursor-pointer"
                >
                  Authenticate & Broadcast Alert Now
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
