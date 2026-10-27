import React, { useState } from 'react';
import {
  Shield,
  Building2,
  Users,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Server,
  Lock,
  Search,
  Filter,
  UserCheck,
  UserX,
  ExternalLink,
  ChevronRight,
  Database,
  Radio,
  FileCheck2
} from 'lucide-react';
import { UserProfile, Organization, IssueCategory, AuditLog, UserRole } from '../../types/civic';
import { RoleBadge } from '../common/Badge';
import { civicStore } from '../../services/store';

interface SuperAdminDashboardProps {
  currentUser: UserProfile;
  organizations: Organization[];
  users: UserProfile[];
  categories: IssueCategory[];
  auditLogs: AuditLog[];
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  currentUser,
  organizations,
  users,
  categories,
  auditLogs
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'organizations' | 'users' | 'categories' | 'audit' | 'system_health'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');

  const pendingOrgs = organizations.filter(o => o.status === 'pending');
  const activeOrgs = organizations.filter(o => o.status === 'active');

  const handleApproveOrg = (orgId: string) => {
    civicStore.updateOrganizationStatus(orgId, 'active');
    alert('Organization onboarding approved and accreditation verified.');
  };

  const handleSuspendOrg = (orgId: string) => {
    if (window.confirm('Suspend this agency? Operational dispatches will be paused.')) {
      civicStore.updateOrganizationStatus(orgId, 'suspended');
    }
  };

  const handleReactivateOrg = (orgId: string) => {
    civicStore.updateOrganizationStatus(orgId, 'active');
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    civicStore.updateUserRole(userId, newRole);
    alert('User role successfully updated in security directory.');
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-[#F3F0F7] min-h-screen text-[#292432]">
      {/* Top Banner (Deep Plum + Lavender + Silver palette) */}
      <div className="bg-gradient-to-r from-[#49345F] via-[#3B294F] to-[#2B1B3C] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-[#49345F]/40 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-14 h-14 rounded-full border-2 border-[#B8A0E3] object-cover shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                  {currentUser.name}
                </h1>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#B8A0E3]/20 text-[#B8A0E3] border border-[#B8A0E3]/30 font-bold">
                  Platform Governance Director
                </span>
              </div>
              <p className="text-[#B8A0E3]/90 text-xs sm:text-sm mt-0.5">
                CivicSync National Operations Grid &bull; Sovereign Municipal Infrastructure
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono bg-white/10 px-3 py-2 rounded-xl border border-white/20">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Grid Core 100% Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-4 mb-6 border-b border-[#49345F]/20">
          {[
            { id: 'overview', label: 'Platform Overview' },
            { id: 'organizations', label: `Agencies (${organizations.length})` },
            { id: 'users', label: `User Roles (${users.length})` },
            { id: 'categories', label: `Categories (${categories.length})` },
            { id: 'audit', label: `Audit Trail (${auditLogs.length})` },
            { id: 'system_health', label: 'System Health' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#49345F] text-white shadow-md'
                  : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Counters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#49345F]/15 shadow-sm">
                <span className="text-xs font-mono uppercase text-stone-500 font-bold">Total Agencies</span>
                <div className="font-mono text-3xl font-extrabold text-[#49345F] mt-1">{organizations.length}</div>
                <div className="text-[11px] text-stone-400 mt-1">{activeOrgs.length} active &bull; {pendingOrgs.length} pending</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#49345F]/15 shadow-sm">
                <span className="text-xs font-mono uppercase text-stone-500 font-bold">Registered Accounts</span>
                <div className="font-mono text-3xl font-extrabold text-stone-800 mt-1">{users.length}</div>
                <div className="text-[11px] text-stone-400 mt-1">Citizens, admins, field technicians</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#49345F]/15 shadow-sm">
                <span className="text-xs font-mono uppercase text-stone-500 font-bold">Audit Event Stream</span>
                <div className="font-mono text-3xl font-extrabold text-[#B8A0E3] mt-1">{auditLogs.length}</div>
                <div className="text-[11px] text-stone-400 mt-1">Immutable security ledger</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm">
                <span className="text-xs font-mono uppercase text-emerald-700 font-bold">Platform Uptime</span>
                <div className="font-mono text-3xl font-extrabold text-emerald-600 mt-1">99.98%</div>
                <div className="text-[11px] text-stone-400 mt-1">Zero downtime SLA target</div>
              </div>
            </div>

            {/* Pending Approvals & System Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Pending Agency Approvals */}
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#49345F]/15 shadow-md">
                <h3 className="font-heading font-bold text-base text-stone-900 mb-4">
                  Agency Onboarding Queue
                </h3>

                {pendingOrgs.length === 0 ? (
                  <div className="text-center py-12 text-stone-400 text-xs">
                    All agency accreditation applications have been processed.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingOrgs.map((org) => (
                      <div key={org.id} className="p-4 rounded-2xl border border-amber-300 bg-amber-50/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-stone-900">{org.name}</h4>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                            Pending Review
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">{org.description}</p>
                        <div className="text-[11px] text-stone-500 font-mono">
                          Service Area: {org.serviceArea} &bull; Contact: {org.contactEmail}
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                          <button
                            onClick={() => handleApproveOrg(org.id)}
                            className="px-4 py-2 rounded-xl bg-[#49345F] hover:bg-[#39284a] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                          >
                            Approve &amp; Accredit Agency
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Security & Platform Health */}
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#49345F]/15 shadow-md">
                <h3 className="font-heading font-bold text-base text-stone-900 mb-4">
                  Infrastructure Health Status
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Database className="w-4 h-4 text-[#49345F]" />
                      <div>
                        <div className="font-bold text-xs text-stone-900">PostgreSQL Database Storage</div>
                        <div className="text-[10px] text-stone-500">Row-Level Security active on all tables</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      HEALTHY (8ms)
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-[#49345F]" />
                      <div>
                        <div className="font-bold text-xs text-stone-900">Authentication & Identity Engine</div>
                        <div className="text-[10px] text-stone-500">JWT Token validation & role isolation active</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      ACTIVE
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Radio className="w-4 h-4 text-[#49345F]" />
                      <div>
                        <div className="font-bold text-xs text-stone-900">Emergency Broadcast Network</div>
                        <div className="text-[10px] text-stone-500">In-app pub/sub socket & notification queue</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      ONLINE
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileCheck2 className="w-4 h-4 text-[#49345F]" />
                      <div>
                        <div className="font-bold text-xs text-stone-900">Encrypted Evidence Storage</div>
                        <div className="text-[10px] text-stone-500">Resolution photo CDN & hash verification</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      SYNCHRONIZED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORGANIZATIONS DIRECTORY */}
        {activeTab === 'organizations' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#49345F]/15 shadow-md">
            <h3 className="font-heading font-bold text-lg text-stone-900 mb-4">
              Municipal & Regional Partner Agencies
            </h3>
            <div className="space-y-4">
              {organizations.map((org) => (
                <div key={org.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-stone-900">{org.name}</h4>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        org.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {org.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600">{org.description}</p>
                    <div className="text-[11px] text-stone-400 font-mono">
                      Area: {org.serviceArea} &bull; Staff: {org.staffCount} &bull; Active Tickets: {org.activeReportsCount}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {org.status === 'active' ? (
                      <button
                        onClick={() => handleSuspendOrg(org.id)}
                        className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold"
                      >
                        Suspend Agency
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReactivateOrg(org.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold"
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: USER & ROLE MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#49345F]/15 shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#49345F]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                {['all', 'citizen', 'org_admin', 'field_staff', 'super_admin'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setUserRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
                      userRoleFilter === r
                        ? 'bg-[#49345F] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {r.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600 border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-800 uppercase font-mono text-[11px]">
                    <th className="py-3 px-3">User</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Organization</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Joined</th>
                    <th className="py-3 px-3 text-right">Role Reassignment</th>
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
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {u.accountStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-stone-400">{new Date(u.joinedAt).toLocaleDateString()}</td>
                      <td className="py-3 px-3 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                          className="p-1.5 rounded-lg border border-stone-200 text-[11px] text-stone-800 font-medium"
                        >
                          <option value="citizen">Citizen</option>
                          <option value="org_admin">Org Admin</option>
                          <option value="field_staff">Field Staff</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES CONFIGURATION */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#49345F]/15 shadow-md">
            <h3 className="font-heading font-bold text-lg text-stone-900 mb-4">
              Platform Master Issue Categories &amp; Service Level Agreements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-stone-900">{cat.name}</h4>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#49345F]/10 text-[#49345F] font-bold">
                      SLA: {cat.slaHours} Hours
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mb-2">{cat.description}</p>
                  <div className="text-[11px] text-stone-600 font-mono">
                    Default Department: <strong>{cat.defaultDepartmentName}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#49345F]/15 shadow-md">
            <h3 className="font-heading font-bold text-lg text-stone-900 mb-4">
              Cross-Platform Immutable Security Audit Stream
            </h3>
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
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50">
                      <td className="py-2.5 px-3 text-stone-400">{new Date(log.timestamp).toLocaleString()}</td>
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

        {/* TAB 6: SYSTEM HEALTH */}
        {activeTab === 'system_health' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#49345F]/15 shadow-md max-w-3xl">
            <h3 className="font-heading font-bold text-lg text-stone-900 mb-4">
              System Health & Diagnostics Report
            </h3>
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-stone-800">Database Engine</div>
                  <div className="text-[11px] text-stone-500">PostgreSQL Relational Storage Schema v2.4</div>
                </div>
                <span className="font-mono text-emerald-600 font-bold">100% PERSISTENT</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-stone-800">Authentication & Session Management</div>
                  <div className="text-[11px] text-stone-500">RBAC Role Enforcement Boundary Verified</div>
                </div>
                <span className="font-mono text-emerald-600 font-bold">SECURED</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-stone-800">GIS Tile Server & Geocoding</div>
                  <div className="text-[11px] text-stone-500">OpenStreetMap Tile Distribution & Leaflet Engine</div>
                </div>
                <span className="font-mono text-emerald-600 font-bold">OPERATIONAL</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-stone-800">Duplicate Matching Engine</div>
                  <div className="text-[11px] text-stone-500">Deterministic ~1km Spatial Proximity & Category Triage</div>
                </div>
                <span className="font-mono text-emerald-600 font-bold">ACTIVE</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
