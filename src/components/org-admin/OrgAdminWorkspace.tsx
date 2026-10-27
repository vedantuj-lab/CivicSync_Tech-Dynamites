import React, { useState } from 'react';
import {
  LayoutDashboard,
  Inbox,
  FileSpreadsheet,
  Users,
  Radio,
  FileCheck2,
  FolderTree,
  UserCheck,
  BarChart3,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  MapPin,
  Edit,
  Save
} from 'lucide-react';
import { UserProfile, CivicReport, PublicAlert, Department, IssueCategory, PriorityLevel, AlertSeverity } from '../../types/civic';
import { StatusBadge, PriorityBadge, SeverityBadge } from '../common/Badge';
import { civicStore } from '../../services/store';

interface OrgAdminWorkspaceProps {
  currentUser: UserProfile;
  currentSubpath: string;
  reports: CivicReport[];
  alerts: PublicAlert[];
  departments: Department[];
  categories: IssueCategory[];
  users: UserProfile[];
  onNavigate: (path: string) => void;
  onSignOut: () => void;
  onOpenReportDetail: (report: CivicReport) => void;
}

export const OrgAdminWorkspace: React.FC<OrgAdminWorkspaceProps> = ({
  currentUser,
  currentSubpath,
  reports,
  alerts,
  departments,
  categories,
  users,
  onNavigate,
  onSignOut,
  onOpenReportDetail
}) => {
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Assignment Modal
  const [assigningReport, setAssigningReport] = useState<CivicReport | null>(null);
  const [assignStaffId, setAssignStaffId] = useState(users.find(u => u.role === 'field_staff')?.id || '');
  const [assignDeptId, setAssignDeptId] = useState(departments[0]?.id || '');
  const [assignInstructions, setAssignInstructions] = useState('');
  const [assignPriority, setAssignPriority] = useState<PriorityLevel>('urgent');
  const [assignTargetDate, setAssignTargetDate] = useState('2026-10-28T18:00');

  // Review Modal
  const [reviewReport, setReviewReport] = useState<CivicReport | null>(null);
  const [reviewDecision, setReviewDecision] = useState<'approve' | 'reject' | 'request_info'>('approve');
  const [reviewNotes, setReviewNotes] = useState('');

  // Resolution Verification
  const [verifyReport, setVerifyReport] = useState<CivicReport | null>(null);
  const [verifyNotes, setVerifyNotes] = useState('');

  // Alert Creation / Update State
  const [editingAlert, setEditingAlert] = useState<PublicAlert | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDesc, setAlertDesc] = useState('');
  const [alertCat, setAlertCat] = useState('Severe Weather & Drainage');
  const [alertSev, setAlertSev] = useState<AlertSeverity>('warning');
  const [alertArea, setAlertArea] = useState('Highland Corridor & 4th Street');
  const [alertInst, setAlertInst] = useState('Follow marked detour routes and deploy sandbags if near baseline drainage.');
  const [alertExpiry, setAlertExpiry] = useState('2026-10-29T23:59');

  // Department edit state
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deptName, setDeptName] = useState('');
  const [deptLead, setDeptLead] = useState('');
  const [deptDesc, setDeptDesc] = useState('');

  // Category edit state
  const [editingCat, setEditingCat] = useState<IssueCategory | null>(null);
  const [catName, setCatName] = useState('');
  const [catSLA, setCatSLA] = useState(24);
  const [catDept, setCatDept] = useState('');

  const reviewQueue = reports.filter(r => r.status === 'submitted' || r.status === 'more_info_required');
  const activeWork = reports.filter(r => r.status === 'assigned' || r.status === 'in_progress');
  const awaitingVerification = reports.filter(r => r.status === 'awaiting_verification');
  const resolvedReports = reports.filter(r => r.status === 'resolved' || r.status === 'closed');
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
      alert(`Successfully dispatched ${assigningReport.reportNumber} to selected field lead.`);
      setAssigningReport(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleConfirmReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewReport) return;
    try {
      civicStore.reviewReport(
        reviewReport.id,
        reviewDecision,
        reviewNotes.trim() || 'Reviewed and triaged according to municipal operational guidelines.',
        assignDeptId
      );
      alert(`Report ${reviewReport.reportNumber} review recorded successfully.`);
      setReviewReport(null);
      setReviewNotes('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleConfirmVerification = (approved: boolean) => {
    if (!verifyReport) return;
    try {
      civicStore.verifyResolution(
        verifyReport.id,
        approved,
        verifyNotes.trim() || (approved ? 'Visual evidence meets civic infrastructure specifications.' : 'Rework requested.')
      );
      alert(`Resolution verification ${approved ? 'APPROVED' : 'RETURNED FOR REWORK'}.`);
      setVerifyReport(null);
      setVerifyNotes('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAlert) {
        civicStore.updateAlert(editingAlert.id, {
          title: alertTitle,
          description: alertDesc,
          category: alertCat,
          severity: alertSev,
          affectedArea: alertArea,
          instructions: alertInst.split('\n').filter(Boolean),
          expiresAt: alertExpiry ? new Date(alertExpiry).toISOString() : undefined
        });
        alert(`Alert ${editingAlert.alertNumber} updated successfully!`);
        setEditingAlert(null);
      } else {
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
      }
      setShowAlertModal(false);
      setAlertTitle('');
      setAlertDesc('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    try {
      civicStore.updateDepartment(editingDept.id, {
        name: deptName,
        contactLead: deptLead,
        description: deptDesc
      });
      alert(`Department "${deptName}" updated successfully.`);
      setEditingDept(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;
    try {
      civicStore.updateCategory(editingCat.id, {
        name: catName,
        slaHours: Number(catSLA),
        defaultDepartmentName: catDept
      });
      alert(`Category "${catName}" updated successfully.`);
      setEditingCat(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const NAV_ITEMS = [
    { path: '/organization-admin/dashboard', label: 'Command Center', icon: LayoutDashboard },
    { path: '/organization-admin/review', label: `Review Queue (${reviewQueue.length})`, icon: Inbox },
    { path: '/organization-admin/reports', label: `All Reports (${reports.length})`, icon: FileSpreadsheet },
    { path: '/organization-admin/assignments', label: 'Assignment Management', icon: Users },
    { path: '/organization-admin/alerts', label: `Public Alerts (${alerts.length})`, icon: Radio },
    { path: '/organization-admin/verification', label: `Verification (${awaitingVerification.length})`, icon: FileCheck2 },
    { path: '/organization-admin/departments', label: 'Departments & Categories', icon: FolderTree },
    { path: '/organization-admin/staff', label: 'Staff Directory', icon: UserCheck },
    { path: '/organization-admin/analytics', label: 'Operational Analytics', icon: BarChart3 },
    { path: '/organization-admin/audit', label: 'Audit History', icon: History },
    { path: '/organization-admin/settings', label: 'Organization Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#F8F0EA] text-[#34262B] flex flex-col font-sans">
      {/* Top Header: Deep Burgundy */}
      <header className="sticky top-0 z-40 bg-[#762E42] text-white h-16 px-4 sm:px-6 flex items-center justify-between border-b border-[#762E42]/40 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebar(!mobileSidebar)}
            className="md:hidden p-2 text-white hover:bg-[#5f2434] rounded-lg"
          >
            {mobileSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => onNavigate('/organization-admin/dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#E9A7B2] text-[#762E42] font-black text-base flex items-center justify-center shadow-sm">
              CS
            </div>
            <div>
              <span className="font-heading font-extrabold text-base text-white tracking-tight flex items-center gap-2">
                CivicSync
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#E9A7B2]/20 text-[#E9A7B2] font-bold">
                  Operations Desk
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingAlert(null);
              setAlertTitle('');
              setAlertDesc('');
              setShowAlertModal(true);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#D8B36A] hover:bg-[#c49f57] text-[#34262B] font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Alert</span>
          </button>

          <button
            onClick={onSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/20 hover:bg-black/30 text-rose-200 border border-rose-300/30 text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <aside
          className={`fixed md:sticky top-16 z-30 w-64 h-[calc(100vh-4rem)] bg-white border-r border-[#762E42]/15 p-4 flex flex-col justify-between transition-transform duration-200 ${
            mobileSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono uppercase text-stone-400 font-bold tracking-wider">
              Operations Navigation
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentSubpath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate(item.path);
                    setMobileSidebar(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#762E42] text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-[11px] text-stone-500 font-mono space-y-1">
            <div>Metro Public Works</div>
            <div className="text-[#762E42] text-[10px] font-bold">Operational Command Active</div>
          </div>
        </aside>

        {/* Feature Render View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* 1. COMMAND CENTER DASHBOARD OVERVIEW */}
          {currentSubpath === '/organization-admin/dashboard' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#762E42] via-[#652436] to-[#4F1A28] rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs font-mono uppercase text-[#E9A7B2] font-bold">Command Center</span>
                  <h1 className="font-heading text-2xl sm:text-3xl font-extrabold mt-1">
                    {currentUser.name}
                  </h1>
                  <p className="text-rose-100/90 text-xs mt-1">
                    {currentUser.organizationName} &bull; Triage Desk &amp; Field Dispatch Authority
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingAlert(null);
                      setShowAlertModal(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#D8B36A] hover:bg-[#c49f57] text-[#34262B] font-bold text-xs uppercase tracking-wider transition shadow-md cursor-pointer"
                  >
                    Broadcast Alert
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition cursor-pointer"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Counters */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#762E42]/15 shadow-sm">
                  <span className="text-xs font-mono uppercase text-stone-500 font-bold">Total Inbound</span>
                  <div className="font-mono text-3xl font-extrabold text-[#762E42] mt-1">{reports.length}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-sm">
                  <span className="text-xs font-mono uppercase text-purple-700 font-bold">Review Queue</span>
                  <div className="font-mono text-3xl font-extrabold text-purple-800 mt-1">{reviewQueue.length}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-orange-200 shadow-sm">
                  <span className="text-xs font-mono uppercase text-orange-700 font-bold">Field Active</span>
                  <div className="font-mono text-3xl font-extrabold text-orange-700 mt-1">{activeWork.length}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-yellow-200 shadow-sm">
                  <span className="text-xs font-mono uppercase text-amber-700 font-bold">Awaiting Sign-off</span>
                  <div className="font-mono text-3xl font-extrabold text-amber-800 mt-1">{awaitingVerification.length}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm">
                  <span className="text-xs font-mono uppercase text-emerald-700 font-bold">Resolved &amp; Closed</span>
                  <div className="font-mono text-3xl font-extrabold text-emerald-700 mt-1">{resolvedReports.length}</div>
                </div>
              </div>
            </div>
          )}

          {/* 2. REPORT REVIEW QUEUE (Burgundy + Rose) */}
          {currentSubpath === '/organization-admin/review' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#762E42]/15 shadow-md space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-stone-200">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-stone-900">Inbound Report Review Queue</h1>
                  <p className="text-xs text-stone-500">Triage incoming community reports, check duplicates, and approve for dispatch.</p>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                  {reviewQueue.length} Pending Review
                </span>
              </div>

              {reviewQueue.length === 0 ? (
                <div className="text-center py-16 text-stone-400 text-xs">Review queue is empty.</div>
              ) : (
                <div className="space-y-4">
                  {reviewQueue.map((rep) => {
                    const dups = civicStore.checkPossibleDuplicates(rep.categoryId, rep.location.lat, rep.location.lng, rep.title);
                    const hasDups = dups.filter(d => d.id !== rep.id).length > 0;

                    return (
                      <div key={rep.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#762E42]">{rep.reportNumber}</span>
                            <StatusBadge status={rep.status} size="sm" />
                            <PriorityBadge priority={rep.priority} />
                          </div>
                          <span className="text-xs text-stone-400 font-mono">{new Date(rep.createdAt).toLocaleDateString()}</span>
                        </div>

                        <h4 className="font-bold text-base text-stone-900">{rep.title}</h4>
                        <p className="text-xs text-stone-600 bg-white p-3 rounded-xl border border-stone-200">{rep.description}</p>

                        <div className="flex items-center gap-2 text-xs text-stone-600">
                          <MapPin className="w-3.5 h-3.5 text-[#762E42]" />
                          <span>{rep.location.address} ({rep.location.district})</span>
                          {hasDups && (
                            <span className="ml-auto px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                              Nearby duplicate detected
                            </span>
                          )}
                        </div>

                        <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
                          <button
                            onClick={() => {
                              setReviewReport(rep);
                              setReviewDecision('request_info');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-cyan-100 text-cyan-900 font-bold text-xs hover:bg-cyan-200"
                          >
                            Request More Info
                          </button>
                          <button
                            onClick={() => {
                              setReviewReport(rep);
                              setReviewDecision('reject');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-900 font-bold text-xs hover:bg-rose-200"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => setAssigningReport(rep)}
                            className="px-4 py-1.5 rounded-lg bg-[#762E42] text-white font-bold text-xs hover:bg-[#5f2434]"
                          >
                            Approve &amp; Dispatch Crew
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 3. ALL REPORTS MANAGEMENT (Burgundy + Sand) */}
          {currentSubpath === '/organization-admin/reports' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#762E42]/15 shadow-md space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-stone-200">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-stone-900">All Organization Reports</h1>
                  <p className="text-xs text-stone-500">Filter, search, inspect dossiers, and export municipal records.</p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-[#762E42] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600 border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-800 uppercase font-mono text-[11px]">
                      <th className="py-2.5 px-3">Report ID</th>
                      <th className="py-2.5 px-3">Title</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Priority</th>
                      <th className="py-2.5 px-3">Assigned Lead</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {reports.map((rep) => (
                      <tr key={rep.id} className="hover:bg-stone-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#762E42]">{rep.reportNumber}</td>
                        <td className="py-2.5 px-3 font-bold text-stone-900">{rep.title}</td>
                        <td className="py-2.5 px-3"><StatusBadge status={rep.status} size="sm" /></td>
                        <td className="py-2.5 px-3"><PriorityBadge priority={rep.priority} /></td>
                        <td className="py-2.5 px-3">{rep.assignedStaff?.name || 'Unassigned'}</td>
                        <td className="py-2.5 px-3 font-mono text-stone-400">{new Date(rep.createdAt).toLocaleDateString()}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => setAssigningReport(rep)}
                            className="px-2.5 py-1 rounded bg-stone-100 hover:bg-[#762E42] hover:text-white font-bold text-[10px]"
                          >
                            Reassign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. ASSIGNMENT MANAGEMENT (Graphite + Orange) */}
          {currentSubpath === '/organization-admin/assignments' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-300 shadow-md space-y-6">
              <h1 className="font-heading text-2xl font-bold text-stone-900">Assignment Management</h1>
              <p className="text-xs text-stone-500">Dispatch field response crew leads to tickets with target SLA dates.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.filter(r => r.status !== 'resolved' && r.status !== 'closed').map((rep) => (
                  <div key={rep.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#762E42]">{rep.reportNumber}</span>
                        <StatusBadge status={rep.status} size="sm" />
                      </div>
                      <h4 className="font-bold text-sm text-stone-900">{rep.title}</h4>
                      <p className="text-xs text-stone-500">Currently: {rep.assignedStaff?.name || 'Unassigned'}</p>
                    </div>
                    <button
                      onClick={() => setAssigningReport(rep)}
                      className="px-3.5 py-2 rounded-xl bg-[#F28C45] text-stone-950 font-bold text-xs hover:bg-[#d97532] shadow-sm cursor-pointer"
                    >
                      Assign Crew
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. PUBLIC ALERT MANAGEMENT (Coral + Marigold) - WITH UPDATE/EDIT CAPABILITY! */}
          {currentSubpath === '/organization-admin/alerts' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-md space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-stone-200">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-stone-900">Public Alert Management</h1>
                  <p className="text-xs text-stone-500">Draft, edit, update, publish, or withdraw municipal emergency advisories.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingAlert(null);
                    setAlertTitle('');
                    setAlertDesc('');
                    setShowAlertModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#F28C45] text-stone-950 font-bold text-xs uppercase tracking-wider hover:bg-[#d97532] shadow-sm"
                >
                  Create &amp; Broadcast Alert
                </button>
              </div>

              <div className="space-y-4">
                {alerts.map((alt) => (
                  <div key={alt.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <SeverityBadge severity={alt.severity} />
                        <span className="font-mono text-xs font-bold text-stone-500">{alt.alertNumber}</span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-stone-200 font-bold">
                          {alt.publicationStatus}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-stone-900">{alt.title}</h4>
                      <p className="text-xs text-stone-600 line-clamp-1">{alt.description}</p>
                      <p className="text-[11px] text-stone-400 font-mono mt-1">Area: {alt.affectedArea}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingAlert(alt);
                          setAlertTitle(alt.title);
                          setAlertDesc(alt.description);
                          setAlertCat(alt.category);
                          setAlertSev(alt.severity);
                          setAlertArea(alt.affectedArea);
                          setAlertInst(alt.instructions.join('\n'));
                          setShowAlertModal(true);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Alert</span>
                      </button>

                      {alt.publicationStatus === 'published' ? (
                        <button
                          onClick={() => civicStore.updateAlertStatus(alt.id, 'withdrawn')}
                          className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold"
                        >
                          Withdraw
                        </button>
                      ) : (
                        <button
                          onClick={() => civicStore.updateAlertStatus(alt.id, 'published')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold"
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. RESOLUTION VERIFICATION (Green + Sand) */}
          {currentSubpath === '/organization-admin/verification' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-md space-y-6">
              <h1 className="font-heading text-2xl font-bold text-stone-900">Resolution Verification Sign-off</h1>
              <p className="text-xs text-stone-500">Inspect photographic evidence submitted by field crews before officially certifying closure.</p>

              {awaitingVerification.length === 0 ? (
                <div className="text-center py-16 text-stone-400 text-xs">No reports currently awaiting verification sign-off.</div>
              ) : (
                <div className="space-y-6">
                  {awaitingVerification.map((rep) => (
                    <div key={rep.id} className="p-6 rounded-2xl border-2 border-amber-300 bg-amber-50/20 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-mono text-xs font-bold text-[#762E42]">{rep.reportNumber}</span>
                          <h4 className="font-bold text-base text-stone-900">{rep.title}</h4>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          Awaiting Supervisor Sign-off
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-stone-200 text-xs space-y-1">
                        <div><strong>Crew Lead:</strong> {rep.assignedStaff?.name}</div>
                        <div><strong>Work Done:</strong> {rep.workPerformedNotes}</div>
                        <div><strong>Materials:</strong> {rep.materialsUsed || 'Standard bitumen mix'}</div>
                      </div>

                      {/* Evidence photos */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {rep.evidence.map((ev) => (
                          <div key={ev.id} className="rounded-xl overflow-hidden border border-stone-200 bg-white shadow-sm">
                            <img src={ev.url} alt={ev.caption} className="w-full h-44 object-cover" />
                            <div className="p-2 text-xs">
                              <span className="font-mono font-bold uppercase text-[10px] bg-stone-100 px-1.5 py-0.5 rounded">
                                {ev.type.replace('_', ' ')}
                              </span>
                              <p className="mt-1 font-medium text-stone-800">{ev.caption}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          onClick={() => {
                            setVerifyReport(rep);
                            handleConfirmVerification(false);
                          }}
                          className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold"
                        >
                          Request Rework
                        </button>
                        <button
                          onClick={() => {
                            setVerifyReport(rep);
                            handleConfirmVerification(true);
                          }}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider"
                        >
                          Approve Resolution
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 7. DEPARTMENTS & CATEGORIES (Sage + Burgundy) - WITH UPDATE CAPABILITY! */}
          {currentSubpath === '/organization-admin/departments' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-8">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h1 className="font-heading text-2xl font-bold text-stone-900">Municipal Departments</h1>
                  <span className="text-xs text-stone-400 font-mono">Total: {departments.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {departments.map((dept) => (
                    <div key={dept.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{dept.name}</h4>
                        <p className="text-xs text-stone-600 mt-0.5">{dept.description}</p>
                        <div className="text-[11px] font-mono text-[#762E42] font-bold mt-2">
                          Lead: {dept.contactLead} &bull; {dept.staffCount} Staff
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setEditingDept(dept);
                          setDeptName(dept.name);
                          setDeptLead(dept.contactLead);
                          setDeptDesc(dept.description);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-stone-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-heading text-xl font-bold text-stone-900">Issue Categories &amp; SLA Hours</h2>
                  <span className="text-xs text-stone-400 font-mono">Total: {categories.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <div key={cat.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-stone-900">{cat.name}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                            {cat.slaHours}h Target
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-1">{cat.description}</p>
                        <div className="text-[11px] font-mono text-stone-500 mt-2">
                          Default: {cat.defaultDepartmentName}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setEditingCat(cat);
                          setCatName(cat.name);
                          setCatSLA(cat.slaHours);
                          setCatDept(cat.defaultDepartmentName);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 8. STAFF DIRECTORY (Purple + Silver) */}
          {currentSubpath === '/organization-admin/staff' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-md space-y-6">
              <h1 className="font-heading text-2xl font-bold text-stone-900">Staff Directory &amp; Active Workloads</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fieldStaffMembers.map((staff) => {
                  const tasks = reports.filter(r => r.assignedStaff?.id === staff.id && r.status !== 'closed' && r.status !== 'resolved');
                  return (
                    <div key={staff.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between">
                      <div className="flex items-center gap-3 mb-3">
                        <img src={staff.avatarUrl} alt={staff.name} className="w-12 h-12 rounded-full object-cover border" />
                        <div>
                          <h4 className="font-bold text-sm text-stone-900">{staff.name}</h4>
                          <span className="text-xs text-stone-500">{staff.departmentName || 'Rapid Response'}</span>
                        </div>
                      </div>
                      <div className="text-xs font-mono font-bold text-[#762E42]">
                        {tasks.length} Active Work Orders Assigned
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 9. OPERATIONAL ANALYTICS (Plum + Gold) */}
          {currentSubpath === '/organization-admin/analytics' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-stone-200">
                <h1 className="font-heading text-2xl font-bold text-stone-900">Operational Analytics &amp; Trends</h1>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-[#D8B36A] text-stone-950 font-bold text-xs uppercase"
                >
                  Export Metrics
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <h3 className="font-bold text-sm text-stone-900">Reports by Category</h3>
                  {categories.map((c) => {
                    const cnt = reports.filter(r => r.categoryId === c.id).length;
                    return (
                      <div key={c.id} className="text-xs flex justify-between items-center">
                        <span className="text-stone-700">{c.name}</span>
                        <span className="font-mono font-bold text-[#762E42]">{cnt}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <h3 className="font-bold text-sm text-stone-900">Status Distribution</h3>
                  {['submitted', 'under_review', 'assigned', 'in_progress', 'awaiting_verification', 'resolved'].map((s) => {
                    const cnt = reports.filter(r => r.status === s).length;
                    return (
                      <div key={s} className="text-xs flex justify-between items-center capitalize">
                        <span className="text-stone-700">{s.replace('_', ' ')}</span>
                        <span className="font-mono font-bold text-emerald-700">{cnt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 10. AUDIT HISTORY (Slate + Copper) */}
          {currentSubpath === '/organization-admin/audit' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-4">
              <h1 className="font-heading text-2xl font-bold text-stone-900">Organization Audit History</h1>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600 border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 uppercase font-mono text-[11px] text-stone-800">
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Actor</th>
                      <th className="py-2.5 px-3">Action</th>
                      <th className="py-2.5 px-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                    {civicStore.getState().auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50">
                        <td className="py-2.5 px-3 text-stone-400">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="py-2.5 px-3 font-bold text-stone-900">{log.actorName}</td>
                        <td className="py-2.5 px-3 font-bold text-[#762E42]">{log.action}</td>
                        <td className="py-2.5 px-3 text-stone-600">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 11. SETTINGS (Burgundy + Beige) */}
          {currentSubpath === '/organization-admin/settings' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md max-w-2xl space-y-4 text-xs">
              <h1 className="font-heading text-2xl font-bold text-stone-900">Organization Settings</h1>
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Organization Name</label>
                <input type="text" readOnly value={currentUser.organizationName} className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50" />
              </div>
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Administrator Lead</label>
                <input type="text" readOnly value={currentUser.name} className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50" />
              </div>
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Service Corridor</label>
                <input type="text" readOnly value="Greater Metropolitan Sector (Districts 1-6)" className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50" />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ASSIGNMENT MODAL */}
      {assigningReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-stone-200">
            <button onClick={() => setAssigningReport(null)} className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading font-bold text-xl text-stone-900 mb-1">Dispatch Field Crew</h3>
            <p className="text-xs text-stone-500 mb-4 font-mono">{assigningReport.reportNumber}: {assigningReport.title}</p>
            <form onSubmit={handleConfirmAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Department</label>
                <select value={assignDeptId} onChange={(e) => setAssignDeptId(e.target.value)} className="w-full p-2.5 rounded-xl border border-stone-300">
                  {departments.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Field Crew Lead</label>
                <select value={assignStaffId} onChange={(e) => setAssignStaffId(e.target.value)} className="w-full p-2.5 rounded-xl border border-stone-300">
                  {fieldStaffMembers.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Priority</label>
                <select value={assignPriority} onChange={(e) => setAssignPriority(e.target.value as PriorityLevel)} className="w-full p-2.5 rounded-xl border border-stone-300">
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Task Instructions</label>
                <textarea rows={3} value={assignInstructions} onChange={(e) => setAssignInstructions(e.target.value)} placeholder="Safety directives..." className="w-full p-2.5 rounded-xl border border-stone-300" />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-[#762E42] text-white font-bold uppercase tracking-wider">Confirm Dispatch</button>
            </form>
          </div>
        </div>
      )}

      {/* ALERT MODAL (CREATE OR UPDATE) */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-stone-200 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAlertModal(false)} className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading font-bold text-xl text-stone-900 mb-1">
              {editingAlert ? `Update Alert (${editingAlert.alertNumber})` : 'Broadcast Official Public Alert'}
            </h3>
            <form onSubmit={handleSaveAlert} className="space-y-4 text-xs mt-4">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Headline *</label>
                <input type="text" required value={alertTitle} onChange={(e) => setAlertTitle(e.target.value)} className="w-full p-2.5 rounded-xl border border-stone-300" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Severity</label>
                  <select value={alertSev} onChange={(e) => setAlertSev(e.target.value as AlertSeverity)} className="w-full p-2.5 rounded-xl border border-stone-300">
                    <option value="advisory">Advisory</option><option value="watch">Watch</option><option value="warning">Warning</option><option value="emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Category</label>
                  <input type="text" value={alertCat} onChange={(e) => setAlertCat(e.target.value)} className="w-full p-2.5 rounded-xl border border-stone-300" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Affected Area Corridor *</label>
                <input type="text" required value={alertArea} onChange={(e) => setAlertArea(e.target.value)} className="w-full p-2.5 rounded-xl border border-stone-300" />
              </div>
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Directive Details *</label>
                <textarea rows={3} required value={alertDesc} onChange={(e) => setAlertDesc(e.target.value)} className="w-full p-2.5 rounded-xl border border-stone-300" />
              </div>
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Action Instructions (One per line)</label>
                <textarea rows={3} value={alertInst} onChange={(e) => setAlertInst(e.target.value)} className="w-full p-2.5 rounded-xl border border-stone-300" />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-[#F28C45] text-stone-950 font-bold uppercase tracking-wider">
                {editingAlert ? 'Save & Update Alert' : 'Publish Alert to Public Grid'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DEPARTMENT EDIT MODAL */}
      {editingDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative border border-stone-200">
            <button onClick={() => setEditingDept(null)} className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading font-bold text-lg text-stone-900 mb-3">Update Department</h3>
            <form onSubmit={handleSaveDepartment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Department Name</label>
                <input type="text" required value={deptName} onChange={(e) => setDeptName(e.target.value)} className="w-full p-2.5 rounded-xl border border-stone-300" />
              </div>
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Contact Lead</label>
                <input type="text" required value={deptLead} onChange={(e) => setDeptLead(e.target.value)} className="w-full p-2.5 rounded-xl border border-stone-300" />
              </div>
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Description</label>
                <textarea rows={3} value={deptDesc} onChange={(e) => setDeptDesc(e.target.value)} className="w-full p-2.5 rounded-xl border border-stone-300" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-[#762E42] text-white font-bold uppercase tracking-wider">
                Save Department
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY EDIT MODAL */}
      {editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative border border-stone-200">
            <button onClick={() => setEditingCat(null)} className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading font-bold text-lg text-stone-900 mb-3">Update Category &amp; SLA</h3>
            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Category Name</label>
                <input type="text" required value={catName} onChange={(e) => setCatName(e.target.value)} className="w-full p-2.5 rounded-xl border border-stone-300" />
              </div>
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Target SLA (Hours)</label>
                <input type="number" required value={catSLA} onChange={(e) => setCatSLA(Number(e.target.value))} className="w-full p-2.5 rounded-xl border border-stone-300" />
              </div>
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Default Routing Department</label>
                <input type="text" required value={catDept} onChange={(e) => setCatDept(e.target.value)} className="w-full p-2.5 rounded-xl border border-stone-300" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-[#762E42] text-white font-bold uppercase tracking-wider">
                Save Category &amp; SLA
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
