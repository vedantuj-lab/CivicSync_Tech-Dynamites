import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Building2, CheckCircle2 } from 'lucide-react';
import { civicStore } from '../../services/store';
import { UserProfile } from '../../types/civic';

interface OrgAdminLoginProps {
  onNavigate: (path: string) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const OrgAdminLogin: React.FC<OrgAdminLoginProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('demo.admin@civicsync.local');
  const [password, setPassword] = useState('CivicDemo!2026-Admin');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = civicStore.authenticate(email, password, 'org_admin');
      onLoginSuccess(user);
      onNavigate('/organization-admin/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-[#F8F0EA] min-h-screen text-[#34262B] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#762E42]/20 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
        {/* Left Side Visual Panel: Deep Burgundy + Rose */}
        <div
          className="md:col-span-5 bg-[#762E42] text-white p-8 flex flex-col justify-between relative bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(118, 46, 66, 0.94), rgba(80, 26, 40, 0.96)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80')`
          }}
        >
          <div>
            <button
              onClick={() => onNavigate('/login')}
              className="inline-flex items-center gap-1.5 text-xs text-[#E9A7B2] hover:text-white font-bold mb-8 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login Portal</span>
            </button>

            <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-[#E9A7B2]/20 text-[#E9A7B2] border border-[#E9A7B2]/30 font-bold tracking-wider">
              Department Operations
            </span>
            <h2 className="font-heading text-3xl font-extrabold mt-3 mb-2 text-white">
              Operations Director
            </h2>
            <p className="text-rose-100/80 text-xs leading-relaxed font-light mb-6">
              Authorized municipal operations workstation. Review intake tickets, analyze spatial duplicate incidents, assign crews with SLA targets, and certify resolution evidence.
            </p>

            <div className="space-y-2.5 text-xs text-rose-100 border-t border-rose-500/30 pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E9A7B2]" />
                <span>Jurisdictional department triage &amp; dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E9A7B2]" />
                <span>Official public emergency advisory broadcaster</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E9A7B2]" />
                <span>Side-by-side photographic evidence verification</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-rose-200/70 border-t border-rose-500/30 pt-4">
            Demo Account: demo.admin@civicsync.local
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-stone-200">
              <h3 className="font-heading font-bold text-lg text-stone-900">
                Agency Administrator Sign In
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
                  Official Agency Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#762E42]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-bold text-stone-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Department administrators must contact the Platform Super Administrator for credential recovery.')}
                    className="text-stone-500 hover:text-[#762E42] text-[11px]"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#762E42]"
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
                className="w-full py-3.5 rounded-xl bg-[#762E42] hover:bg-[#5f2434] text-white font-bold uppercase tracking-wider transition shadow-md shadow-[#762E42]/20 cursor-pointer mt-2"
              >
                Authenticate &amp; Open Operations Desk
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-stone-200 text-center text-[11px] text-stone-400">
            Organization accounts are authorized by accredited municipal jurisdiction boards.
          </div>
        </div>
      </div>
    </div>
  );
};
