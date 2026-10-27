import React, { useState } from 'react';
import {
  Wrench,
  LayoutDashboard,
  CheckSquare,
  MapPin,
  Clock,
  Camera,
  History,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Play,
  Upload,
  Pause,
  Send,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, CivicReport } from '../../types/civic';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { InteractiveMap } from '../common/InteractiveMap';
import { civicStore } from '../../services/store';

interface FieldStaffWorkspaceProps {
  currentUser: UserProfile;
  currentSubpath: string;
  reports: CivicReport[];
  onNavigate: (path: string) => void;
  onSignOut: () => void;
  onOpenReportDetail: (report: CivicReport) => void;
}

const SAMPLE_RESOLUTION_PHOTOS = [
  { label: 'Fresh Bitumen Asphalt Patch (Level & Compacted)', url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80' },
  { label: 'Cleared Stormwater Grate with Free Water Inflow', url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80' },
  { label: 'New High-Output LED Fixture Pole Replacement', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80' },
  { label: 'Sanitized & Emptied Heavy Recycling Container', url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80' }
];

export const FieldStaffWorkspace: React.FC<FieldStaffWorkspaceProps> = ({
  currentUser,
  currentSubpath,
  reports,
  onNavigate,
  onSignOut,
  onOpenReportDetail
}) => {
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const myTasks = reports.filter(r => r.assignedStaff?.id === currentUser.id || r.assignedStaff?.name === currentUser.name);

  // Updating form states for Progress Updates
  const [selectedTaskId, setSelectedTaskId] = useState(myTasks[0]?.id || '');
  const [targetStatus, setTargetStatus] = useState<'in_progress' | 'on_hold'>('in_progress');
  const [progressNotes, setProgressNotes] = useState('Crew arrived on site with safety perimeter established.');
  const [delayReason, setDelayReason] = useState('');

  // Updating form states for Evidence Upload
  const [evidenceTaskId, setEvidenceTaskId] = useState(myTasks[0]?.id || '');
  const [workDoneText, setWorkDoneText] = useState('Excavated fractured asphalt edges, applied bitumen tack coat, and compacted 250kg hot mix.');
  const [materialsText, setMaterialsText] = useState('250kg Hot Bitumen Asphalt Mix, Class 2 Safety Barriers');
  const [selectedPhoto, setSelectedPhoto] = useState(SAMPLE_RESOLUTION_PHOTOS[0].url);
  const [customPhoto, setCustomPhoto] = useState('');

  const assignedTasks = myTasks.filter(r => r.status === 'assigned');
  const inProgressTasks = myTasks.filter(r => r.status === 'in_progress');
  const awaitingTasks = myTasks.filter(r => r.status === 'awaiting_verification');
  const completedTasks = myTasks.filter(r => r.status === 'resolved' || r.status === 'closed');

  const handleStartWork = (rep: CivicReport) => {
    civicStore.updateFieldProgress({
      reportId: rep.id,
      newStatus: 'in_progress',
      notes: 'Field crew arrived on site. Safety barriers deployed and work commenced.'
    });
    alert(`Work started on ${rep.reportNumber}. Triage supervisor and citizen notified.`);
  };

  const handleProgressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId) {
      alert('Please choose a task to update.');
      return;
    }
    civicStore.updateFieldProgress({
      reportId: selectedTaskId,
      newStatus: targetStatus,
      notes: progressNotes.trim(),
      delayReason: targetStatus === 'on_hold' ? delayReason.trim() : undefined
    });
    alert(`Progress update logged for selected ticket.`);
    onNavigate('/field-staff/work');
  };

  const handleResolutionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTaskId) {
      alert('Please choose a task.');
      return;
    }
    const finalPhoto = customPhoto.trim() || selectedPhoto;
    civicStore.submitFieldResolution({
      reportId: evidenceTaskId,
      workPerformed: workDoneText.trim(),
      materialsUsed: materialsText.trim(),
      afterPhotoUrl: finalPhoto
    });
    alert(`Resolution evidence submitted for supervisor verification!`);
    onNavigate('/field-staff/work');
  };

  const NAV_ITEMS = [
    { path: '/field-staff/dashboard', label: 'Shift Overview', icon: LayoutDashboard },
    { path: '/field-staff/work', label: `My Work Orders (${myTasks.length})`, icon: CheckSquare },
    { path: '/field-staff/map', label: 'Incident Route Map', icon: MapPin },
    { path: '/field-staff/progress', label: 'Progress Updates', icon: Clock },
    { path: '/field-staff/evidence', label: 'Resolution Evidence', icon: Camera },
    { path: '/field-staff/history', label: `Work History (${completedTasks.length})`, icon: History },
    { path: '/field-staff/notifications', label: 'Field Notifications', icon: Bell },
    { path: '/field-staff/profile', label: 'Technician Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-[#F2F0EB] text-[#23282B] flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-[#30363A] text-white h-16 px-4 sm:px-6 flex items-center justify-between border-b border-stone-800 shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileSidebar(!mobileSidebar)} className="md:hidden p-2 text-white hover:bg-stone-700 rounded-lg">
            {mobileSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div onClick={() => onNavigate('/field-staff/dashboard')} className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-[#F28C45] text-stone-950 font-black text-base flex items-center justify-center">
              CS
            </div>
            <span className="font-heading font-extrabold text-base text-white tracking-tight flex items-center gap-2">
              CivicSync
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#F28C45]/20 text-[#F28C45] font-bold">
                Field Staff
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-300 font-mono">
            <span>{currentUser.name}</span>
            <span className="text-stone-500">&bull;</span>
            <span className="text-[#F28C45] font-bold">Rapid Response Crew</span>
          </div>
          <button onClick={onSignOut} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/20 text-rose-200 border border-rose-300/30 text-xs font-semibold">
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <aside className={`fixed md:sticky top-16 z-30 w-64 h-[calc(100vh-4rem)] bg-white border-r border-stone-300 p-4 flex flex-col justify-between transition-transform duration-200 ${mobileSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono uppercase text-stone-400 font-bold tracking-wider">
              Field Operations
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
                    isActive ? 'bg-[#30363A] text-white shadow-sm' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-[11px] text-stone-500 font-mono">
            <div>Mobile Crew Lead</div>
            <div className="text-[#F28C45] text-[10px] font-bold">Shift Status: Active</div>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* 1. DASHBOARD OVERVIEW */}
          {currentSubpath === '/field-staff/dashboard' && (
            <div className="space-y-6">
              <div className="bg-[#30363A] text-white p-6 sm:p-8 rounded-3xl shadow-md flex justify-between items-center">
                <div>
                  <span className="text-xs font-mono uppercase text-[#F28C45] font-bold">Field Workstation</span>
                  <h1 className="font-heading text-2xl sm:text-3xl font-extrabold mt-1">{currentUser.name}</h1>
                  <p className="text-stone-300 text-xs mt-0.5">{currentUser.departmentName || 'Road Infrastructure Maintenance'}</p>
                </div>
                <button
                  onClick={() => onNavigate('/field-staff/work')}
                  className="px-5 py-2.5 rounded-xl bg-[#F28C45] text-stone-950 font-extrabold text-xs uppercase"
                >
                  View Tasks &rarr;
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-stone-300 shadow-sm">
                  <span className="text-xs font-mono uppercase text-stone-500 font-bold">New Dispatches</span>
                  <div className="font-mono text-3xl font-extrabold text-amber-600 mt-1">{assignedTasks.length}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-stone-300 shadow-sm">
                  <span className="text-xs font-mono uppercase text-orange-600 font-bold">In Progress</span>
                  <div className="font-mono text-3xl font-extrabold text-[#F28C45] mt-1">{inProgressTasks.length}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-stone-300 shadow-sm">
                  <span className="text-xs font-mono uppercase text-yellow-600 font-bold">Awaiting Sign-off</span>
                  <div className="font-mono text-3xl font-extrabold text-yellow-700 mt-1">{awaitingTasks.length}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-stone-300 shadow-sm">
                  <span className="text-xs font-mono uppercase text-emerald-600 font-bold">Certified Done</span>
                  <div className="font-mono text-3xl font-extrabold text-emerald-700 mt-1">{completedTasks.length}</div>
                </div>
              </div>
            </div>
          )}

          {/* 2. MY WORK QUEUE */}
          {currentSubpath === '/field-staff/work' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-300 shadow-md space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-stone-200">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-stone-900">Assigned Work Orders</h1>
                  <p className="text-xs text-stone-500">Active tickets requiring physical repair and photographic proof.</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#F28C45]">{myTasks.length} Assigned</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myTasks.map((task) => (
                  <div key={task.id} className="p-5 rounded-2xl border border-stone-300 bg-stone-50/50 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-stone-800">{task.reportNumber}</span>
                          <StatusBadge status={task.status} size="sm" />
                          <PriorityBadge priority={task.priority} />
                        </div>
                        {task.targetCompletionDate && (
                          <span className="text-[10px] font-mono text-stone-500">
                            Due: {new Date(task.targetCompletionDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-base text-stone-900">{task.title}</h4>
                      <p className="text-xs text-stone-600 flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#F28C45]" />
                        <span>{task.location.address}</span>
                      </p>

                      {task.assignmentInstructions && (
                        <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-900 mt-2">
                          <strong>Directive:</strong> {task.assignmentInstructions}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                      {task.status === 'assigned' && (
                        <button
                          onClick={() => handleStartWork(task)}
                          className="px-4 py-2 rounded-xl bg-[#F28C45] text-stone-950 font-bold text-xs uppercase"
                        >
                          Log Arrival &amp; Start
                        </button>
                      )}
                      {task.status === 'in_progress' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedTaskId(task.id);
                              onNavigate('/field-staff/progress');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold"
                          >
                            Update Progress
                          </button>
                          <button
                            onClick={() => {
                              setEvidenceTaskId(task.id);
                              onNavigate('/field-staff/evidence');
                            }}
                            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase"
                          >
                            Submit Resolution
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. ASSIGNMENT MAP */}
          {currentSubpath === '/field-staff/map' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-300 shadow-md space-y-4">
              <h1 className="font-heading text-2xl font-bold text-stone-900">Incident Route &amp; GIS Map</h1>
              <p className="text-xs text-stone-500">Spatial visualization of assigned field tasks.</p>
              <InteractiveMap reports={myTasks} height="540px" />
            </div>
          )}

          {/* 4. PROGRESS UPDATES PAGE (Teal + Warm Gray) - DEDICATED UPDATE WORKFLOW! */}
          {currentSubpath === '/field-staff/progress' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-200 shadow-md max-w-2xl space-y-6">
              <div>
                <h1 className="font-heading text-2xl font-bold text-stone-900">Field Progress Update</h1>
                <p className="text-xs text-stone-500">Record on-site repair progress, log arrival status, or document delays.</p>
              </div>

              <form onSubmit={handleProgressSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Select Work Order *</label>
                  <select
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  >
                    {myTasks.map((t) => (
                      <option key={t.id} value={t.id}>{t.reportNumber}: {t.title} ({t.status})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Target Status *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTargetStatus('in_progress')}
                      className={`p-3 rounded-xl border text-center font-bold ${
                        targetStatus === 'in_progress' ? 'bg-orange-100 border-[#F28C45] text-orange-950' : 'border-stone-200'
                      }`}
                    >
                      In Progress (Active On Site)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetStatus('on_hold')}
                      className={`p-3 rounded-xl border text-center font-bold ${
                        targetStatus === 'on_hold' ? 'bg-amber-100 border-amber-500 text-amber-950' : 'border-stone-200'
                      }`}
                    >
                      On Hold (Temporary Delay)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">On-Site Work Notes *</label>
                  <textarea
                    rows={4}
                    required
                    value={progressNotes}
                    onChange={(e) => setProgressNotes(e.target.value)}
                    placeholder="Enter details of excavation, materials applied, or current status..."
                    className="w-full p-3 rounded-xl border border-stone-300 text-stone-900"
                  />
                </div>

                {targetStatus === 'on_hold' && (
                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Delay Reason (Required if On Hold)</label>
                    <input
                      type="text"
                      required
                      value={delayReason}
                      onChange={(e) => setDelayReason(e.target.value)}
                      placeholder="e.g. Inclement rain / awaiting asphalt delivery"
                      className="w-full p-2.5 rounded-xl border border-amber-300 text-stone-900"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#30363A] hover:bg-black text-white font-bold uppercase tracking-wider transition"
                >
                  Save &amp; Transmit Progress Update
                </button>
              </form>
            </div>
          )}

          {/* 5. EVIDENCE UPLOADS PAGE (Green + Sand) - DEDICATED RESOLUTION WORKFLOW! */}
          {currentSubpath === '/field-staff/evidence' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-md max-w-3xl space-y-6">
              <div>
                <h1 className="font-heading text-2xl font-bold text-stone-900">Submit Resolution Evidence</h1>
                <p className="text-xs text-stone-500">Upload photographic proof and document materials before supervisor sign-off.</p>
              </div>

              <form onSubmit={handleResolutionSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Select Completed Task *</label>
                  <select
                    value={evidenceTaskId}
                    onChange={(e) => setEvidenceTaskId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  >
                    {myTasks.map((t) => (
                      <option key={t.id} value={t.id}>{t.reportNumber}: {t.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Summary of Work Performed *</label>
                  <textarea
                    rows={3}
                    required
                    value={workDoneText}
                    onChange={(e) => setWorkDoneText(e.target.value)}
                    placeholder="Describe specific restoration actions taken on site..."
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Materials Deployed</label>
                  <input
                    type="text"
                    value={materialsText}
                    onChange={(e) => setMaterialsText(e.target.value)}
                    placeholder="e.g. 250kg Bitumen Asphalt Mix, Class 2 Barriers"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-2">Attach "After Repair" Photographic Evidence *</label>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {SAMPLE_RESOLUTION_PHOTOS.map((p, idx) => (
                      <div
                        key={idx}
                        onClick={() => { setSelectedPhoto(p.url); setCustomPhoto(''); }}
                        className={`rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                          selectedPhoto === p.url && !customPhoto ? 'border-[#F28C45] ring-2 ring-[#F28C45]/30' : 'border-stone-200'
                        }`}
                      >
                        <img src={p.url} alt={p.label} className="w-full h-28 object-cover" />
                        <div className="p-1.5 text-[10px] font-semibold text-stone-800 bg-white truncate">{p.label}</div>
                      </div>
                    ))}
                  </div>

                  <input
                    type="url"
                    placeholder="Or enter direct image URL..."
                    value={customPhoto}
                    onChange={(e) => setCustomPhoto(e.target.value)}
                    className="w-full p-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider transition shadow-md"
                >
                  Submit For Supervisor Sign-off
                </button>
              </form>
            </div>
          )}

          {/* 6. WORK HISTORY */}
          {currentSubpath === '/field-staff/history' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-300 shadow-md space-y-4">
              <h1 className="font-heading text-2xl font-bold text-stone-900">Certified Work History</h1>
              <div className="space-y-3">
                {completedTasks.map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex justify-between items-center">
                    <div>
                      <span className="font-mono text-xs font-bold text-stone-600">{t.reportNumber}</span>
                      <h4 className="font-bold text-sm text-stone-900">{t.title}</h4>
                      <p className="text-xs text-stone-500">{t.location.address}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      Supervisor Certified
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. NOTIFICATIONS */}
          {currentSubpath === '/field-staff/notifications' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-300 shadow-md space-y-4">
              <h1 className="font-heading text-2xl font-bold text-stone-900">Field Dispatch Alerts</h1>
              <p className="text-xs text-stone-500">Real-time alerts regarding new task dispatches and supervisor feedback.</p>
            </div>
          )}

          {/* 8. PROFILE */}
          {currentSubpath === '/field-staff/profile' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-300 shadow-md max-w-2xl space-y-4 text-xs">
              <h1 className="font-heading text-2xl font-bold text-stone-900">Field Technician Profile</h1>
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Name</label>
                <input type="text" readOnly value={currentUser.name} className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50" />
              </div>
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Email</label>
                <input type="text" readOnly value={currentUser.email} className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50" />
              </div>
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Department</label>
                <input type="text" readOnly value={currentUser.departmentName || 'Rapid Response'} className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50" />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
