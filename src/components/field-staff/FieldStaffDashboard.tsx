import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  MapPin,
  Camera,
  Play,
  Upload,
  Pause,
  Send,
  X,
  FileCheck2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { CivicReport, UserProfile } from '../../types/civic';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { InteractiveMap } from '../common/InteractiveMap';
import { civicStore } from '../../services/store';

interface FieldStaffDashboardProps {
  currentUser: UserProfile;
  reports: CivicReport[];
  onOpenReportDetail: (report: CivicReport) => void;
}

const SAMPLE_RESOLUTION_PHOTOS = [
  { label: 'Fresh Bitumen Asphalt Patch (Level & Compacted)', url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80' },
  { label: 'Cleared Stormwater Grate with Free Water Inflow', url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80' },
  { label: 'New High-Output LED Fixture Pole Replacement', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80' },
  { label: 'Sanitized & Emptied Heavy Recycling Container', url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80' }
];

export const FieldStaffDashboard: React.FC<FieldStaffDashboardProps> = ({
  currentUser,
  reports,
  onOpenReportDetail
}) => {
  const [activeTab, setActiveTab] = useState<'my_work' | 'assignment_map' | 'history'>('my_work');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modals
  const [resolutionReport, setResolutionReport] = useState<CivicReport | null>(null);
  const [workNotes, setWorkNotes] = useState('');
  const [materialsUsed, setMaterialsUsed] = useState('250kg Bituminous Patch Mix, Surface Primer');
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState(SAMPLE_RESOLUTION_PHOTOS[0].url);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  const [progressReport, setProgressReport] = useState<CivicReport | null>(null);
  const [progressNote, setProgressNote] = useState('');
  const [delayReason, setDelayReason] = useState('');

  // My tasks
  const myTasks = reports.filter(r => r.assignedStaff?.id === currentUser.id || r.assignedStaff?.name === currentUser.name);
  const assignedNew = myTasks.filter(r => r.status === 'assigned');
  const inProgress = myTasks.filter(r => r.status === 'in_progress');
  const awaitingVerification = myTasks.filter(r => r.status === 'awaiting_verification');
  const completed = myTasks.filter(r => r.status === 'resolved' || r.status === 'closed');

  const filteredTasks = myTasks.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const handleStartWork = (rep: CivicReport) => {
    civicStore.updateFieldProgress({
      reportId: rep.id,
      newStatus: 'in_progress',
      notes: 'Field crew arrived on site. Perimeter secured with safety barriers and work initiated.'
    });
    alert(`Work started on ${rep.reportNumber}. Citizen and dispatcher notified.`);
  };

  const handleProgressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progressReport) return;
    civicStore.updateFieldProgress({
      reportId: progressReport.id,
      newStatus: delayReason ? 'on_hold' : 'in_progress',
      notes: progressNote.trim() || 'Work ongoing.',
      delayReason: delayReason.trim() || undefined
    });
    alert(`Progress note logged for ${progressReport.reportNumber}.`);
    setProgressReport(null);
    setProgressNote('');
    setDelayReason('');
  };

  const handleResolutionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionReport) return;
    const finalPhoto = customPhotoUrl.trim() || selectedPhotoUrl;
    civicStore.submitFieldResolution({
      reportId: resolutionReport.id,
      workPerformed: workNotes.trim() || 'Repairs completed according to municipal engineering standards.',
      materialsUsed: materialsUsed.trim() || undefined,
      afterPhotoUrl: finalPhoto
    });
    alert(`Resolution evidence submitted for ${resolutionReport.reportNumber}. Awaiting supervisor sign-off.`);
    setResolutionReport(null);
    setWorkNotes('');
  };

  return (
    <div className="bg-[#F2F0EB] min-h-screen text-[#23282B]">
      {/* Top Banner (Graphite + Safety Orange + Warm Gray palette) */}
      <div className="bg-[#30363A] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-14 h-14 rounded-full border-2 border-[#F28C45] object-cover shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                  {currentUser.name}
                </h1>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F28C45]/20 text-[#F28C45] border border-[#F28C45]/40 font-bold">
                  Rapid Response Lead
                </span>
              </div>
              <p className="text-stone-300 text-xs sm:text-sm mt-0.5">
                {currentUser.departmentName || 'Road & Bridge Maintenance'} &bull; Mobile Field Workstation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-stone-900/60 p-3 rounded-2xl border border-stone-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F28C45] animate-pulse" />
            <span>Field Telemetry Online &bull; Active Shift</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-4 mb-6 border-b border-stone-300">
          {[
            { id: 'my_work', label: `My Work Orders (${myTasks.length})` },
            { id: 'assignment_map', label: 'Route & Location Map' },
            { id: 'history', label: `Completed Work History (${completed.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#30363A] text-white shadow-md'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: MY WORK */}
        {activeTab === 'my_work' && (
          <div className="space-y-6">
            {/* Quick Stat Blocks */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-300 shadow-sm">
                <span className="text-xs font-mono uppercase text-stone-500 font-bold">New Dispatches</span>
                <div className="font-mono text-3xl font-extrabold text-amber-600 mt-1">{assignedNew.length}</div>
                <div className="text-[11px] text-stone-400 mt-1">Pending arrival on site</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-300 shadow-sm">
                <span className="text-xs font-mono uppercase text-orange-600 font-bold">In Active Progress</span>
                <div className="font-mono text-3xl font-extrabold text-[#F28C45] mt-1">{inProgress.length}</div>
                <div className="text-[11px] text-stone-400 mt-1">Repairs underway</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-300 shadow-sm">
                <span className="text-xs font-mono uppercase text-yellow-600 font-bold">Awaiting Verification</span>
                <div className="font-mono text-3xl font-extrabold text-yellow-700 mt-1">{awaitingVerification.length}</div>
                <div className="text-[11px] text-stone-400 mt-1">Evidence submitted</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-300 shadow-sm">
                <span className="text-xs font-mono uppercase text-emerald-600 font-bold">Certified Complete</span>
                <div className="font-mono text-3xl font-extrabold text-emerald-700 mt-1">{completed.length}</div>
                <div className="text-[11px] text-stone-400 mt-1">Approved & closed</div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['all', 'assigned', 'in_progress', 'awaiting_verification', 'resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition cursor-pointer ${
                    filterStatus === st
                      ? 'bg-[#F28C45] text-stone-950 shadow-sm'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-300'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Task Cards Grid */}
            {filteredTasks.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-stone-300 text-stone-400 text-xs">
                No tasks match the active status filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-3xl p-6 border border-stone-300 shadow-md flex flex-col justify-between space-y-4 hover:border-[#F28C45] transition"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#30363A]">{task.reportNumber}</span>
                          <StatusBadge status={task.status} size="sm" />
                          <PriorityBadge priority={task.priority} />
                        </div>
                        {task.targetCompletionDate && (
                          <span className="text-[10px] font-mono text-stone-500">
                            Due: {new Date(task.targetCompletionDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading font-bold text-base text-stone-900 mb-2">
                        {task.title}
                      </h3>

                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1.5 mb-3">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#F28C45] shrink-0 mt-0.5" />
                          <span className="font-medium text-stone-900">{task.location.address}</span>
                        </div>
                        {task.location.landmark && (
                          <div className="text-[11px] text-stone-500 pl-5">Near: {task.location.landmark}</div>
                        )}
                      </div>

                      {task.assignmentInstructions && (
                        <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 mb-3">
                          <strong className="block text-[10px] uppercase tracking-wider text-amber-800 mb-0.5">
                            Supervisor Instructions:
                          </strong>
                          {task.assignmentInstructions}
                        </div>
                      )}

                      {/* Initial Citizen Photo Thumbnail */}
                      {task.evidence.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                          <img
                            src={task.evidence[0].url}
                            alt="Site evidence"
                            className="w-16 h-12 object-cover rounded-lg border border-stone-300"
                          />
                          <span className="text-[11px] line-clamp-2">{task.evidence[0].caption}</span>
                        </div>
                      )}
                    </div>

                    {/* Operational Action Cluster */}
                    <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => onOpenReportDetail(task)}
                        className="text-xs font-bold text-stone-600 hover:text-stone-900"
                      >
                        Inspect Full Dossier &rarr;
                      </button>

                      <div className="flex items-center gap-2">
                        {task.status === 'assigned' && (
                          <button
                            onClick={() => handleStartWork(task)}
                            className="px-4 py-2 rounded-xl bg-[#F28C45] hover:bg-[#d97532] text-stone-950 font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-md cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Log Arrival & Start</span>
                          </button>
                        )}

                        {task.status === 'in_progress' && (
                          <>
                            <button
                              onClick={() => {
                                setProgressReport(task);
                              }}
                              className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition cursor-pointer"
                            >
                              Log Update
                            </button>
                            <button
                              onClick={() => {
                                setResolutionReport(task);
                              }}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-md cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>Submit Resolution</span>
                            </button>
                          </>
                        )}

                        {task.status === 'awaiting_verification' && (
                          <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Awaiting Supervisor Review</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ASSIGNMENT MAP */}
        {activeTab === 'assignment_map' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-300 shadow-md">
            <div className="mb-4">
              <h3 className="font-heading font-bold text-lg text-stone-900">
                Field Crew Dispatched Incident Map
              </h3>
              <p className="text-xs text-stone-500">
                Locations of assigned work orders requiring physical intervention.
              </p>
            </div>
            <InteractiveMap
              reports={myTasks}
              onSelectReport={(rep) => onOpenReportDetail(rep)}
              height="520px"
            />
          </div>
        )}

        {/* TAB 3: WORK HISTORY */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-300 shadow-md">
            <h3 className="font-heading font-bold text-lg text-stone-900 mb-4">
              Certified Completed Work Orders
            </h3>
            <div className="space-y-3">
              {completed.map((task) => (
                <div key={task.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-stone-600">{task.reportNumber}</span>
                    <h4 className="font-bold text-sm text-stone-900">{task.title}</h4>
                    <p className="text-xs text-stone-500">{task.location.address}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Certified by Supervisor
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESOLUTION EVIDENCE SUBMISSION MODAL */}
        {resolutionReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
            <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-stone-200 text-stone-900 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setResolutionReport(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-heading font-bold text-xl text-stone-900 mb-1">
                Submit Resolution Evidence
              </h3>
              <p className="text-xs text-stone-500 mb-4 font-mono">
                {resolutionReport.reportNumber}: {resolutionReport.title}
              </p>

              <form onSubmit={handleResolutionSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Work Performed Summary *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={workNotes}
                    onChange={(e) => setWorkNotes(e.target.value)}
                    placeholder="Describe specific restoration actions taken, compaction measurements, or replacement parts..."
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Materials & Equipment Deployed
                  </label>
                  <input
                    type="text"
                    value={materialsUsed}
                    onChange={(e) => setMaterialsUsed(e.target.value)}
                    placeholder="e.g. 250kg Hot Bitumen Mix, Class 2 Barriers"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  />
                </div>

                {/* Evidence photo selection */}
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-2">
                    Attach "After Repair" Photographic Evidence *
                  </label>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {SAMPLE_RESOLUTION_PHOTOS.map((p, idx) => (
                      <div
                        key={idx}
                        onClick={() => { setSelectedPhotoUrl(p.url); setCustomPhotoUrl(''); }}
                        className={`rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                          selectedPhotoUrl === p.url && !customPhotoUrl
                            ? 'border-[#F28C45] ring-2 ring-[#F28C45]/30'
                            : 'border-stone-200'
                        }`}
                      >
                        <img src={p.url} alt={p.label} className="w-full h-24 object-cover" />
                        <div className="p-1 text-[10px] text-stone-700 font-semibold truncate bg-white">
                          {p.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <input
                    type="url"
                    placeholder="Or enter direct image URL..."
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    className="w-full p-2 rounded-xl border border-stone-300 text-xs text-stone-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md cursor-pointer mt-2"
                >
                  Submit For Supervisor Sign-off
                </button>
              </form>
            </div>
          </div>
        )}

        {/* PROGRESS NOTE MODAL */}
        {progressReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative border border-stone-200 text-stone-900">
              <button
                onClick={() => setProgressReport(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-heading font-bold text-lg text-stone-900 mb-1">
                Log Field Status Update
              </h3>
              <p className="text-xs text-stone-500 mb-4 font-mono">
                {progressReport.reportNumber}
              </p>

              <form onSubmit={handleProgressSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    On-Site Work Notes
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={progressNote}
                    onChange={(e) => setProgressNote(e.target.value)}
                    placeholder="e.g. Utility conduits verified safe; waiting on delivery of concrete cure mix..."
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Delay / On Hold Reason (Optional)
                  </label>
                  <input
                    type="text"
                    value={delayReason}
                    onChange={(e) => setDelayReason(e.target.value)}
                    placeholder="e.g. Inclement weather or secondary gas permit required"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#30363A] hover:bg-stone-900 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Save Log Entry
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
