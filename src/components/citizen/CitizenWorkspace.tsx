import React, { useState } from 'react';
import {
  LayoutDashboard,
  Bell,
  PlusCircle,
  FileText,
  MapPin,
  Bookmark,
  User,
  HelpCircle,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Radio,
  CheckCircle2,
  Save
} from 'lucide-react';
import { UserProfile, CivicReport, PublicAlert, IssueCategory, InAppNotification } from '../../types/civic';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { InteractiveMap } from '../common/InteractiveMap';
import { ReportIssueWizard } from './ReportIssueWizard';
import { ReportDetailView } from './ReportDetailView';
import { PublicAlertsView } from '../alerts/PublicAlertsView';
import { civicStore } from '../../services/store';

interface CitizenWorkspaceProps {
  currentUser: UserProfile;
  currentSubpath: string;
  reports: CivicReport[];
  alerts: PublicAlert[];
  categories: IssueCategory[];
  notifications: InAppNotification[];
  selectedReportId?: string;
  onNavigate: (path: string) => void;
  onSignOut: () => void;
}

export const CitizenWorkspace: React.FC<CitizenWorkspaceProps> = ({
  currentUser,
  currentSubpath,
  reports,
  alerts,
  categories,
  notifications,
  selectedReportId,
  onNavigate,
  onSignOut
}) => {
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Profile and preference update state
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone || '(415) 890-2134');
  const [profileDistrict, setProfileDistrict] = useState('Central Metro District');
  const [notifInApp, setNotifInApp] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      alert('Please enter your full name');
      return;
    }
    civicStore.updateProfile(currentUser.id, {
      name: profileName.trim(),
      phone: profilePhone.trim()
    });
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 4000);
  };

  // Filter personal citizen records
  const myReports = reports.filter(r => r.submittedBy.id === currentUser.id);
  const myReview = myReports.filter(r => r.status === 'submitted' || r.status === 'under_review' || r.status === 'more_info_required');
  const myInProgress = myReports.filter(r => r.status === 'assigned' || r.status === 'in_progress' || r.status === 'awaiting_verification');
  const myResolved = myReports.filter(r => r.status === 'resolved' || r.status === 'closed');
  const savedAlerts = alerts.filter(a => a.savedByUsers?.includes(currentUser.id));
  const unreadNotifs = notifications.filter(n => !n.read && (n.recipientUserId === currentUser.id || n.recipientUserId === 'all'));

  const activeReport = selectedReportId ? reports.find(r => r.id === selectedReportId) : null;

  const NAV_ITEMS = [
    { path: '/citizen/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/citizen/alerts', label: 'Public Alerts', icon: Radio },
    { path: '/citizen/reports/new', label: 'Report an Issue', icon: PlusCircle },
    { path: '/citizen/reports', label: `My Reports (${myReports.length})`, icon: FileText },
    { path: '/citizen/map', label: 'Issue Map', icon: MapPin },
    { path: '/citizen/saved-alerts', label: `Saved Alerts (${savedAlerts.length})`, icon: Bookmark },
    { path: '/citizen/notifications', label: `Notifications (${unreadNotifs.length})`, icon: Bell },
    { path: '/citizen/profile', label: 'Profile & Settings', icon: User },
    { path: '/citizen/help', label: 'Help & Support', icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-[#F5F7EF] text-[#25332D] flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#176B52] text-white h-16 px-4 sm:px-6 flex items-center justify-between border-b border-[#176B52]/40 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebar(!mobileSidebar)}
            className="md:hidden p-2 text-white hover:bg-[#125541] rounded-lg"
          >
            {mobileSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => onNavigate('/citizen/dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#9ADBC0] text-[#176B52] font-black text-base flex items-center justify-center shadow-sm">
              CS
            </div>
            <div>
              <span className="font-heading font-extrabold text-base text-white tracking-tight flex items-center gap-2">
                CivicSync
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#9ADBC0]/20 text-[#9ADBC0] font-bold">
                  Citizen
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* User Info & Sign Out */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-100 font-mono">
            <span>Maya Lin</span>
            <span className="text-emerald-300">&bull;</span>
            <span className="text-[#9ADBC0]">Central District</span>
          </div>

          <button
            onClick={() => onNavigate('/citizen/reports/new')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E8B86D] hover:bg-[#dba85b] text-[#25332D] font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Report</span>
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

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Dedicated Sidebar */}
        <aside
          className={`fixed md:sticky top-16 z-30 w-64 h-[calc(100vh-4rem)] bg-white border-r border-[#176B52]/15 p-4 flex flex-col justify-between transition-transform duration-200 ${
            mobileSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono uppercase text-stone-400 font-bold tracking-wider">
              Citizen Workspace
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentSubpath === item.path || (item.path !== '/citizen/dashboard' && currentSubpath.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate(item.path);
                    setMobileSidebar(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#176B52] text-white shadow-sm'
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
            <div>Verified Citizen Profile</div>
            <div className="text-stone-400 text-[10px]">Session Persistent</div>
          </div>
        </aside>

        {/* Feature Page Work Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* FEATURE 1: DASHBOARD OVERVIEW */}
          {currentSubpath === '/citizen/dashboard' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#176B52] to-[#125541] rounded-3xl p-6 sm:p-8 text-white shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase text-[#9ADBC0] font-bold">Citizen Portal</span>
                    <h1 className="font-heading text-2xl sm:text-3xl font-extrabold mt-1">
                      Welcome back, {currentUser.name}
                    </h1>
                    <p className="text-emerald-100 text-xs mt-1">
                      Central District Resident &bull; Active Citizen Responder
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('/citizen/reports/new')}
                    className="px-6 py-3 rounded-2xl bg-[#E8B86D] hover:bg-[#d9a857] text-[#25332D] font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Report a Civic Problem</span>
                  </button>
                </div>
              </div>

              {/* Stat Counters */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#176B52]/15 shadow-sm">
                  <span className="text-xs font-mono uppercase text-stone-500 font-bold">Total Reports</span>
                  <div className="font-mono text-3xl font-extrabold text-[#176B52] mt-1">{myReports.length}</div>
                  <div className="text-[11px] text-stone-400 mt-1">Personal submissions</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-sm">
                  <span className="text-xs font-mono uppercase text-purple-700 font-bold">Under Review</span>
                  <div className="font-mono text-3xl font-extrabold text-purple-800 mt-1">{myReview.length}</div>
                  <div className="text-[11px] text-stone-400 mt-1">Triage intake</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-orange-200 shadow-sm">
                  <span className="text-xs font-mono uppercase text-orange-700 font-bold">In Field Progress</span>
                  <div className="font-mono text-3xl font-extrabold text-orange-700 mt-1">{myInProgress.length}</div>
                  <div className="text-[11px] text-stone-400 mt-1">Crew on site</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm">
                  <span className="text-xs font-mono uppercase text-emerald-700 font-bold">Resolved &amp; Closed</span>
                  <div className="font-mono text-3xl font-extrabold text-emerald-700 mt-1">{myResolved.length}</div>
                  <div className="text-[11px] text-stone-400 mt-1">Verified fixes</div>
                </div>
              </div>

              {/* Recent reports list */}
              <div className="bg-white rounded-3xl p-6 border border-[#176B52]/15 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-base text-stone-900">
                    Recent Personal Submissions
                  </h3>
                  <button
                    onClick={() => onNavigate('/citizen/reports')}
                    className="text-xs font-bold text-[#176B52] hover:underline"
                  >
                    View All ({myReports.length}) &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {myReports.slice(0, 3).map((rep) => (
                    <div
                      key={rep.id}
                      onClick={() => onNavigate(`/citizen/reports/${rep.id}`)}
                      className="p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition cursor-pointer flex items-center justify-between gap-4 group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-[#176B52]">{rep.reportNumber}</span>
                          <StatusBadge status={rep.status} size="sm" />
                          <PriorityBadge priority={rep.priority} />
                        </div>
                        <h4 className="text-xs font-bold text-stone-900 truncate group-hover:text-[#176B52] transition">
                          {rep.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">{rep.location.address}</p>
                      </div>
                      <span className="text-xs font-bold text-[#176B52] group-hover:underline shrink-0">
                        Track Progress &rarr;
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FEATURE 2: PUBLIC ALERTS FEED (Coral + Marigold palette) */}
          {currentSubpath === '/citizen/alerts' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#F28C45] to-[#E8B86D] rounded-3xl p-6 text-stone-950 shadow-md">
                <h1 className="font-heading text-2xl font-extrabold">Official Public Alerts</h1>
                <p className="text-xs font-medium text-stone-900 mt-1">
                  Real-time municipal emergency broadcasts and scheduled utility advisories.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alerts.filter(a => a.publicationStatus === 'published').map((alt) => (
                  <div key={alt.id} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase font-bold text-[#F28C45]">{alt.severity}</span>
                      <span className="text-[11px] font-mono text-stone-400">{new Date(alt.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-heading font-bold text-base text-stone-900">{alt.title}</h3>
                    <p className="text-xs text-stone-600 line-clamp-3">{alt.description}</p>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1.5 pt-2 border-t border-stone-100">
                      <MapPin className="w-3.5 h-3.5 text-[#F28C45]" />
                      <span>{alt.affectedArea}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FEATURE 3: REPORT AN ISSUE GUIDED WIZARD (Teal + Peach palette) */}
          {currentSubpath === '/citizen/reports/new' && (
            <ReportIssueWizard
              categories={categories}
              onCancel={() => onNavigate('/citizen/dashboard')}
              onSuccess={(newReport) => onNavigate(`/citizen/reports/${newReport.id}`)}
            />
          )}

          {/* FEATURE 4: MY REPORTS LIST */}
          {currentSubpath === '/citizen/reports' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#176B52]/15 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-stone-900">My Submitted Reports</h1>
                  <p className="text-xs text-stone-500">Track and manage every civic issue you registered.</p>
                </div>
                <button
                  onClick={() => onNavigate('/citizen/reports/new')}
                  className="px-4 py-2.5 rounded-xl bg-[#176B52] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#125541] transition cursor-pointer"
                >
                  File New Report
                </button>
              </div>

              <div className="space-y-3">
                {myReports.map((rep) => (
                  <div
                    key={rep.id}
                    onClick={() => onNavigate(`/citizen/reports/${rep.id}`)}
                    className="p-4 rounded-2xl border border-stone-200 hover:border-[#176B52] bg-stone-50/50 hover:bg-white transition cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#176B52]">{rep.reportNumber}</span>
                        <StatusBadge status={rep.status} size="sm" />
                        <PriorityBadge priority={rep.priority} />
                      </div>
                      <h4 className="font-bold text-sm text-stone-900 group-hover:text-[#176B52] transition">{rep.title}</h4>
                      <p className="text-xs text-stone-500">{rep.location.address}</p>
                    </div>
                    <span className="text-xs font-bold text-[#176B52] group-hover:underline">
                      View Timeline &rarr;
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FEATURE 5: REPORT DETAIL & TRACKING (Violet + Mint) */}
          {currentSubpath.startsWith('/citizen/reports/') && activeReport && (
            <ReportDetailView
              report={activeReport}
              currentUser={currentUser}
              onBack={() => onNavigate('/citizen/reports')}
            />
          )}

          {/* FEATURE 6: ISSUE MAP (Olive + Pale Yellow) */}
          {currentSubpath === '/citizen/map' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#176B52]/15 shadow-md space-y-4">
              <h1 className="font-heading text-2xl font-bold text-stone-900">City-Wide Civic Issue Map</h1>
              <p className="text-xs text-stone-500">Spatial locations of active community reports and repair crews.</p>
              <InteractiveMap
                reports={reports}
                onSelectReport={(rep) => onNavigate(`/citizen/reports/${rep.id}`)}
                height="540px"
              />
            </div>
          )}

          {/* FEATURE 7: NOTIFICATIONS (Indigo + Peach) */}
          {currentSubpath === '/citizen/notifications' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h1 className="font-heading text-2xl font-bold text-stone-900">In-App Notifications</h1>
                <button
                  onClick={() => civicStore.markAllNotificationsRead(currentUser.id)}
                  className="text-xs font-bold text-[#176B52] hover:underline"
                >
                  Mark All as Read
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-stone-900">{notif.title}</span>
                      <span className="text-[10px] text-stone-400 font-mono">{new Date(notif.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FEATURE 8: SAVED ALERTS */}
          {currentSubpath === '/citizen/saved-alerts' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-4">
              <h1 className="font-heading text-2xl font-bold text-stone-900">Saved Public Alerts</h1>
              {savedAlerts.length === 0 ? (
                <p className="text-xs text-stone-400 italic">No bookmarked alerts yet.</p>
              ) : (
                <div className="space-y-3">
                  {savedAlerts.map((alt) => (
                    <div key={alt.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex justify-between items-center">
                      <div>
                        <span className="text-xs font-mono font-bold text-[#176B52]">{alt.alertNumber}</span>
                        <h4 className="font-bold text-sm text-stone-900">{alt.title}</h4>
                        <p className="text-xs text-stone-500">{alt.affectedArea}</p>
                      </div>
                      <button
                        onClick={() => civicStore.toggleSaveAlert(alt.id)}
                        className="text-xs font-semibold text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* FEATURE 9: PROFILE & PREFERENCES (Sage + Warm Ivory) */}
          {currentSubpath === '/citizen/profile' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#176B52]/20 shadow-lg max-w-3xl space-y-6">
              <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <span className="text-xs font-mono uppercase text-[#176B52] font-bold">Resident Account</span>
                  <h1 className="font-heading text-2xl font-bold text-stone-900">Profile &amp; Notification Preferences</h1>
                  <p className="text-xs text-stone-500 mt-0.5">Manage your citizen contact information and community alert dispatch options.</p>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold">
                  Verified Resident
                </span>
              </div>

              {profileSavedMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Profile updates saved successfully. All civic dispatch preferences are active!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#176B52] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Primary Email Address
                    </label>
                    <input
                      type="email"
                      readOnly
                      value={currentUser.email}
                      className="w-full p-3 rounded-xl border border-stone-200 bg-stone-100 text-xs text-stone-500 font-mono cursor-not-allowed"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">Tied to municipal identity certificate</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Mobile / SMS Phone
                    </label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#176B52] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Residential District
                    </label>
                    <select
                      value={profileDistrict}
                      onChange={(e) => setProfileDistrict(e.target.value)}
                      className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#176B52] focus:bg-white transition"
                    >
                      <option value="Central Metro District">Central Metro District</option>
                      <option value="Northside Parkside">Northside Parkside</option>
                      <option value="Harbor District">Harbor District</option>
                      <option value="Highland Sector">Highland Sector</option>
                      <option value="South Suburbs">South Suburbs</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-5 space-y-3">
                  <h3 className="font-heading font-bold text-sm text-stone-900">
                    Community Notification Channels
                  </h3>
                  <p className="text-xs text-stone-500">
                    Control how municipal agencies alert you regarding report status updates and public safety advisories.
                  </p>

                  <div className="space-y-2.5 pt-2">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={notifInApp}
                        onChange={(e) => setNotifInApp(e.target.checked)}
                        className="w-4 h-4 rounded text-[#176B52] focus:ring-[#176B52]"
                      />
                      <div>
                        <div className="text-xs font-bold text-stone-900">In-App Notification Feed</div>
                        <div className="text-[11px] text-stone-500">Instant status alerts when repair crews arrive on site or request info</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={notifEmail}
                        onChange={(e) => setNotifEmail(e.target.checked)}
                        className="w-4 h-4 rounded text-[#176B52] focus:ring-[#176B52]"
                      />
                      <div>
                        <div className="text-xs font-bold text-stone-900">Email Status Notifications</div>
                        <div className="text-[11px] text-stone-500">Receive formal intake confirmation receipts and resolution certifications via email</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={notifSMS}
                        onChange={(e) => setNotifSMS(e.target.checked)}
                        className="w-4 h-4 rounded text-[#176B52] focus:ring-[#176B52]"
                      />
                      <div>
                        <div className="text-xs font-bold text-stone-900">SMS Urgent Hazard Alerts</div>
                        <div className="text-[11px] text-stone-500">Immediate SMS text message for Level 4 Emergency municipal warnings in your district</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#176B52] hover:bg-[#125541] text-white font-bold text-xs uppercase tracking-wider transition shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Updates</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* FEATURE 10: HELP & SUPPORT */}
          {currentSubpath === '/citizen/help' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-4 max-w-2xl">
              <h1 className="font-heading text-2xl font-bold text-stone-900">Citizen Help &amp; Support</h1>
              <p className="text-xs text-stone-600 leading-relaxed">
                For urgent life-safety hazards, dial 911 immediately. For infrastructure repairs (potholes, streetlights, drainage), use the "Report an Issue" wizard to submit directly to the municipal triage desk.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
