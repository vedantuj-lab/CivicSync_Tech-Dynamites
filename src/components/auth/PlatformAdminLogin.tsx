import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Shield, CheckCircle2 } from 'lucide-react';
import { civicStore } from '../../services/store';
import { UserProfile } from '../../types/civic';

interface PlatformAdminLoginProps {
  onNavigate: (path: string) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const PlatformAdminLogin: React.FC<PlatformAdminLoginProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('demo.superadmin@civicsync.local');
  const [password, setPassword] = useState('CivicDemo!2026-Super');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = civicStore.authenticate(email, password, 'super_admin');
      onLoginSuccess(user);
      onNavigate('/platform-admin/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-[#F3F0F7] min-h-screen text-[#292432] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#49345F]/20 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
        {/* Left Side Visual Panel: Deep Plum + Lavender */}
        <div
          className="md:col-span-5 bg-[#49345F] text-white p-8 flex flex-col justify-between relative bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(73, 52, 95, 0.94), rgba(43, 27, 60, 0.96)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80')`
          }}
        >
          <div>
            <button
              onClick={() => onNavigate('/login')}
              className="inline-flex items-center gap-1.5 text-xs text-[#B8A0E3] hover:text-white font-bold mb-8 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login Portal</span>
            </button>

            <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-[#B8A0E3]/20 text-[#B8A0E3] border border-[#B8A0E3]/30 font-bold tracking-wider">
              Platform Governance
            </span>
            <h2 className="font-heading text-3xl font-extrabold mt-3 mb-2 text-white">
              Super Admin
            </h2>
            <p className="text-purple-100/80 text-xs leading-relaxed font-light mb-6">
              Sovereign civic technology infrastructure. Accredit municipal departments, enforce security access policies, and audit cross-agency operations.
            </p>

            <div className="space-y-2.5 text-xs text-purple-100 border-t border-purple-400/30 pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B8A0E3]" />
                <span>Municipal onboarding approvals &amp; accreditation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B8A0E3]" />
                <span>Tamper-proof system audit stream inspection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B8A0E3]" />
                <span>Platform SLA thresholds &amp; security directory</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-purple-200/70 border-t border-purple-400/30 pt-4">
            Demo Account: demo.superadmin@civicsync.local
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-stone-200">
              <h3 className="font-heading font-bold text-lg text-stone-900">
                Platform Governance Authentication
              </h3>
              <button onClick={() => onNavigate('/')} className="text-xs text-stone-400 hover:text-stone-700">
                Public Home
              </button>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Governance Administrator Identity
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#49345F]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Security Passkey
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#49345F]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#49345F] hover:bg-[#39284a] text-white font-bold uppercase tracking-wider transition shadow-md shadow-[#49345F]/20 cursor-pointer mt-2"
              >
                Authenticate Governance Access
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-stone-200 text-center text-[11px] text-stone-400">
            Public self-registration is strictly prohibited for Platform Super Administrator accounts.
          </div>
        </div>
      </div>
    </div>
  );
};
