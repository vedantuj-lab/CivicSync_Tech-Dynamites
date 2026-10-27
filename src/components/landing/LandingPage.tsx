import React, { useState } from 'react';
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
  Eye,
  Hammer,
  Lightbulb,
  Trash2,
  Waves,
  Droplets,
  HelpCircle,
  Phone,
  Sparkles,
  ExternalLink,
  Users,
  Wrench,
  Radio
} from 'lucide-react';
import { PublicAlert, CivicReport, IssueCategory, UserProfile } from '../../types/civic';
import { SeverityBadge } from '../common/Badge';

interface LandingPageProps {
  alerts: PublicAlert[];
  reports: CivicReport[];
  categories: IssueCategory[];
  currentUser: UserProfile | null;
  onNavigate: (path: string) => void;
  onSelectAlert: (alert: PublicAlert) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  alerts,
  reports,
  categories,
  currentUser,
  onNavigate,
  onSelectAlert
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

  const handleReportAction = () => {
    if (currentUser) {
      if (currentUser.role === 'citizen') {
        onNavigate('/citizen/reports/new');
      } else {
        onNavigate(`/${currentUser.role.replace('_', '-')}/dashboard`);
      }
    } else {
      onNavigate('/login/citizen');
    }
  };

  return (
    <div className="bg-[#171A19] text-[#F8F7F2] min-h-screen font-sans selection:bg-[#C8F169] selection:text-[#171A19]">
      {/* PUBLIC TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-[#171A19]/95 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand */}
          <div
            onClick={() => onNavigate('/')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#C8F169] flex items-center justify-center text-[#171A19] font-black text-xl shadow-lg shadow-[#C8F169]/20 group-hover:scale-105 transition-transform">
              CS
            </div>
            <div>
              <div className="font-heading font-extrabold text-xl text-white tracking-tight flex items-center gap-2">
                CivicSync
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#C8F169]/15 text-[#C8F169] border border-[#C8F169]/30">
                  Public Grid
                </span>
              </div>
              <p className="text-[11px] text-[#A6B7AD] hidden sm:block">One Alert. One Source. A Safer Community.</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A6B7AD]">
            <button onClick={() => onNavigate('/')} className="text-white hover:text-[#C8F169] transition">
              Home
            </button>
            <button onClick={() => onNavigate('/alerts')} className="hover:text-white transition">
              Public Alerts
            </button>
            <a href="#how-it-works" className="hover:text-white transition">
              How It Works
            </a>
            <a href="#categories" className="hover:text-white transition">
              Categories
            </a>
            <a href="#transparency" className="hover:text-white transition">
              About CivicSync
            </a>
            <a href="#contact" className="hover:text-white transition">
              Contact &amp; Help
            </a>
          </div>

          {/* Authentication Entry Buttons */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={() => onNavigate(`/${currentUser.role.replace('_', '-')}/dashboard`)}
                className="px-5 py-2.5 rounded-xl bg-[#C8F169] text-[#171A19] font-bold text-xs uppercase tracking-wider hover:bg-[#b5e057] transition shadow-md cursor-pointer"
              >
                Go to My Dashboard ({currentUser.role.replace('_', ' ')}) &rarr;
              </button>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('/login')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-200 hover:text-white border border-stone-700 hover:border-stone-500 transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('/login')}
                  className="px-5 py-2.5 rounded-xl bg-[#C8F169] text-[#171A19] font-bold text-xs uppercase tracking-wider hover:bg-[#b5e057] transition shadow-md shadow-[#C8F169]/20 cursor-pointer"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* SECTION A: HERO WITH MODERN URBAN PHOTOGRAPHY OVERLAY */}
      <section className="relative pt-16 pb-24 md:pt-28 md:pb-36 overflow-hidden border-b border-stone-800">
        {/* Urban background with dark overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1920&q=80')`
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#171A19]/90 via-[#171A19]/80 to-[#171A19]" />
        
        {/* Subtle accent glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#C8F169]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/90 border border-stone-700 text-xs text-stone-300 mb-8 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#C8F169] animate-ping" />
            <span className="font-mono text-[#C8F169] font-bold tracking-wide">CivicSync Unified Infrastructure</span>
            <span className="text-stone-500">&bull;</span>
            <span className="text-[#A6B7AD]">Sovereign Municipal Grid</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08] max-w-4xl mx-auto">
            One Alert. One Source. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8F169] via-[#9ADBC0] to-emerald-300">
              A Safer Community.
            </span>
          </h1>

          <p className="text-[#A6B7AD] text-base sm:text-xl leading-relaxed mb-10 max-w-3xl mx-auto font-light">
            Stay informed with verified public alerts, report local civic problems, and track every update through one connected platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
            <button
              onClick={() => onNavigate('/alerts')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-stone-900 border border-stone-700 text-white font-bold text-sm hover:border-[#C8F169] hover:bg-stone-850 transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Explore Public Alerts ({publishedAlerts.length})</span>
            </button>

            <button
              onClick={handleReportAction}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#C8F169] text-[#171A19] font-extrabold text-sm uppercase tracking-wider hover:bg-[#b5e057] transition shadow-xl shadow-[#C8F169]/25 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Report a Civic Issue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION B: PUBLIC IMPACT INDICATORS (Clearly Labeled Demonstration Data) */}
      <section className="bg-[#121413] py-10 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#A6B7AD] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C8F169]"></span>
              Live Grid Telemetry &bull; Sample Demonstration Data
            </span>
            <span className="text-[11px] text-stone-500 font-mono hidden sm:inline">
              ISO/DIS 37120 Municipal Performance Standard
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-stone-900/80 p-6 rounded-2xl border border-stone-800">
              <div className="text-stone-400 text-xs font-mono uppercase">Official Public Alerts</div>
              <div className="font-mono text-3xl font-extrabold text-[#C8F169] mt-1">{publishedAlerts.length} Active</div>
              <div className="text-[11px] text-stone-500 mt-1">Broadcast by municipal response desk</div>
            </div>

            <div className="bg-stone-900/80 p-6 rounded-2xl border border-stone-800">
              <div className="text-stone-400 text-xs font-mono uppercase">Civic Reports Submitted</div>
              <div className="font-mono text-3xl font-extrabold text-white mt-1">{1480 + reports.length}</div>
              <div className="text-[11px] text-stone-500 mt-1">Citizen geo-located incident tickets</div>
            </div>

            <div className="bg-stone-900/80 p-6 rounded-2xl border border-stone-800">
              <div className="text-stone-400 text-xs font-mono uppercase">Certified Resolved</div>
              <div className="font-mono text-3xl font-extrabold text-[#9ADBC0] mt-1">{1395 + resolvedIssues.length}</div>
              <div className="text-[11px] text-stone-500 mt-1">Verified with before &amp; after photos</div>
            </div>

            <div className="bg-stone-900/80 p-6 rounded-2xl border border-stone-800">
              <div className="text-stone-400 text-xs font-mono uppercase">Participating Agencies</div>
              <div className="font-mono text-3xl font-extrabold text-amber-400 mt-1">3 Agencies</div>
              <div className="text-[11px] text-stone-500 mt-1">Public Works, Water Authority, Safety</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: LATEST PUBLIC ALERTS */}
      <section className="py-20 bg-[#171A19] border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#C8F169] mb-1 font-bold">
                <Radio className="w-4 h-4 text-[#C8F169]" />
                Official Emergency &amp; Utility Stream
              </div>
              <h2 className="font-heading text-3xl font-bold text-white">
                Latest Public Alerts &amp; Advisories
              </h2>
              <p className="text-[#A6B7AD] text-sm mt-1 max-w-xl">
                Official notices broadcast by verified directors. Filter by corridor or open advisory for complete directives.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  placeholder="Filter alerts by area or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C8F169] w-64"
                />
              </div>
              <button
                onClick={() => onNavigate('/alerts')}
                className="px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-bold text-stone-200 hover:text-white hover:border-[#C8F169] transition cursor-pointer"
              >
                All Public Alerts &rarr;
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredAlerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                onClick={() => onSelectAlert(alert)}
                className="bg-stone-900 rounded-3xl p-6 border border-stone-800 hover:border-stone-600 transition shadow-xl flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <SeverityBadge severity={alert.severity} />
                    <span className="text-[11px] font-mono text-stone-500">{alert.alertNumber}</span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-[#C8F169] transition">
                    {alert.title}
                  </h3>

                  <p className="text-[#A6B7AD] text-xs leading-relaxed line-clamp-3 mb-5">
                    {alert.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-stone-300 border-t border-stone-800/80 pt-4 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#C8F169] shrink-0 mt-0.5" />
                      <span className="font-medium text-stone-200">{alert.affectedArea}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#A6B7AD]">
                      <Building2 className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      <span>{alert.issuingOrgName}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-stone-500">
                    Published {new Date(alert.publishedAt).toLocaleDateString()}
                  </span>
                  <span className="font-bold text-[#C8F169] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Details &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION D: HOW CIVICSYNC WORKS (Warm Ivory light section background: #F5F2E9, Text: #202521) */}
      <section id="how-it-works" className="py-24 bg-[#F5F2E9] text-[#202521] border-b border-stone-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase text-[#176B52] font-bold tracking-wider">
              Traceable Operational Engine
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#202521] mt-2 mb-3">
              How CivicSync Works in Three Simple Steps
            </h2>
            <p className="text-stone-600 text-sm">
              Connecting community residents with responsible municipal directors and verified field crews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#176B52]/10 text-[#176B52] font-mono font-black text-xl flex items-center justify-center mb-6 border border-[#176B52]/20">
                  01
                </div>
                <h3 className="font-heading font-bold text-xl text-[#202521] mb-2">
                  1. Receive Verified Public Alerts
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed mb-4">
                  Stay immediately informed regarding severe weather hazards, road closures, and utility shutdowns broadcast by authorized emergency directors.
                </p>
              </div>
              <div className="text-[11px] font-mono text-[#176B52] font-bold border-t border-stone-100 pt-3">
                &bull; Real-time push &amp; affected zone maps
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#762E42]/10 text-[#762E42] font-mono font-black text-xl flex items-center justify-center mb-6 border border-[#762E42]/20">
                  02
                </div>
                <h3 className="font-heading font-bold text-xl text-[#202521] mb-2">
                  2. Report a Local Civic Problem
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed mb-4">
                  Take a photo of a hazard (pothole, broken streetlight, blocked drain), drop a pin on the interactive map, and submit directly to municipal triage.
                </p>
              </div>
              <div className="text-[11px] font-mono text-[#762E42] font-bold border-t border-stone-100 pt-3">
                &bull; Instant tracking ID &amp; duplicate check
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#F28C45]/15 text-[#B45309] font-mono font-black text-xl flex items-center justify-center mb-6 border border-[#F28C45]/30">
                  03
                </div>
                <h3 className="font-heading font-bold text-xl text-[#202521] mb-2">
                  3. Track Progress &amp; Review Resolution
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed mb-4">
                  Watch your report advance from review to crew assignment. Inspect before &amp; after resolution photos, and confirm resolution or dispute reopened work.
                </p>
              </div>
              <div className="text-[11px] font-mono text-[#B45309] font-bold border-t border-stone-100 pt-3">
                &bull; Immutable audit trail &amp; citizen sign-off
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E: CIVIC ISSUE CATEGORIES (Two complementary colors per card) */}
      <section id="categories" className="py-20 bg-[#171A19] border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase text-[#C8F169] tracking-wider font-bold">
              Configurable Category Routing
            </span>
            <h2 className="font-heading text-3xl font-bold text-white mt-1 mb-3">
              Civic Issue Categories
            </h2>
            <p className="text-[#A6B7AD] text-sm">
              Each problem type is deterministically routed to its responsible departmental queue with target SLA thresholds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'cat_roads', name: 'Roads & Potholes', desc: 'Asphalt craters, rim strike hazards, sinkholes, and damaged guardrails.', bg: 'bg-[#176B52]/10', border: 'border-[#176B52]/40', iconBg: 'bg-[#176B52]', iconText: 'text-[#9ADBC0]', sla: '48h SLA' },
              { id: 'cat_streetlights', name: 'Streetlights & Electrical', desc: 'Flickering luminaires, dark arterial roads, and knocked-over poles.', bg: 'bg-[#762E42]/10', border: 'border-[#762E42]/40', iconBg: 'bg-[#762E42]', iconText: 'text-[#E9A7B2]', sla: '24h SLA' },
              { id: 'cat_waste', name: 'Waste Management & Litter', desc: 'Overflowing public bins, unauthorized bulk dumping, and debris.', bg: 'bg-[#30363A]/50', border: 'border-stone-700', iconBg: 'bg-[#F28C45]', iconText: 'text-stone-950', sla: '24h SLA' },
              { id: 'cat_drainage', name: 'Drainage & Storm Flooding', desc: 'Clogged catch basins, standing intersection water, and sewer surcharge.', bg: 'bg-[#49345F]/15', border: 'border-[#49345F]/40', iconBg: 'bg-[#49345F]', iconText: 'text-[#B8A0E3]', sla: '36h SLA' },
              { id: 'cat_water', name: 'Water Supply & Hydrants', desc: 'Broken water mains, pressure loss, brown tap water, and leaking hydrants.', bg: 'bg-[#176B52]/10', border: 'border-[#176B52]/40', iconBg: 'bg-[#176B52]', iconText: 'text-[#9ADBC0]', sla: '12h SLA' },
              { id: 'cat_infrastructure', name: 'Public Infrastructure & Parks', desc: 'Broken sidewalks, park bench vandalism, and fallen tree limbs.', bg: 'bg-[#762E42]/10', border: 'border-[#762E42]/40', iconBg: 'bg-[#762E42]', iconText: 'text-[#E9A7B2]', sla: '72h SLA' }
            ].map((cat) => (
              <div
                key={cat.id}
                onClick={handleReportAction}
                className={`${cat.bg} rounded-3xl border ${cat.border} p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer shadow-lg group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${cat.iconBg} ${cat.iconText} flex items-center justify-center font-bold text-base`}>
                      {cat.name.slice(0, 1)}
                    </div>
                    <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-stone-300">
                      {cat.sla}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-[#C8F169] transition">
                    {cat.name}
                  </h3>
                  <p className="text-[#A6B7AD] text-xs leading-relaxed mb-4">
                    {cat.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-800/80 text-xs">
                  <span className="text-stone-500 font-mono">Department Assigned</span>
                  <span className="text-[#C8F169] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    File Ticket &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION F: HOW ORGANIZATIONS RESPOND (Visual Workflow Timeline) */}
      <section className="py-20 bg-[#121413] border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase text-[#C8F169] tracking-wider font-bold">
              Accountability Architecture
            </span>
            <h2 className="font-heading text-3xl font-bold text-white mt-1 mb-3">
              How Municipal Teams Respond
            </h2>
            <p className="text-[#A6B7AD] text-sm">
              From intake triage to certified resolution: every stage is timestamped, verified, and transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              { step: '01', title: 'Intake Received', desc: 'Auto-checks duplicates within 1km & assigns tracking number.', color: 'text-[#9ADBC0]' },
              { step: '02', title: 'Director Triage', desc: 'Assesses legitimacy, routes to department & sets SLA target.', color: 'text-[#E9A7B2]' },
              { step: '03', title: 'Crew Dispatch', desc: 'Assigned to field technician with supervisor directives.', color: 'text-[#F28C45]' },
              { step: '04', title: 'Field Execution', desc: 'Technician arrives, updates status & uploads after-repair photos.', color: 'text-[#B8A0E3]' },
              { step: '05', title: 'Verification & Closure', desc: 'Supervisor verifies evidence; citizen confirms satisfaction.', color: 'text-[#C8F169]' }
            ].map((st, i) => (
              <div key={i} className="bg-stone-900/90 rounded-2xl border border-stone-800 p-5 flex flex-col justify-between">
                <div>
                  <div className={`font-mono font-black text-2xl ${st.color} mb-2`}>{st.step}</div>
                  <h4 className="font-bold text-sm text-white mb-1.5">{st.title}</h4>
                  <p className="text-stone-400 text-xs leading-relaxed">{st.desc}</p>
                </div>
                <div className="pt-3 border-t border-stone-800/80 mt-4 text-[10px] text-stone-500 font-mono">
                  Stage Verified &bull; Logged
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION G: ROLE-SPECIFIC ENTRY CARDS (Citizen, Org Admin, Field Staff, Super Admin) */}
      <section className="py-24 bg-[#171A19] border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase text-[#C8F169] tracking-wider font-bold">
              Separate Dedicated Workspaces
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mt-1 mb-4">
              Access Your Specific Municipal Role
            </h2>
            <p className="text-[#A6B7AD] text-sm leading-relaxed">
              CivicSync provisions four completely isolated, role-specific workspaces. Select your designated role below to enter its specialized authentication portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Citizen */}
            <div className="bg-[#176B52]/15 border-2 border-[#176B52]/50 rounded-3xl p-7 flex flex-col justify-between hover:border-[#176B52] transition shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#176B52] text-[#9ADBC0] flex items-center justify-center font-bold text-xl mb-5 shadow-md">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-xl text-white mb-2">
                  Citizen Resident
                </h3>
                <p className="text-[#A6B7AD] text-xs leading-relaxed mb-6 font-light">
                  Receive verified public alerts, report neighborhood civic issues, track real-time resolution timelines, and confirm work completion.
                </p>
                <div className="text-[11px] font-mono text-[#9ADBC0] space-y-1 mb-6">
                  <div>&bull; Multi-step report wizard</div>
                  <div>&bull; Interactive coordinate picker</div>
                  <div>&bull; Satisfaction sign-off / dispute</div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('/login/citizen')}
                className="w-full py-3 rounded-xl bg-[#176B52] hover:bg-[#125541] text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue as Citizen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Organization Administrator */}
            <div className="bg-[#762E42]/15 border-2 border-[#762E42]/50 rounded-3xl p-7 flex flex-col justify-between hover:border-[#762E42] transition shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#762E42] text-[#E9A7B2] flex items-center justify-center font-bold text-xl mb-5 shadow-md">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-xl text-white mb-2">
                  Organization Admin
                </h3>
                <p className="text-[#A6B7AD] text-xs leading-relaxed mb-6 font-light">
                  Review intake reports, inspect spatial duplicates, assign responsible field leads, broadcast official public alerts, and verify resolution evidence.
                </p>
                <div className="text-[11px] font-mono text-[#E9A7B2] space-y-1 mb-6">
                  <div>&bull; Operational Command Center</div>
                  <div>&bull; Duplicate detection triage</div>
                  <div>&bull; Before &amp; after sign-off</div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('/login/organization-admin')}
                className="w-full py-3 rounded-xl bg-[#762E42] hover:bg-[#5f2434] text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue as Admin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 3: Field Staff */}
            <div className="bg-[#F28C45]/15 border-2 border-[#F28C45]/50 rounded-3xl p-7 flex flex-col justify-between hover:border-[#F28C45] transition shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#30363A] text-[#F28C45] flex items-center justify-center font-bold text-xl mb-5 shadow-md border border-[#F28C45]/40">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-xl text-white mb-2">
                  Field Staff Lead
                </h3>
                <p className="text-[#A6B7AD] text-xs leading-relaxed mb-6 font-light">
                  Acknowledge assigned repair orders, log arrival on site, document materials deployed, and upload completion photographs for sign-off.
                </p>
                <div className="text-[11px] font-mono text-[#F28C45] space-y-1 mb-6">
                  <div>&bull; Priority work queue</div>
                  <div>&bull; Mobile incident route map</div>
                  <div>&bull; Resolution proof uploads</div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('/login/field-staff')}
                className="w-full py-3 rounded-xl bg-[#F28C45] hover:bg-[#d97532] text-stone-950 font-extrabold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue as Field Staff</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 4: Platform Super Administrator */}
            <div className="bg-[#49345F]/15 border-2 border-[#49345F]/50 rounded-3xl p-7 flex flex-col justify-between hover:border-[#49345F] transition shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#49345F] text-[#B8A0E3] flex items-center justify-center font-bold text-xl mb-5 shadow-md">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-xl text-white mb-2">
                  Platform Super Admin
                </h3>
                <p className="text-[#A6B7AD] text-xs leading-relaxed mb-6 font-light">
                  Accredit municipal agency onboardings, govern user access roles, enforce platform SLA standards, and inspect immutable system audit logs.
                </p>
                <div className="text-[11px] font-mono text-[#B8A0E3] space-y-1 mb-6">
                  <div>&bull; Agency directory &amp; health</div>
                  <div>&bull; Master category SLA rules</div>
                  <div>&bull; Full security audit trail</div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('/login/platform-admin')}
                className="w-full py-3 rounded-xl bg-[#49345F] hover:bg-[#39284a] text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue as Super Admin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION H: CLOSING CALL TO ACTION */}
      <section className="py-24 bg-[#121413] text-center border-b border-stone-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono uppercase text-[#C8F169] tracking-wider font-bold">
            Civic Technology Consortium
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-white mt-2 mb-4 leading-tight">
            Better Information. Better Coordination. <br />
            <span className="text-[#C8F169]">Better Communities.</span>
          </h2>
          <p className="text-[#A6B7AD] text-base max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Unify emergency broadcasts with transparent local problem resolution. Experience authentic, accountable civic collaboration today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/alerts')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-stone-900 border border-stone-700 text-white font-bold text-sm hover:border-[#C8F169] transition cursor-pointer"
            >
              Explore Public Alerts
            </button>
            <button
              onClick={() => onNavigate('/login')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#C8F169] text-[#171A19] font-extrabold text-sm uppercase tracking-wider hover:bg-[#b5e057] transition shadow-xl shadow-[#C8F169]/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In to CivicSync</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION I: FOOTER */}
      <footer id="contact" className="bg-[#171A19] border-t border-stone-800 text-stone-400 text-xs py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#C8F169] text-[#171A19] font-black text-base flex items-center justify-center">
                  CS
                </div>
                <span className="font-heading font-extrabold text-lg text-white">CivicSync</span>
              </div>
              <p className="text-[#A6B7AD] text-xs leading-relaxed mb-4 font-light">
                One Alert. One Source. A Safer Community. Deterministic public safety alerts and civic infrastructure incident tracking.
              </p>
              <div className="font-mono text-[11px] text-stone-500">
                CivicSync Platform v2.4.0-Production &bull; Sovereign Build
              </div>
            </div>

            <div>
              <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider mb-3">
                Public Portals
              </h4>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigate('/alerts')} className="hover:text-[#C8F169] transition">Live Public Alerts</button></li>
                <li><button onClick={() => onNavigate('/map')} className="hover:text-[#C8F169] transition">City Incident Map</button></li>
                <li><a href="#how-it-works" className="hover:text-[#C8F169] transition">Operational Protocol</a></li>
                <li><a href="#categories" className="hover:text-[#C8F169] transition">Service Level Categories</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider mb-3">
                Role Portals
              </h4>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigate('/login/citizen')} className="hover:text-[#C8F169] transition">Citizen Resident Portal</button></li>
                <li><button onClick={() => onNavigate('/login/organization-admin')} className="hover:text-[#C8F169] transition">Operations Desk (Admin)</button></li>
                <li><button onClick={() => onNavigate('/login/field-staff')} className="hover:text-[#C8F169] transition">Field Crew Workstation</button></li>
                <li><button onClick={() => onNavigate('/login/platform-admin')} className="hover:text-[#C8F169] transition">Platform Governance Admin</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider mb-3">
                Help &amp; Governance
              </h4>
              <p className="text-stone-500 text-[11px] leading-relaxed mb-3">
                CivicSync is an independent civic technology platform. Official notices are issued strictly by authenticated agency personnel.
              </p>
              <div className="space-y-1 text-stone-500 text-[11px] font-mono">
                <div>Terms of Governance &bull; Privacy Security</div>
                <div>Emergency Line: Dial 911 for life safety</div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
            <div>&copy; {new Date().getFullYear()} CivicSync Consortium. Open civic standards.</div>
            <div className="font-mono text-[#C8F169]/80">Demonstration test data isolated from municipal records.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
