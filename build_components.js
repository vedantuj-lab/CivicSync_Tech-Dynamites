const fs = require('fs');

const landingCode = `import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Shield,
  MapPin,
  Clock,
  CheckCircle2,
  Building2,
  Search,
  ChevronRight,
  FileCheck2,
  Eye
} from 'lucide-react';
import { PublicAlert, CivicReport, IssueCategory } from '../../types/civic';
import { SeverityBadge } from '../common/Badge';
import { DEMO_USERS } from '../../services/store';

interface LandingPageProps {
  alerts: PublicAlert[];
  reports: CivicReport[];
  categories: IssueCategory[];
  onNavigate: (view: string, filter?: string) => void;
  onSelectAlert: (alert: PublicAlert) => void;
  onSelectReport: (report: CivicReport) => void;
  onQuickSwitchUser: (userId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  alerts,
  reports,
  categories,
  onNavigate,
  onSelectAlert,
  onQuickSwitchUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const publishedAlerts = alerts.filter((a) => a.publicationStatus === 'published');
  const resolvedIssues = reports.filter((r) => r.status === 'resolved' || r.status === 'closed');

  const filteredAlerts = publishedAlerts.filter((a) => {
    return (
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.affectedArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="bg-[#171A19] text-[#F8F7F2] min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b border-stone-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-[#C8F169]/10 via-[#176B52]/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/90 border border-stone-700 text-xs text-stone-300 mb-6 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#C8F169] animate-ping" />
              <span className="font-mono text-[#C8F169] font-semibold">CivicSync Unified Grid</span>
              <span className="text-stone-500">&bull;</span>
              <span>Central Municipal Operations</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.12]">
              One Alert. One Source. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8F169] via-[#9ADBC0] to-emerald-300">
                A Safer Community.
              </span>
            </h1>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed mb-8 font-light">
              Unify official public safety alerts with transparent civic issue reporting. Report neighborhood hazards, inspect live emergency broadcasts, and monitor verified field resolutions from start to finish.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('report_issue')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#C8F169] text-[#171A19] font-bold text-sm hover:bg-[#b5e057] transition shadow-lg shadow-[#C8F169]/20 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Report a Civic Issue</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('public_alerts')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 font-semibold text-sm hover:border-stone-500 hover:bg-stone-800 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>View Official Alerts ({publishedAlerts.length})</span>
              </button>

              <button
                onClick={() => onNavigate('public_map')}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-stone-900/60 border border-stone-800 text-stone-400 font-medium text-sm hover:text-stone-200 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Explore City Map</span>
              </button>
            </div>
          </div>

          {/* 2. PUBLIC IMPACT INDICATORS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 bg-stone-900/80 backdrop-blur-md p-6 rounded-2xl border border-stone-800 shadow-xl">
            <div className="text-center p-3 border-r border-stone-800/80 last:border-r-0">
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#C8F169]">
                {1420 + resolvedIssues.length}
              </div>
              <div className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-semibold">
                Verified Resolutions
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">Audited & certified</div>
            </div>

            <div className="text-center p-3 border-r border-stone-800/80 last:border-r-0">
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#9ADBC0]">
                98.6%
              </div>
              <div className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-semibold">
                SLA Compliance Rate
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">Within target hours</div>
            </div>

            <div className="text-center p-3 border-r border-stone-800/80 last:border-r-0">
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-400">
                &lt; 2.4 hrs
              </div>
              <div className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-semibold">
                Average Dispatch Time
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">From triage to crew</div>
            </div>

            <div className="text-center p-3">
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white">
                3
              </div>
              <div className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-semibold">
                Coordinated Agencies
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">Public Works, Water, Safety</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LATEST OFFICIAL PUBLIC ALERTS */}
      <section className="py-16 bg-[#171A19] border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#C8F169] mb-1">
                <span className="w-2 h-2 rounded-full bg-[#C8F169]" />
                Emergency & Public Information Desk
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Active Public Alerts & Advisories
              </h2>
              <p className="text-stone-400 text-sm mt-1">
                Real-time official broadcasts issued directly by authorized municipal response directors.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  placeholder="Search alert by keyword or area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-lg bg-stone-900 border border-stone-700 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#C8F169] w-64"
                />
              </div>
              <button
                onClick={() => onNavigate('public_alerts')}
                className="px-4 py-2 rounded-lg bg-stone-900 border border-stone-700 text-xs font-medium text-stone-200 hover:text-white hover:border-stone-500 transition cursor-pointer"
              >
                All Alerts &rarr;
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredAlerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="bg-stone-900/90 rounded-2xl border border-stone-800 p-6 flex flex-col justify-between hover:border-stone-700 transition shadow-lg group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <SeverityBadge severity={alert.severity} />
                    <span className="text-[11px] font-mono text-stone-500">{alert.alertNumber}</span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-white group-hover:text-[#C8F169] transition mb-2">
                    {alert.title}
                  </h3>

                  <p className="text-stone-400 text-xs line-clamp-3 leading-relaxed mb-4">
                    {alert.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-stone-400 border-t border-stone-800/80 pt-3 mb-4">
                    <div className="flex items-center gap-2 text-stone-300">
                      <MapPin className="w-3.5 h-3.5 text-[#C8F169] shrink-0" />
                      <span className="truncate">{alert.affectedArea}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-400">
                      <Building2 className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      <span className="truncate">{alert.issuingOrgName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-800/60">
                  <span className="text-[10px] text-stone-500 font-mono">
                    Published: {new Date(alert.publishedAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => onSelectAlert(alert)}
                    className="text-xs font-semibold text-[#C8F169] hover:text-white transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Advisory</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW CIVICSYNC WORKS */}
      <section className="py-20 bg-[#121413] border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase text-[#C8F169] tracking-wider">
              System Architecture
            </span>
            <h2 className="font-heading text-3xl font-bold text-white mt-1 mb-3">
              How Issues Move from Report to Resolution
            </h2>
            <p className="text-stone-400 text-sm">
              Deterministic workflow built on immutable audit records, automated SLA alerts, and direct citizen verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-stone-900/60 rounded-2xl border border-stone-800 p-8">
              <div className="w-12 h-12 rounded-xl bg-[#176B52]/30 border border-[#176B52] text-[#9ADBC0] font-mono font-bold text-lg flex items-center justify-center mb-6">
                01
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-2">
                1. Citizen Reports or Stays Informed
              </h3>
              <p className="text-stone-400 text-xs leading-relaxed mb-4">
                Citizens submit geo-located reports with photographic evidence, category tagging, and severity indicators. Alternatively, stay informed with real-time official alerts.
              </p>
              <ul className="space-y-2 text-xs text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C8F169]" />
                  <span>Interactive map coordinate placement</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C8F169]" />
                  <span>Automated tracking code generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C8F169]" />
                  <span>Instant duplicate submission detection</span>
                </li>
              </ul>
            </div>

            <div className="bg-stone-900/60 rounded-2xl border border-stone-800 p-8">
              <div className="w-12 h-12 rounded-xl bg-[#762E42]/30 border border-[#762E42] text-[#E9A7B2] font-mono font-bold text-lg flex items-center justify-center mb-6">
                02
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-2">
                2. Department Triage & Field Dispatch
              </h3>
              <p className="text-stone-400 text-xs leading-relaxed mb-4">
                Municipal operations directors review inbound reports, confirm legitimacy, verify jurisdictional responsibility, and dispatch specialized field response crews with target SLA timelines.
              </p>
              <ul className="space-y-2 text-xs text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E9A7B2]" />
                  <span>Departmental routing (Roads, Water, Lighting)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E9A7B2]" />
                  <span>SLA target dates and priority assignments</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E9A7B2]" />
                  <span>Supervisor task instructions to crews</span>
                </li>
              </ul>
            </div>

            <div className="bg-stone-900/60 rounded-2xl border border-stone-800 p-8">
              <div className="w-12 h-12 rounded-xl bg-[#F28C45]/30 border border-[#F28C45] text-[#F28C45] font-mono font-bold text-lg flex items-center justify-center mb-6">
                03
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-2">
                3. Evidence Resolution & Citizen Sign-off
              </h3>
              <p className="text-stone-400 text-xs leading-relaxed mb-4">
                Field personnel execute repairs, upload before-and-after photo verification, and document materials used. The department director verifies compliance, and the citizen confirms resolution.
              </p>
              <ul className="space-y-2 text-xs text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F28C45]" />
                  <span>Before-and-after photographic documentation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F28C45]" />
                  <span>Supervisor verification checkpoint</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F28C45]" />
                  <span>Citizen dispute or satisfaction confirmation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CIVIC ISSUE CATEGORIES */}
      <section className="py-20 bg-[#171A19] border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase text-[#C8F169] tracking-wider">
              Supported Domains
            </span>
            <h2 className="font-heading text-3xl font-bold text-white mt-1 mb-3">
              Civic Infrastructure Categories
            </h2>
            <p className="text-stone-400 text-sm">
              Select any category to view active community reports or initiate an expedited ticket with the assigned agency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const count = reports.filter((r) => r.categoryId === cat.id).length;
              return (
                <div
                  key={cat.id}
                  onClick={() => onNavigate('report_issue', cat.id)}
                  className="bg-stone-900/80 rounded-2xl border border-stone-800 p-6 hover:border-[#C8F169]/50 hover:bg-stone-800/60 transition cursor-pointer group shadow-md"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-stone-800 text-[#C8F169] flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                      {cat.name.slice(0, 1)}
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-400">
                      SLA: {cat.slaHours}h target
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-white group-hover:text-[#C8F169] transition mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-stone-400 text-xs leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-800/80 text-xs">
                    <span className="text-stone-500 font-mono">{count} active reports</span>
                    <span className="text-[#C8F169] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Report issue &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. ROLE-BASED TRIAL / DEMO ENTRY POINTS */}
      <section className="py-20 bg-[#121413] border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase text-[#C8F169] tracking-wider">
              Role-Based Architecture
            </span>
            <h2 className="font-heading text-3xl font-bold text-white mt-1 mb-3">
              Explore CivicSync Across All 4 Dedicated Personas
            </h2>
            <p className="text-stone-400 text-sm">
              CivicSync provisions specialized workspaces tailored for every stakeholder in municipal governance. Click any profile below to launch an instant live session.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Citizen Persona */}
            <div className="bg-[#176B52]/10 border border-[#176B52]/40 rounded-2xl p-6 flex flex-col justify-between hover:border-[#176B52] transition shadow-lg">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={DEMO_USERS[0].avatarUrl}
                    alt={DEMO_USERS[0].name}
                    className="w-12 h-12 rounded-full border-2 border-[#176B52] object-cover"
                  />
                  <div>
                    <h3 className="font-heading font-bold text-sm text-white">{DEMO_USERS[0].name}</h3>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#176B52]/30 text-[#9ADBC0]">
                      Citizen Resident
                    </span>
                  </div>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed mb-4">
                  Submit geo-tagged issues, upload photos, track resolution timeline in real-time, view local alerts, and confirm work completion.
                </p>
                <div className="text-[11px] text-stone-400 space-y-1 mb-4">
                  <div>&bull; Multi-step guided reporting form</div>
                  <div>&bull; Interactive map coordinate picker</div>
                  <div>&bull; Personal tracking dashboard</div>
                </div>
              </div>
              <button
                onClick={() => onQuickSwitchUser(DEMO_USERS[0].id)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#176B52] hover:bg-[#125541] text-white font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Launch Citizen Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Org Admin Persona */}
            <div className="bg-[#762E42]/10 border border-[#762E42]/40 rounded-2xl p-6 flex flex-col justify-between hover:border-[#762E42] transition shadow-lg">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={DEMO_USERS[1].avatarUrl}
                    alt={DEMO_USERS[1].name}
                    className="w-12 h-12 rounded-full border-2 border-[#762E42] object-cover"
                  />
                  <div>
                    <h3 className="font-heading font-bold text-sm text-white">Director Marcus Vance</h3>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#762E42]/30 text-[#E9A7B2]">
                      Org Administrator
                    </span>
                  </div>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed mb-4">
                  Review new submissions, inspect duplicate matching, assign staff with SLA dates, publish official public alerts, and verify work sign-off.
                </p>
                <div className="text-[11px] text-stone-400 space-y-1 mb-4">
                  <div>&bull; Command Center & Review Queue</div>
                  <div>&bull; Staff assignment & instructions</div>
                  <div>&bull; Before/after photo verification</div>
                </div>
              </div>
              <button
                onClick={() => onQuickSwitchUser(DEMO_USERS[1].id)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#762E42] hover:bg-[#5e2535] text-white font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Launch Operations Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Field Staff Persona */}
            <div className="bg-[#F28C45]/10 border border-[#F28C45]/40 rounded-2xl p-6 flex flex-col justify-between hover:border-[#F28C45] transition shadow-lg">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={DEMO_USERS[2].avatarUrl}
                    alt={DEMO_USERS[2].name}
                    className="w-12 h-12 rounded-full border-2 border-[#F28C45] object-cover"
                  />
                  <div>
                    <h3 className="font-heading font-bold text-sm text-white">Carlos Mendez</h3>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#F28C45]/30 text-[#F28C45]">
                      Field Staff Lead
                    </span>
                  </div>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed mb-4">
                  Accept dispatched work orders, update repair status, upload on-site evidence photos, document materials, and request verification.
                </p>
                <div className="text-[11px] text-stone-400 space-y-1 mb-4">
                  <div>&bull; Mobile-optimized task list</div>
                  <div>&bull; Work performed & material logs</div>
                  <div>&bull; Field map route view</div>
                </div>
              </div>
              <button
                onClick={() => onQuickSwitchUser(DEMO_USERS[2].id)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F28C45] hover:bg-[#d97532] text-stone-950 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Launch Field Work Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Super Admin Persona */}
            <div className="bg-[#49345F]/10 border border-[#49345F]/40 rounded-2xl p-6 flex flex-col justify-between hover:border-[#49345F] transition shadow-lg">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={DEMO_USERS[3].avatarUrl}
                    alt={DEMO_USERS[3].name}
                    className="w-12 h-12 rounded-full border-2 border-[#49345F] object-cover"
                  />
                  <div>
                    <h3 className="font-heading font-bold text-sm text-white">Dr. Elena Rostova</h3>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#49345F]/30 text-[#B8A0E3]">
                      Super Administrator
                    </span>
                  </div>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed mb-4">
                  Platform-wide governance, onboarding municipal agencies, user role permissions, global category management, and tamper-proof audit trails.
                </p>
                <div className="text-[11px] text-stone-400 space-y-1 mb-4">
                  <div>&bull; Agency verification & accreditation</div>
                  <div>&bull; Comprehensive system audit logs</div>
                  <div>&bull; Integration health indicators</div>
                </div>
              </div>
              <button
                onClick={() => onQuickSwitchUser(DEMO_USERS[3].id)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#49345F] hover:bg-[#39284a] text-white font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Launch Platform Governance</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PUBLIC TRUST & TRANSPARENCY SECTION */}
      <section className="py-20 bg-[#171A19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-stone-850 rounded-3xl border border-stone-800 p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-mono uppercase text-[#C8F169] tracking-wider">
                  Open Government Standards
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-2 mb-4">
                  Transparent By Architecture. Accountable By Design.
                </h2>
                <p className="text-stone-300 text-sm leading-relaxed mb-6 font-light">
                  Unlike traditional opaque 311 hotlines where submitted tickets disappear into bureaucratic backlogs, CivicSync mandates continuous state observability. Every event is timestamped, attributed, and publicly verifiable.
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs text-stone-300 font-medium">
                  <div className="flex items-start gap-2.5">
                    <Shield className="w-4 h-4 text-[#C8F169] shrink-0 mt-0.5" />
                    <span>Role-isolated access control with full audit logs</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <FileCheck2 className="w-4 h-4 text-[#C8F169] shrink-0 mt-0.5" />
                    <span>Mandatory photographic evidence before closing tickets</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Eye className="w-4 h-4 text-[#C8F169] shrink-0 mt-0.5" />
                    <span>Open geographic transparency for city-wide issues</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#C8F169] shrink-0 mt-0.5" />
                    <span>Strict SLA tracking with automated escalation warnings</span>
                  </div>
                </div>
              </div>

              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 text-stone-300 text-xs font-mono space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <span className="text-[#C8F169] font-bold">SYSTEM AUDIT VERIFICATION SNAPSHOT</span>
                  <span className="text-stone-500">SHA-256</span>
                </div>
                <div className="text-[11px] text-stone-400 space-y-1.5 leading-relaxed">
                  <div>&gt; [2026-10-26T09:15:00Z] ASSIGNED: REP-2026-8814 -&gt; Carlos Mendez (Roads Lead)</div>
                  <div>&gt; [2026-10-26T11:00:00Z] STATUS_CHANGE: in_progress with on-site GPS verification</div>
                  <div>&gt; [2026-10-26T16:00:00Z] ALERT_BROADCAST: ALT-2026-402 (Warning, Riverfront Corridor)</div>
                  <div>&gt; [2026-10-27T06:30:00Z] TRIAGE_QUEUE: REP-2026-8816 categorized under Electrical SLA 24h</div>
                </div>
                <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-[10px] text-stone-500">
                  <span>Tamper-proof event logs active</span>
                  <span className="text-[#C8F169]">100% Records Synchronized</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION */}
      <section className="py-20 bg-[#121413] text-center border-t border-stone-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Build a Safer, More Responsive Community?
          </h2>
          <p className="text-stone-400 text-base max-w-2xl mx-auto mb-8 font-light">
            Whether reporting a hazardous pothole, verifying storm preparations, or dispatching emergency crews, CivicSync keeps your entire city synchronized.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('report_issue')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#C8F169] text-[#171A19] font-bold text-sm hover:bg-[#b5e057] transition shadow-lg shadow-[#C8F169]/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Submit a Report Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('auth')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 font-semibold text-sm hover:bg-stone-800 hover:text-white transition cursor-pointer"
            >
              Sign In to Your Workspace
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
`;

fs.writeFileSync('src/components/landing/LandingPage.tsx', landingCode);
console.log('LandingPage.tsx written successfully');
