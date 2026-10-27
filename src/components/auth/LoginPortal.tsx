import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Users,
  Building2,
  Wrench,
  CheckCircle2,
  Copy,
  Check,
  Lock,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';
import { civicStore } from '../../services/store';
import { UserProfile } from '../../types/civic';

interface LoginPortalProps {
  onNavigate: (path: string) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({ onNavigate, onLoginSuccess }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleInstantDemoLogin = (email: string, pass: string, targetPath: string) => {
    try {
      const user = civicStore.authenticate(email, pass);
      onLoginSuccess(user);
      onNavigate(targetPath);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const DEMO_CREDENTIALS = [
    {
      role: 'Citizen Resident',
      name: 'Maya Lin',
      email: 'demo.citizen@civicsync.local',
      password: 'CivicDemo!2026-Citizen',
      dest: '/citizen/dashboard',
      bg: 'bg-[#176B52]/10 border-[#176B52]/30 text-[#176B52]',
      btnBg: 'bg-[#176B52] hover:bg-[#125541] text-white'
    },
    {
      role: 'Organization Administrator',
      name: 'Director Marcus Vance',
      email: 'demo.admin@civicsync.local',
      password: 'CivicDemo!2026-Admin',
      dest: '/organization-admin/dashboard',
      bg: 'bg-[#762E42]/10 border-[#762E42]/30 text-[#762E42]',
      btnBg: 'bg-[#762E42] hover:bg-[#5f2434] text-white'
    },
    {
      role: 'Field Staff Lead',
      name: 'Carlos Mendez',
      email: 'demo.field@civicsync.local',
      password: 'CivicDemo!2026-Field',
      dest: '/field-staff/dashboard',
      bg: 'bg-[#F28C45]/10 border-[#F28C45]/30 text-[#B45309]',
      btnBg: 'bg-[#F28C45] hover:bg-[#d97532] text-stone-950 font-bold'
    },
    {
      role: 'Platform Super Administrator',
      name: 'Dr. Elena Rostova',
      email: 'demo.superadmin@civicsync.local',
      password: 'CivicDemo!2026-Super',
      dest: '/platform-admin/dashboard',
      bg: 'bg-[#49345F]/10 border-[#49345F]/30 text-[#49345F]',
      btnBg: 'bg-[#49345F] hover:bg-[#39284a] text-white'
    }
  ];

  return (
    <div className="bg-[#FAF8F5] text-[#26243A] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 text-xs font-bold text-[#4338CA] hover:text-[#3730A3] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Website</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>CivicSync Authentication Gateway v2.4</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase text-[#4338CA] font-extrabold tracking-wider">
            Role-Based Authorization Portal
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#26243A] mt-2 mb-3">
            Select Your Municipal Workspace
          </h1>
          <p className="text-stone-600 text-sm leading-relaxed">
            CivicSync protects sensitive municipal records through role isolation. Please select your verified role to access your dedicated login screen.
          </p>
        </div>

        {/* THE FOUR LARGE ROLE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Role 1: Citizen */}
          <div className="bg-white rounded-3xl border-2 border-[#176B52]/30 p-6 flex flex-col justify-between hover:border-[#176B52] hover:shadow-xl transition shadow-md group">
            <div>
              <div
                className="w-full h-36 rounded-2xl bg-cover bg-center mb-5 relative overflow-hidden"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80')`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent" />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-[#176B52] text-white text-[11px] font-mono font-bold">
                  CITIZEN
                </span>
              </div>

              <h2 className="font-heading font-extrabold text-xl text-stone-900 mb-2">
                Citizen Resident
              </h2>
              <p className="text-stone-600 text-xs leading-relaxed mb-6">
                Receive public alerts, report civic issues, and track your submissions from intake to verified closure.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/login/citizen')}
              className="w-full py-3.5 rounded-xl bg-[#176B52] hover:bg-[#125541] text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue as Citizen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Role 2: Organization Administrator */}
          <div className="bg-white rounded-3xl border-2 border-[#762E42]/30 p-6 flex flex-col justify-between hover:border-[#762E42] hover:shadow-xl transition shadow-md group">
            <div>
              <div
                className="w-full h-36 rounded-2xl bg-cover bg-center mb-5 relative overflow-hidden"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80')`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent" />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-[#762E42] text-white text-[11px] font-mono font-bold">
                  DIRECTOR / ADMIN
                </span>
              </div>

              <h2 className="font-heading font-extrabold text-xl text-stone-900 mb-2">
                Organization Admin
              </h2>
              <p className="text-stone-600 text-xs leading-relaxed mb-6">
                Review reports, manage assignments, publish public alerts, and monitor municipal civic operations.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/login/organization-admin')}
              className="w-full py-3.5 rounded-xl bg-[#762E42] hover:bg-[#5f2434] text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue as Admin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Role 3: Field Staff */}
          <div className="bg-white rounded-3xl border-2 border-[#F28C45]/40 p-6 flex flex-col justify-between hover:border-[#F28C45] hover:shadow-xl transition shadow-md group">
            <div>
              <div
                className="w-full h-36 rounded-2xl bg-cover bg-center mb-5 relative overflow-hidden"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80')`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent" />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-[#F28C45] text-stone-950 text-[11px] font-mono font-bold">
                  FIELD CREW
                </span>
              </div>

              <h2 className="font-heading font-extrabold text-xl text-stone-900 mb-2">
                Field Staff
              </h2>
              <p className="text-stone-600 text-xs leading-relaxed mb-6">
                View assigned tasks, record work progress, and upload resolution evidence for municipal verification.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/login/field-staff')}
              className="w-full py-3.5 rounded-xl bg-[#F28C45] hover:bg-[#d97532] text-stone-950 font-extrabold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue as Field Staff</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Role 4: Platform Super Administrator */}
          <div className="bg-white rounded-3xl border-2 border-[#49345F]/30 p-6 flex flex-col justify-between hover:border-[#49345F] hover:shadow-xl transition shadow-md group">
            <div>
              <div
                className="w-full h-36 rounded-2xl bg-cover bg-center mb-5 relative overflow-hidden"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80')`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent" />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-[#49345F] text-white text-[11px] font-mono font-bold">
                  SUPER ADMIN
                </span>
              </div>

              <h2 className="font-heading font-extrabold text-xl text-stone-900 mb-2">
                Platform Super Admin
              </h2>
              <p className="text-stone-600 text-xs leading-relaxed mb-6">
                Manage organizations, user permissions, platform settings, and system health. (No public self-registration).
              </p>
            </div>

            <button
              onClick={() => onNavigate('/login/platform-admin')}
              className="w-full py-3.5 rounded-xl bg-[#49345F] hover:bg-[#39284a] text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue as Super Admin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* DEMO CREDENTIAL PANEL: "Try the CivicSync Demo" */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-indigo-200 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-[#4338CA] text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Development Demo Environment</span>
              </div>
              <h2 className="font-heading text-2xl font-bold text-[#26243A]">
                Try the CivicSync Demo
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Use these pre-seeded test accounts to evaluate all four distinct workflows with persistent state.
              </p>
            </div>

            <div className="text-[11px] font-mono text-stone-400 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
              Demo Mode &bull; Isolated from Production
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEMO_CREDENTIALS.map((cred, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border ${cred.bg} flex flex-col justify-between space-y-3`}>
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">{cred.role}</div>
                  <div className="font-bold text-sm text-stone-900 mt-0.5">{cred.name}</div>

                  <div className="mt-3 space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between bg-white/80 p-1.5 rounded-lg border border-stone-200">
                      <span className="text-[10px] text-stone-600 truncate max-w-[150px]">{cred.email}</span>
                      <button
                        onClick={() => copyToClipboard(cred.email, `email_${idx}`)}
                        title="Copy Email"
                        className="p-1 text-stone-400 hover:text-stone-800 transition"
                      >
                        {copiedKey === `email_${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-white/80 p-1.5 rounded-lg border border-stone-200">
                      <span className="text-[10px] text-stone-600 truncate max-w-[150px]">{cred.password}</span>
                      <button
                        onClick={() => copyToClipboard(cred.password, `pass_${idx}`)}
                        title="Copy Password"
                        className="p-1 text-stone-400 hover:text-stone-800 transition"
                      >
                        {copiedKey === `pass_${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleInstantDemoLogin(cred.email, cred.password, cred.dest)}
                  className={`w-full py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${cred.btnBg}`}
                >
                  <span>Quick Sign In</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
