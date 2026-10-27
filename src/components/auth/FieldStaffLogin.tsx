import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Wrench, CheckCircle2 } from 'lucide-react';
import { civicStore } from '../../services/store';
import { UserProfile } from '../../types/civic';

interface FieldStaffLoginProps {
  onNavigate: (path: string) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const FieldStaffLogin: React.FC<FieldStaffLoginProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('demo.field@civicsync.local');
  const [password, setPassword] = useState('CivicDemo!2026-Field');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = civicStore.authenticate(email, password, 'field_staff');
      onLoginSuccess(user);
      onNavigate('/field-staff/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-[#F2F0EB] min-h-screen text-[#23282B] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-300 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
        {/* Left Side Visual Panel: Graphite + Safety Orange */}
        <div
          className="md:col-span-5 bg-[#30363A] text-white p-8 flex flex-col justify-between relative bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(48, 54, 58, 0.94), rgba(30, 34, 37, 0.96)), url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80')`
          }}
        >
          <div>
            <button
              onClick={() => onNavigate('/login')}
              className="inline-flex items-center gap-1.5 text-xs text-[#F28C45] hover:text-white font-bold mb-8 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login Portal</span>
            </button>

            <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-[#F28C45]/20 text-[#F28C45] border border-[#F28C45]/30 font-bold tracking-wider">
              Field Operations
            </span>
            <h2 className="font-heading text-3xl font-extrabold mt-3 mb-2 text-white">
              Field Crew Lead
            </h2>
            <p className="text-stone-300 text-xs leading-relaxed font-light mb-6">
              Mobile technician work station. Receive assigned work orders, navigate via GIS incident coordinates, log on-site arrival, and upload after-repair photographic proof.
            </p>

            <div className="space-y-2.5 text-xs text-stone-200 border-t border-stone-700 pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F28C45]" />
                <span>Task queue with supervisor instructions &amp; SLA dates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F28C45]" />
                <span>On-site status telemetry &amp; delay logging</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F28C45]" />
                <span>High-resolution before &amp; after resolution uploads</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-stone-400 border-t border-stone-700 pt-4">
            Demo Account: demo.field@civicsync.local
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-stone-200">
              <h3 className="font-heading font-bold text-lg text-stone-900">
                Field Technician Sign In
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
                  Field Technician Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#F28C45]"
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
                    onClick={() => alert('Please contact your department dispatcher or lead supervisor for password reset.')}
                    className="text-stone-500 hover:text-[#F28C45] text-[11px]"
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
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#F28C45]"
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
                className="w-full py-3.5 rounded-xl bg-[#F28C45] hover:bg-[#d97532] text-stone-950 font-extrabold uppercase tracking-wider transition shadow-md cursor-pointer mt-2"
              >
                Sign In to Field Console
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-stone-200 text-center text-[11px] text-stone-400">
            Field personnel credentials are administered by municipal department leads.
          </div>
        </div>
      </div>
    </div>
  );
};
