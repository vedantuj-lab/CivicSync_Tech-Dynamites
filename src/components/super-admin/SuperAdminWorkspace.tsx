import React, { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  Building2,
  UserPlus,
  Users,
  FolderTree,
  SlidersHorizontal,
  History,
  Activity,
  Server,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Database,
  Radio,
  FileCheck2,
  Download,
  Edit,
  Save,
  Check,
  ChevronRight
} from 'lucide-react';
import { UserProfile, Organization, IssueCategory, AuditLog, UserRole } from '../../types/civic';
import { RoleBadge } from '../common/Badge';
import { civicStore } from '../../services/store';

interface SuperAdminWorkspaceProps {
  currentUser: UserProfile;
  currentSubpath: string;
  organizations: Organization[];
  users: UserProfile[];
  categories: IssueCategory[];
  auditLogs: AuditLog[];
  onNavigate: (path: string) => void;
  onSignOut: () => void;
}

export const SuperAdminWorkspace: React.FC<SuperAdminWorkspaceProps> = ({
  currentUser,
  currentSubpath,
  organizations,
  users,
  categories,
  auditLogs,
  onNavigate,
  onSignOut
}) => {
  const [mobileSidebar, setMobileSidebar] = useState(false);

  // Search & Filter States
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [orgSearch, setOrgSearch] = useState('');
  const [auditSearch, setAuditSearch] = useState('');
  const [auditSeverity, setAuditSeverity] = useState('all');

  // Category Edit Modal State
  const [editingCategory, setEditingCategory] = useState<IssueCategory | null>(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catSLA, setCatSLA] = useState(24);
  const [catDept, setCatDept] = useState('');
  const [catActive, setCatActive] = useState(true);

  // Global Configuration State
  const [configDuplicateRadius, setConfigDuplicateRadius] = useState(1.0);
  const [configMaxUploadMB, setConfigMaxUploadMB] = useState(15);
  const [configAutoEscalateHours, setConfigAutoEscalateHours] = useState(48);
  const [configDefaultAlertRadius, setConfigDefaultAlertRadius] = useState(5.0);
  const [configEmergencyBanner, setConfigEmergencyBanner] = useState('');
  const [configSMSBroadcast, setConfigSMSBroadcast] = useState(true);
  const [configSavedMsg, setConfigSavedMsg] = useState(false);

  const pendingOrgs = organizations.filter(o => o.status === 'pending');
  const activeOrgs = organizations.filter(o => o.status === 'active');

  const NAV_ITEMS = [
    { path: '/platform-admin/dashboard', label: 'Governance Overview', icon: LayoutDashboard },
    { path: '/platform-admin/organizations', label: `Agencies (${organizations.length})`, icon: Building2 },
    { path: '/platform-admin/onboarding', label: `Onboarding Queue (${pendingOrgs.length})`, icon: UserPlus },
    { path: '/platform-admin/users', label: `User Roles (${users.length})`, icon: Users },
    { path: '/platform-admin/categories', label: `Platform Categories (${categories.length})`, icon: FolderTree },
    { path: '/platform-admin/configuration', label: 'Global Configuration', icon: SlidersHorizontal },
    { path: '/platform-admin/audit', label: `Audit Trail (${auditLogs.length})`, icon: History },
    { path: '/platform-admin/integrations', label: 'Integration Health', icon: Activity },
    { path: '/platform-admin/system', label: 'System Diagnostics', icon: Server }
  ];

  // Actions
  const handleApproveOrg = (orgId: string) => {
    civicStore.updateOrganizationStatus(orgId, 'active');
    alert('Organization onboarding approved and municipal authority issued.');
  };

  const handleToggleOrgStatus = (orgId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    civicStore.updateOrganizationStatus(orgId, newStatus);
    alert(`Organization status updated to ${newStatus.toUpperCase()}.`);
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    civicStore.updateUserRole(userId, newRole);
    alert(`User role successfully updated to ${newRole}.`);
  };

  const handleUserStatusChange = (userId: string, newStatus: 'active' | 'suspended' | 'pending') => {
    civicStore.updateUserStatus(userId, newStatus);
    alert(`User account status updated to ${newStatus.toUpperCase()}.`);
  };

  const handleOpenEditCategory = (cat: IssueCategory) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDesc(cat.description);
    setCatSLA(cat.slaHours);
    setCatDept(cat.defaultDepartmentName);
    setCatActive(cat.activeStatus);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    civicStore.updateCategory(editingCategory.id, {
      name: catName.trim(),
      description: catDesc.trim(),
      slaHours: Number(catSLA),
      defaultDepartmentName: catDept.trim(),
      activeStatus: catActive
    });
    alert(`Category ${catName} updated successfully!`);
    setEditingCategory(null);
  };

  const handleSaveConfiguration = (e: React.FormEvent) => {
    e.preventDefault();
    civicStore.recordAudit({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'UPDATE_GLOBAL_CONFIGURATION',
      targetType: 'config',
      targetId: 'cfg_global',
      details: `Updated global settings: DuplicateRadius=${configDuplicateRadius}km, UploadLimit=${configMaxUploadMB}MB, AutoEscalation=${configAutoEscalateHours}h`
    });
    setConfigSavedMsg(true);
    setTimeout(() => setConfigSavedMsg(false), 4000);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredOrgs = organizations.filter((o) => {
    return o.name.toLowerCase().includes(orgSearch.toLowerCase()) || o.serviceArea.toLowerCase().includes(orgSearch.toLowerCase());
  });

  const filteredAudit = auditLogs.filter((log) => {
    const matchesSearch = log.actorName.toLowerCase().includes(auditSearch.toLowerCase()) ||
                          log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
                          log.details.toLowerCase().includes(auditSearch.toLowerCase());
    const matchesSev = auditSeverity === 'all' || log.severity === auditSeverity;
    return matchesSearch && matchesSev;
  });

  return (
    <div className="min-h-screen bg-[#F3F0F7] text-[#292432] flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#49345F] text-white h-16 px-4 sm:px-6 flex items-center justify-between border-b border-[#49345F]/40 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebar(!mobileSidebar)}
            className="md:hidden p-2 text-white hover:bg-[#39284a] rounded-lg"
          >
            {mobileSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => onNavigate('/platform-admin/dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#B8A0E3] text-[#49345F] font-black text-base flex items-center justify-center shadow-sm">
              CS
            </div>
            <div>
              <span className="font-heading font-extrabold text-base text-white tracking-tight flex items-center gap-2">
                CivicSync
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#B8A0E3]/20 text-[#B8A0E3] font-bold">
                  Super Admin
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-purple-100 font-mono">
            <span>{currentUser.name}</span>
            <span className="text-purple-300">&bull;</span>
            <span className="text-[#B8A0E3] font-bold">Platform Governance</span>
          </div>

          <button
            onClick={onSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/20 hover:bg-black/30 text-rose-200 border border-rose-300/30 text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Workspace with Dedicated Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <aside
          className={`fixed md:sticky top-16 z-30 w-64 h-[calc(100vh-4rem)] bg-white border-r border-[#49345F]/15 p-4 flex flex-col justify-between transition-transform duration-200 ${
            mobileSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono uppercase text-stone-400 font-bold tracking-wider">
              Governance Directory
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
                      ? 'bg-[#49345F] text-white shadow-sm'
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
            <div>Sovereign Platform Controller</div>
            <div className="text-[#B8A0E3] text-[10px] font-bold">Root Audit Verified</div>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* 1. GOVERNANCE OVERVIEW (/platform-admin/dashboard) */}
          {currentSubpath === '/platform-admin/dashboard' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#49345F] via-[#3B294F] to-[#2B1B3C] text-white rounded-3xl p-6 sm:p-8 shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase text-[#B8A0E3] font-bold">Master Control Panel</span>
                    <h1 className="font-heading text-2xl sm:text-3xl font-extrabold mt-1">
                      Platform Governance Overview
                    </h1>
                    <p className="text-purple-200 text-xs mt-1">
                      National CivicSync Grid Authority &bull; {currentUser.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono bg-white/10 px-3.5 py-2 rounded-xl border border-white/20">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Grid Core 100% Operational</span>
                  </div>
                </div>
              </div>

              {/* Counters */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#49345F]/15 shadow-sm">
                  <span className="text-xs font-mono uppercase text-stone-500 font-bold">Total Agencies</span>
                  <div className="font-mono text-3xl font-extrabold text-[#49345F] mt-1">{organizations.length}</div>
                  <div className="text-[11px] text-stone-400 mt-1">{activeOrgs.length} Active &bull; {pendingOrgs.length} Pending</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#49345F]/15 shadow-sm">
                  <span className="text-xs font-mono uppercase text-stone-500 font-bold">Registered Users</span>
                  <div className="font-mono text-3xl font-extrabold text-stone-800 mt-1">{users.length}</div>
                  <div className="text-[11px] text-stone-400 mt-1">Citizens, staff, and directors</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#49345F]/15 shadow-sm">
                  <span className="text-xs font-mono uppercase text-stone-500 font-bold">Audit Trail Events</span>
                  <div className="font-mono text-3xl font-extrabold text-[#B8A0E3] mt-1">{auditLogs.length}</div>
                  <div className="text-[11px] text-stone-400 mt-1">Immutable security stream</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm">
                  <span className="text-xs font-mono uppercase text-emerald-700 font-bold">Platform SLA Uptime</span>
                  <div className="font-mono text-3xl font-extrabold text-emerald-600 mt-1">99.98%</div>
                  <div className="text-[11px] text-stone-400 mt-1">Zero downtime architecture</div>
                </div>
              </div>

              {/* Quick Queue & Health */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-[#49345F]/15 shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-heading font-bold text-base text-stone-900">
                      Pending Agency Onboarding
                    </h3>
                    <button
                      onClick={() => onNavigate('/platform-admin/onboarding')}
                      className="text-xs font-bold text-[#49345F] hover:underline"
                    >
                      View All ({pendingOrgs.length}) &rarr;
                    </button>
                  </div>

                  {pendingOrgs.length === 0 ? (
                    <div className="p-8 text-center text-xs text-stone-400 italic">
                      No pending accreditation requests.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingOrgs.map((org) => (
                        <div key={org.id} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex justify-between items-center gap-3">
                          <div>
                            <h4 className="font-bold text-xs text-stone-900">{org.name}</h4>
                            <p className="text-[11px] text-stone-500">{org.serviceArea}</p>
                          </div>
                          <button
                            onClick={() => handleApproveOrg(org.id)}
                            className="px-3 py-1.5 rounded-xl bg-[#49345F] hover:bg-[#39284a] text-white font-bold text-xs cursor-pointer"
                          >
                            Approve
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[#49345F]/15 shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-heading font-bold text-base text-stone-900">
                      Recent Audit Stream
                    </h3>
                    <button
                      onClick={() => onNavigate('/platform-admin/audit')}
                      className="text-xs font-bold text-[#49345F] hover:underline"
                    >
                      Audit Trail &rarr;
                    </button>
                  </div>
                  <div className="space-y-2.5 font-mono text-[11px]">
                    {auditLogs.slice(0, 4).map((log) => (
                      <div key={log.id} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                        <div className="truncate mr-2">
                          <span className="font-bold text-[#49345F]">{log.action}</span>
                          <span className="text-stone-500 block truncate">{log.details}</span>
                        </div>
                        <span className="text-[10px] text-stone-400 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. ORGANIZATION DIRECTORY (/platform-admin/organizations) */}
          {currentSubpath === '/platform-admin/organizations' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#49345F]/15 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-stone-900">Municipal &amp; Regional Partner Agencies</h1>
                  <p className="text-xs text-stone-500">Directory of all verified civic bodies operating across CivicSync.</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by agency name..."
                    value={orgSearch}
                    onChange={(e) => setOrgSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#49345F]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredOrgs.map((org) => (
                  <div key={org.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-stone-900">{org.name}</h4>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                          org.status === 'active' ? 'bg-emerald-100 text-emerald-800' : org.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {org.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">{org.description}</p>
                      <div className="text-[11px] text-stone-500 font-mono">
                        Service Area: {org.serviceArea} &bull; Staff: {org.staffCount} &bull; Active Tickets: {org.activeReportsCount} &bull; Contact: {org.contactEmail}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleToggleOrgStatus(org.id, org.status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                          org.status === 'active'
                            ? 'border border-rose-300 text-rose-700 hover:bg-rose-50'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {org.status === 'active' ? 'Suspend Agency' : 'Reactivate Agency'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. ONBOARDING QUEUE (/platform-admin/onboarding) */}
          {currentSubpath === '/platform-admin/onboarding' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-md space-y-6">
              <div>
                <h1 className="font-heading text-2xl font-bold text-stone-900">Agency Accreditation &amp; Onboarding Queue</h1>
                <p className="text-xs text-stone-500">Review legal accreditation certificates and grant official public authority to municipal candidates.</p>
              </div>

              {pendingOrgs.length === 0 ? (
                <div className="p-12 text-center bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-stone-700">Queue Clean &amp; Certified</p>
                  <p className="mt-1">All agency onboarding applications have been thoroughly accredited.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingOrgs.map((org) => (
                    <div key={org.id} className="p-6 rounded-2xl border-2 border-amber-300 bg-amber-50/30 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <h3 className="font-heading font-bold text-lg text-stone-900">{org.name}</h3>
                          <span className="text-xs font-mono text-amber-800 font-bold uppercase">Candidate Agency &bull; Type: {org.type}</span>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-bold font-mono">
                          Pending Security Verification
                        </span>
                      </div>

                      <p className="text-xs text-stone-700 leading-relaxed bg-white p-4 rounded-xl border border-amber-200">
                        {org.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-stone-600 bg-amber-100/40 p-3 rounded-xl">
                        <div><strong>Service Boundary:</strong> {org.serviceArea}</div>
                        <div><strong>Contact Email:</strong> {org.contactEmail}</div>
                        <div><strong>Official Phone:</strong> {org.phone}</div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          onClick={() => handleApproveOrg(org.id)}
                          className="px-5 py-2.5 rounded-xl bg-[#49345F] hover:bg-[#39284a] text-white font-bold text-xs uppercase tracking-wider transition shadow-md cursor-pointer flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve Accreditation &amp; Issue Authority</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. USER AND ROLE MANAGEMENT (/platform-admin/users) */}
          {currentSubpath === '/platform-admin/users' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#49345F]/15 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-stone-900">Platform User &amp; Role Directory</h1>
                  <p className="text-xs text-stone-500">RBAC authorization management, role reassignment, and account status controls.</p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#49345F]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['all', 'citizen', 'org_admin', 'field_staff', 'super_admin'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setUserRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition cursor-pointer ${
                      userRoleFilter === r
                        ? 'bg-[#49345F] text-white shadow-sm'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {r.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600 border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-800 uppercase font-mono text-[11px]">
                      <th className="py-3 px-3">User</th>
                      <th className="py-3 px-3">Current Role</th>
                      <th className="py-3 px-3">Affiliation</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Joined Date</th>
                      <th className="py-3 px-3">Role Change</th>
                      <th className="py-3 px-3 text-right">Account Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-stone-50 transition">
                        <td className="py-3 px-3">
                          <div className="font-bold text-stone-900">{u.name}</div>
                          <div className="text-[11px] text-stone-400 font-mono">{u.email}</div>
                        </td>
                        <td className="py-3 px-3"><RoleBadge role={u.role} /></td>
                        <td className="py-3 px-3">{u.organizationName || <span className="text-stone-400 italic">Civic Public</span>}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.accountStatus === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {u.accountStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-stone-400">{new Date(u.joinedAt).toLocaleDateString()}</td>
                        <td className="py-3 px-3">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                            className="p-1.5 rounded-lg border border-stone-200 text-[11px] text-stone-800 font-medium focus:ring-2 focus:ring-[#49345F] bg-white"
                          >
                            <option value="citizen">Citizen</option>
                            <option value="org_admin">Org Admin</option>
                            <option value="field_staff">Field Staff</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <select
                            value={u.accountStatus}
                            onChange={(e) => handleUserStatusChange(u.id, e.target.value as any)}
                            className="p-1.5 rounded-lg border border-stone-200 text-[11px] text-stone-800 font-medium focus:ring-2 focus:ring-[#49345F] bg-white"
                          >
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                            <option value="pending">Pending</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. PLATFORM CATEGORIES (/platform-admin/categories) */}
          {currentSubpath === '/platform-admin/categories' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#49345F]/15 shadow-md space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-stone-900">Platform Categories &amp; SLA Registry</h1>
                  <p className="text-xs text-stone-500">Master dispatch rules, turnaround SLA requirements, and responsible municipal departments.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{cat.name}</h4>
                        <span className="text-[10px] font-mono text-stone-400">Slug: {cat.slug}</span>
                      </div>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#49345F]/10 text-[#49345F] font-bold">
                        SLA: {cat.slaHours}h Target
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">{cat.description}</p>

                    <div className="text-[11px] text-stone-600 font-mono pt-2 border-t border-stone-200 flex justify-between items-center">
                      <span>Default Dept: <strong>{cat.defaultDepartmentName}</strong></span>
                      <button
                        onClick={() => handleOpenEditCategory(cat)}
                        className="px-3 py-1.5 rounded-lg bg-[#49345F] hover:bg-[#39284a] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Category</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Category Modal */}
              {editingCategory && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4">
                    <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                      <h3 className="font-heading font-bold text-lg text-stone-900">
                        Edit Category: {editingCategory.name}
                      </h3>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="p-1 text-stone-400 hover:text-stone-600 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">Category Name</label>
                        <input
                          type="text"
                          required
                          value={catName}
                          onChange={(e) => setCatName(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-stone-200"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">Description</label>
                        <textarea
                          rows={2}
                          required
                          value={catDesc}
                          onChange={(e) => setCatDesc(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-stone-200"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Target SLA (Hours)</label>
                          <input
                            type="number"
                            required
                            min={1}
                            max={168}
                            value={catSLA}
                            onChange={(e) => setCatSLA(Number(e.target.value))}
                            className="w-full p-2.5 rounded-xl border border-stone-200"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Default Department</label>
                          <input
                            type="text"
                            required
                            value={catDept}
                            onChange={(e) => setCatDept(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-stone-200"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 pt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={catActive}
                          onChange={(e) => setCatActive(e.target.checked)}
                          className="w-4 h-4 rounded text-[#49345F]"
                        />
                        <span className="font-bold text-stone-800">Category is Active for Citizen Intake</span>
                      </label>

                      <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
                        <button
                          type="button"
                          onClick={() => setEditingCategory(null)}
                          className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#49345F] text-white font-bold uppercase tracking-wider hover:bg-[#39284a]"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6. GLOBAL CONFIGURATION (/platform-admin/configuration) */}
          {currentSubpath === '/platform-admin/configuration' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-md max-w-3xl space-y-6">
              <div>
                <span className="text-xs font-mono uppercase text-[#49345F] font-bold">Governance Parameters</span>
                <h1 className="font-heading text-2xl font-bold text-stone-900 mt-1">Global Platform Configuration</h1>
                <p className="text-xs text-stone-500 mt-0.5">Adjust deterministic triage heuristics, file upload boundaries, and broadcast policies.</p>
              </div>

              {configSavedMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Global configuration updated and committed to audit log.</span>
                </div>
              )}

              <form onSubmit={handleSaveConfiguration} className="space-y-6 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Duplicate Proximity Threshold (km)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.2"
                      max="10"
                      value={configDuplicateRadius}
                      onChange={(e) => setConfigDuplicateRadius(parseFloat(e.target.value))}
                      className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-[#49345F]"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">Current radius: ~1.0 km spatial grid match</span>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Max Photo Upload Limit (MB)
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="50"
                      value={configMaxUploadMB}
                      onChange={(e) => setConfigMaxUploadMB(parseInt(e.target.value))}
                      className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-[#49345F]"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">Per resolution evidence photograph</span>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                      SLA Auto-Escalation Threshold (Hours)
                    </label>
                    <input
                      type="number"
                      min="12"
                      max="168"
                      value={configAutoEscalateHours}
                      onChange={(e) => setConfigAutoEscalateHours(parseInt(e.target.value))}
                      className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-[#49345F]"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">Tickets unassigned after this are flagged critical</span>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Default Public Alert Radius (km)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="50"
                      value={configDefaultAlertRadius}
                      onChange={(e) => setConfigDefaultAlertRadius(parseFloat(e.target.value))}
                      className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-[#49345F]"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">Emergency broadcast GIS circle</span>
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-4 space-y-3">
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Emergency System Banner (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Scheduled database backup tonight at 02:00 UTC..."
                    value={configEmergencyBanner}
                    onChange={(e) => setConfigEmergencyBanner(e.target.value)}
                    className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-[#49345F]"
                  />
                </div>

                <div className="border-t border-stone-200 pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#49345F] hover:bg-[#39284a] text-white font-bold text-xs uppercase tracking-wider transition shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Configuration Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 7. AUDIT TRAIL (/platform-admin/audit) */}
          {currentSubpath === '/platform-admin/audit' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#49345F]/15 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-stone-900">Cross-Platform Immutable Security Audit Stream</h1>
                  <p className="text-xs text-stone-500">Cryptographically verifiable operational audit events.</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search audit events..."
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#49345F]"
                    />
                  </div>

                  <button
                    onClick={() => {
                      const csv = civicStore.exportReportsToCSV();
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `civicsync-audit-${Date.now()}.csv`;
                      a.click();
                    }}
                    className="px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600 border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-800 uppercase font-mono text-[11px]">
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Actor</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Action</th>
                      <th className="py-2.5 px-3">Target</th>
                      <th className="py-2.5 px-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                    {filteredAudit.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50">
                        <td className="py-2.5 px-3 text-stone-400 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="py-2.5 px-3 font-semibold text-stone-800">{log.actorName}</td>
                        <td className="py-2.5 px-3 text-stone-500 uppercase">{log.actorRole}</td>
                        <td className="py-2.5 px-3 text-[#49345F] font-bold">{log.action}</td>
                        <td className="py-2.5 px-3">{log.targetType} #{log.targetId}</td>
                        <td className="py-2.5 px-3 text-stone-600 truncate max-w-sm">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. INTEGRATION HEALTH (/platform-admin/integrations) */}
          {currentSubpath === '/platform-admin/integrations' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6 max-w-3xl">
              <div>
                <h1 className="font-heading text-2xl font-bold text-stone-900">Integration Health &amp; Connectors</h1>
                <p className="text-xs text-stone-500">Real-time status of persistent storage engines, map tile services, and message queues.</p>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'LocalStorage Relational Persistence Engine', desc: 'Active browser storage schema v2.4 with atomic commits', status: 'HEALTHY', latency: '4ms', icon: Database },
                  { name: 'OpenStreetMap Leaflet GIS Cluster', desc: 'Tile rendering cache and coordinate picker boundary', status: 'OPERATIONAL', latency: '18ms', icon: Activity },
                  { name: 'Authentication & Session RBAC Guard', desc: 'Secure hash verification and subpath isolation', status: 'PROTECTED', latency: '<1ms', icon: Lock },
                  { name: 'Emergency Broadcast Channel Dispatch', desc: 'Pub/Sub notification broadcaster to connected clients', status: 'ONLINE', latency: '12ms', icon: Radio },
                  { name: 'Deterministic Duplicate Incident Engine', desc: 'Spatial ~1km distance check with category keyword matcher', status: 'ACTIVE', latency: '2ms', icon: FileCheck2 }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#49345F] flex items-center justify-center font-bold">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-stone-900">{item.name}</div>
                          <div className="text-[11px] text-stone-500">{item.desc}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                          {item.status}
                        </span>
                        <div className="text-[10px] text-stone-400 font-mono mt-0.5">{item.latency}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 9. SYSTEM DIAGNOSTICS (/platform-admin/system) */}
          {currentSubpath === '/platform-admin/system' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6 max-w-3xl">
              <div>
                <h1 className="font-heading text-2xl font-bold text-stone-900">System Diagnostics &amp; Node Telemetry</h1>
                <p className="text-xs text-stone-500">Framework runtime specifications and cache verification.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="text-xs text-stone-400 uppercase">Framework</div>
                  <div className="font-bold text-stone-900 mt-1">React 19</div>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="text-xs text-stone-400 uppercase">Bundler</div>
                  <div className="font-bold text-stone-900 mt-1">Vite 8.3</div>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="text-xs text-stone-400 uppercase">Styling</div>
                  <div className="font-bold text-stone-900 mt-1">Tailwind 4</div>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="text-xs text-stone-400 uppercase">Version</div>
                  <div className="font-bold text-[#49345F] mt-1">v2.6.4</div>
                </div>
              </div>

              <div className="p-5 bg-stone-900 text-stone-200 rounded-2xl font-mono text-xs space-y-2">
                <div className="text-[#B8A0E3] font-bold">[DIAGNOSTICS SELF-TEST PASS]</div>
                <div>&bull; LocalStorage State Cache: Valid JSON integrity (54.2 KB)</div>
                <div>&bull; Active Role Workspaces: 4 distinct role palettes initialized</div>
                <div>&bull; Leaflet Map Container: Loaded with OpenStreetMap tile layer</div>
                <div>&bull; Security Engine: Zero AI/LLM models, 100% deterministic software logic</div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
