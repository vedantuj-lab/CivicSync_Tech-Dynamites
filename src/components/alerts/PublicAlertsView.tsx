import React, { useState } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  MapPin,
  Clock,
  Building2,
  Bookmark,
  Share2,
  ChevronRight,
  ShieldAlert,
  X,
  CheckCircle2,
  Info
} from 'lucide-react';
import { PublicAlert, AlertSeverity, UserProfile } from '../../types/civic';
import { SeverityBadge } from '../common/Badge';
import { civicStore } from '../../services/store';

interface PublicAlertsViewProps {
  alerts: PublicAlert[];
  currentUser: UserProfile | null;
  onSelectAlert?: (alert: PublicAlert) => void;
  selectedAlert?: PublicAlert | null;
  onCloseSelectedAlert?: () => void;
}

export const PublicAlertsView: React.FC<PublicAlertsViewProps> = ({
  alerts,
  currentUser,
  onSelectAlert,
  selectedAlert,
  onCloseSelectedAlert
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [savedOnly, setSavedOnly] = useState(false);
  const [activeModalAlert, setActiveModalAlert] = useState<PublicAlert | null>(selectedAlert || null);

  const publishedAlerts = alerts.filter((a) => a.publicationStatus === 'published');

  const filtered = publishedAlerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.affectedArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.issuingOrgName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesSaved = !savedOnly || (currentUser && alert.savedByUsers?.includes(currentUser.id));

    return matchesSearch && matchesSeverity && matchesSaved;
  });

  const handleToggleSave = (alertId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentUser) {
      window.alert('Please sign in or choose a demo persona to bookmark official alerts.');
      return;
    }
    civicStore.toggleSaveAlert(alertId);
  };

  const handleCopyLink = (alert: PublicAlert, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + '?alert=' + alert.alertNumber);
    window.alert(`Official Alert Link copied for ${alert.alertNumber}`);
  };

  return (
    <div className="bg-[#171A19] min-h-screen text-[#F8F7F2] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#F28C45] mb-2 font-bold tracking-wider">
            <ShieldAlert className="w-4 h-4 text-[#F28C45]" />
            Unified Public Alert Protocol
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
            Official Public Advisories & Emergency Broadcasts
          </h1>
          <p className="text-stone-400 text-sm mt-1 max-w-2xl">
            Live broadcasts authenticated by municipal response commanders. Verified instructions, affected geographic zones, and real-time operational updates.
          </p>
        </div>

        {/* Filter Toolbar (Coral + Marigold palette touches) */}
        <div className="bg-stone-900/90 rounded-2xl border border-stone-800 p-4 mb-8 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by keyword, district, or issuing authority..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#F28C45]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1 text-xs text-stone-400 mr-1">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <span>Severity:</span>
            </div>

            {['all', 'emergency', 'warning', 'advisory'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  severityFilter === sev
                    ? 'bg-[#F28C45] text-stone-950 shadow-sm'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                {sev}
              </button>
            ))}

            {currentUser && (
              <button
                onClick={() => setSavedOnly(!savedOnly)}
                className={`ml-2 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                  savedOnly
                    ? 'bg-[#E8B86D] text-stone-950 font-bold'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Bookmarked</span>
              </button>
            )}
          </div>
        </div>

        {/* Alert Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-stone-900/40 rounded-3xl border border-stone-800">
            <AlertTriangle className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Active Alerts Found</h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto mb-4">
              No official emergency broadcasts match the current keyword or severity criteria.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSeverityFilter('all'); setSavedOnly(false); }}
              className="px-4 py-2 rounded-xl bg-stone-800 text-xs text-stone-200 hover:bg-stone-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((alert) => {
              const isSaved = currentUser && alert.savedByUsers?.includes(currentUser.id);
              const isEmergency = alert.severity === 'emergency';
              const isWarning = alert.severity === 'warning';

              return (
                <div
                  key={alert.id}
                  onClick={() => setActiveModalAlert(alert)}
                  className={`bg-stone-900 rounded-3xl p-6 border transition flex flex-col justify-between cursor-pointer group shadow-xl ${
                    isEmergency
                      ? 'border-red-500/50 hover:border-red-400 bg-gradient-to-b from-stone-900 via-stone-900 to-red-950/20'
                      : isWarning
                      ? 'border-orange-500/40 hover:border-orange-400'
                      : 'border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <SeverityBadge severity={alert.severity} />
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleToggleSave(alert.id, e)}
                          title="Bookmark Alert"
                          className={`p-1.5 rounded-lg border transition ${
                            isSaved
                              ? 'bg-[#E8B86D] text-stone-950 border-[#E8B86D]'
                              : 'bg-stone-800/80 text-stone-400 hover:text-white border-stone-700'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={(e) => handleCopyLink(alert, e)}
                          title="Share Link"
                          className="p-1.5 rounded-lg bg-stone-800/80 text-stone-400 hover:text-white border border-stone-700 transition"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-stone-500 mb-1 flex items-center justify-between">
                      <span>{alert.alertNumber}</span>
                      <span>{alert.category}</span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-white mb-3 group-hover:text-[#F28C45] transition leading-snug">
                      {alert.title}
                    </h3>

                    <p className="text-stone-300 text-xs leading-relaxed line-clamp-3 mb-5 font-light">
                      {alert.description}
                    </p>

                    <div className="space-y-2 border-t border-stone-800/80 pt-4 mb-4 text-xs text-stone-300">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#F28C45] shrink-0 mt-0.5" />
                        <span className="leading-tight font-medium text-stone-200">{alert.affectedArea}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-400">
                        <Building2 className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        <span className="truncate">{alert.issuingOrgName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 font-mono">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>Expires: {alert.expiresAt ? new Date(alert.expiresAt).toLocaleDateString() : 'Until further notice'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-stone-500 font-mono">
                      {new Date(alert.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; {new Date(alert.publishedAt).toLocaleDateString()}
                    </span>
                    <span className="text-[#F28C45] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Full Directive &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Alert Modal */}
        {activeModalAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-stone-900 border border-stone-700 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => {
                  setActiveModalAlert(null);
                  if (onCloseSelectedAlert) onCloseSelectedAlert();
                }}
                className="absolute top-5 right-5 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <SeverityBadge severity={activeModalAlert.severity} />
                <span className="text-xs font-mono text-stone-400">{activeModalAlert.alertNumber}</span>
              </div>

              <h2 className="font-heading text-2xl font-bold mb-3 text-white">
                {activeModalAlert.title}
              </h2>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-stone-400 pb-4 mb-5 border-b border-stone-800">
                <span className="flex items-center gap-1 text-stone-300">
                  <Building2 className="w-3.5 h-3.5 text-[#F28C45]" />
                  {activeModalAlert.issuingOrgName}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Published {new Date(activeModalAlert.publishedAt).toLocaleString()}
                </span>
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-mono uppercase text-[#F28C45] font-semibold mb-2">
                  Official Directive Summary
                </h4>
                <p className="text-stone-200 text-sm leading-relaxed bg-stone-950 p-4 rounded-xl border border-stone-800">
                  {activeModalAlert.description}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-mono uppercase text-[#F28C45] font-semibold mb-2">
                  Affected Geographic Corridor
                </h4>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-300">
                  <MapPin className="w-4 h-4 text-[#F28C45] shrink-0" />
                  <span>{activeModalAlert.affectedArea}</span>
                  {activeModalAlert.coordinates && (
                    <span className="ml-auto font-mono text-[11px] text-stone-500">
                      GPS: {activeModalAlert.coordinates.lat.toFixed(4)}, {activeModalAlert.coordinates.lng.toFixed(4)}
                    </span>
                  )}
                </div>
              </div>

              {activeModalAlert.instructions && activeModalAlert.instructions.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-mono uppercase text-[#F28C45] font-semibold mb-3">
                    Mandatory Public Action Instructions
                  </h4>
                  <ul className="space-y-2.5">
                    {activeModalAlert.instructions.map((inst, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-stone-800/70 border border-stone-700/60 text-xs text-stone-200">
                        <CheckCircle2 className="w-4 h-4 text-[#C8F169] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{inst}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                <span className="text-[11px] text-stone-500 font-mono">
                  Issued By: {activeModalAlert.createdBy} &bull; Official City Gazette Record
                </span>
                <button
                  onClick={() => handleToggleSave(activeModalAlert.id)}
                  className="px-4 py-2 rounded-xl bg-[#F28C45] text-stone-950 font-bold text-xs hover:bg-[#d97532] transition flex items-center gap-2 cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{currentUser && activeModalAlert.savedByUsers?.includes(currentUser.id) ? 'Bookmarked' : 'Save Advisory'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
