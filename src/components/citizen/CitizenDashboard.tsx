import React, { useState } from 'react';
import {
  FileText,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  MapPin,
  Bookmark,
  Bell,
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { CivicReport, PublicAlert, IssueCategory, UserProfile } from '../../types/civic';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { InteractiveMap } from '../common/InteractiveMap';
import { civicStore } from '../../services/store';

interface CitizenDashboardProps {
  currentUser: UserProfile;
  reports: CivicReport[];
  alerts: PublicAlert[];
  categories: IssueCategory[];
  onStartReport: (catId?: string) => void;
  onOpenReportDetail: (report: CivicReport) => void;
  onNavigateAlerts: () => void;
  onSelectAlert: (alert: PublicAlert) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  currentUser,
  reports,
  alerts,
  categories,
  onStartReport,
  onOpenReportDetail,
  onNavigateAlerts,
  onSelectAlert
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'my_reports' | 'issue_map' | 'saved_alerts' | 'profile'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter only this citizen's submissions for personal statistics
  const myReports = reports.filter((r) => r.submittedBy.id === currentUser.id);
  const myReview = myReports.filter((r) => r.status === 'submitted' || r.status === 'under_review' || r.status === 'more_info_required');
  const myInProgress = myReports.filter((r) => r.status === 'assigned' || r.status === 'in_progress' || r.status === 'awaiting_verification');
  const myResolved = myReports.filter((r) => r.status === 'resolved' || r.status === 'closed');

  const savedAlerts = alerts.filter((a) => a.savedByUsers?.includes(currentUser.id));

  const filteredMyReports = myReports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-[#F5F7EF] min-h-screen text-[#25332D]">
      {/* Top Banner (Forest Green + Soft Mint + Warm Cream theme) */}
      <div className="bg-gradient-to-r from-[#176B52] to-[#125541] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-[#176B52]/30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-14 h-14 rounded-full border-2 border-[#9ADBC0] object-cover shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome back, {currentUser.name}
                </h1>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#9ADBC0]/20 text-[#9ADBC0] border border-[#9ADBC0]/30 font-bold">
                  Verified Resident
                </span>
              </div>
              <p className="text-emerald-100/80 text-xs sm:text-sm mt-0.5">
                Central District &bull; Civic ID #{currentUser.id} &bull; Active Citizen Responder
              </p>
            </div>
          </div>

          <button
            onClick={() => onStartReport()}
            className="px-6 py-3.5 rounded-2xl bg-[#E8B86D] hover:bg-[#d9a857] text-[#25332D] font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report a Civic Problem</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-4 mb-6 border-b border-[#176B52]/15">
          {[
            { id: 'overview', label: 'Overview & Activity' },
            { id: 'my_reports', label: `My Reports (${myReports.length})` },
            { id: 'issue_map', label: 'Live City Map' },
            { id: 'saved_alerts', label: `Saved Alerts (${savedAlerts.length})` },
            { id: 'profile', label: 'Preferences' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#176B52] text-white shadow-md'
                  : 'bg-white/80 hover:bg-white text-stone-600 border border-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#176B52]/15 shadow-sm">
                <span className="text-xs font-mono uppercase text-stone-500 font-bold">Total Submitted</span>
                <div className="font-mono text-3xl font-extrabold text-[#176B52] mt-1">{myReports.length}</div>
                <div className="text-[11px] text-stone-400 mt-1">Personal civic submissions</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#176B52]/15 shadow-sm">
                <span className="text-xs font-mono uppercase text-purple-600 font-bold">Under Review</span>
                <div className="font-mono text-3xl font-extrabold text-purple-700 mt-1">{myReview.length}</div>
                <div className="text-[11px] text-stone-400 mt-1">Intake triage queue</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#176B52]/15 shadow-sm">
                <span className="text-xs font-mono uppercase text-orange-600 font-bold">In Field Progress</span>
                <div className="font-mono text-3xl font-extrabold text-orange-600 mt-1">{myInProgress.length}</div>
                <div className="text-[11px] text-stone-400 mt-1">Crews actively dispatched</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#176B52]/15 shadow-sm">
                <span className="text-xs font-mono uppercase text-emerald-600 font-bold">Resolved & Closed</span>
                <div className="font-mono text-3xl font-extrabold text-emerald-600 mt-1">{myResolved.length}</div>
                <div className="text-[11px] text-stone-400 mt-1">Verified community fixes</div>
              </div>
            </div>

            {/* Recent Submissions & Public Alerts side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Recent Submissions */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#176B52]/15 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-base text-stone-900">
                    Recent Personal Reports
                  </h3>
                  <button
                    onClick={() => setActiveTab('my_reports')}
                    className="text-xs font-bold text-[#176B52] hover:underline"
                  >
                    View All ({myReports.length}) &rarr;
                  </button>
                </div>

                {myReports.length === 0 ? (
                  <div className="text-center py-10 text-stone-400 text-xs">
                    You haven't submitted any civic reports yet. Click "Report a Civic Problem" above!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myReports.slice(0, 4).map((rep) => (
                      <div
                        key={rep.id}
                        onClick={() => onOpenReportDetail(rep)}
                        className="p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono font-bold text-[#176B52]">{rep.reportNumber}</span>
                            <StatusBadge status={rep.status} size="sm" />
                          </div>
                          <h4 className="text-xs font-bold text-stone-900 truncate group-hover:text-[#176B52] transition">
                            {rep.title}
                          </h4>
                          <p className="text-[11px] text-stone-500 truncate mt-0.5">{rep.location.address}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Active Public Alerts */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#176B52]/15 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-bold text-base text-stone-900">
                      Active Community Alerts
                    </h3>
                    <button
                      onClick={onNavigateAlerts}
                      className="text-xs font-bold text-[#176B52] hover:underline"
                    >
                      All Advisories &rarr;
                    </button>
                  </div>

                  <div className="space-y-3">
                    {alerts.filter(a => a.publicationStatus === 'published').slice(0, 3).map((alt) => (
                      <div
                        key={alt.id}
                        onClick={() => onSelectAlert(alt)}
                        className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-300 transition cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                            {alt.severity}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {new Date(alt.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-stone-900 line-clamp-1 mb-1">{alt.title}</h4>
                        <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">{alt.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 mt-4 text-[11px] text-stone-500 text-center">
                  Official emergency notifications distributed in real-time.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY REPORTS */}
        {activeTab === 'my_reports' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#176B52]/15 shadow-md">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by ID, title, address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                {['all', 'submitted', 'under_review', 'assigned', 'in_progress', 'awaiting_verification', 'resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
                      statusFilter === st
                        ? 'bg-[#176B52] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {filteredMyReports.length === 0 ? (
              <div className="text-center py-16 text-stone-400 text-xs">
                No matching reports found with the current filter.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMyReports.map((rep) => (
                  <div
                    key={rep.id}
                    onClick={() => onOpenReportDetail(rep)}
                    className="p-4 rounded-2xl border border-stone-200 hover:border-[#176B52] transition cursor-pointer bg-stone-50/50 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#176B52]">{rep.reportNumber}</span>
                        <StatusBadge status={rep.status} size="sm" />
                        <PriorityBadge priority={rep.priority} />
                        <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
                          &bull; {new Date(rep.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-stone-900 group-hover:text-[#176B52] transition">
                        {rep.title}
                      </h4>
                      <p className="text-xs text-stone-500 line-clamp-1">{rep.location.address}</p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <span className="text-xs font-bold text-[#176B52] group-hover:underline flex items-center gap-1">
                        Track Timeline &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ISSUE MAP */}
        {activeTab === 'issue_map' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#176B52]/15 shadow-md">
            <div className="mb-4">
              <h3 className="font-heading font-bold text-lg text-stone-900">
                Metropolitan Issue Distribution Map
              </h3>
              <p className="text-xs text-stone-500">
                Displaying community reports. Click any pin to inspect ticket details or review progress.
              </p>
            </div>
            <InteractiveMap
              reports={reports}
              onSelectReport={(rep) => onOpenReportDetail(rep)}
              height="500px"
            />
          </div>
        )}

        {/* TAB 4: SAVED ALERTS */}
        {activeTab === 'saved_alerts' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#176B52]/15 shadow-md">
            <h3 className="font-heading font-bold text-lg text-stone-900 mb-4">
              Bookmarked Public Advisories
            </h3>
            {savedAlerts.length === 0 ? (
              <div className="text-center py-16 text-stone-400 text-xs">
                No bookmarked alerts yet. Click the bookmark icon on any alert in the Public Alerts feed.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedAlerts.map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => onSelectAlert(alt)}
                    className="p-5 rounded-2xl border border-stone-200 hover:border-[#176B52] transition cursor-pointer bg-stone-50/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#176B52]">{alt.alertNumber}</span>
                      <span className="text-xs font-mono uppercase text-amber-600 font-bold">{alt.severity}</span>
                    </div>
                    <h4 className="font-bold text-sm text-stone-900 mb-1">{alt.title}</h4>
                    <p className="text-xs text-stone-500 line-clamp-2 mb-3">{alt.description}</p>
                    <div className="text-[11px] text-stone-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#176B52]" />
                      <span>{alt.affectedArea}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PROFILE & PREFERENCES */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#176B52]/15 shadow-md max-w-2xl">
            <h3 className="font-heading font-bold text-lg text-stone-900 mb-4">
              Citizen Profile & Notification Settings
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser.name}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-700"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Email Address</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser.email}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-700"
                />
              </div>
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <h4 className="font-bold text-stone-800 uppercase text-[11px]">Communication Preferences</h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#176B52]" />
                  <span>Receive in-app alerts whenever my ticket status changes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#176B52]" />
                  <span>Receive critical emergency advisories issued for my district</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
