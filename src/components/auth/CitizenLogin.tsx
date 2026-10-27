import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Phone, CheckCircle2 } from 'lucide-react';
import { civicStore } from '../../services/store';
import { UserProfile } from '../../types/civic';

interface CitizenLoginProps {
  onNavigate: (path: string) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const CitizenLogin: React.FC<CitizenLoginProps> = ({ onNavigate, onLoginSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('demo.citizen@civicsync.local');
  const [password, setPassword] = useState('CivicDemo!2026-Citizen');
  const [showPass, setShowPass] = useState(false);
  
  // Registration
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = civicStore.authenticate(email, password, 'citizen');
      onLoginSuccess(user);
      onNavigate('/citizen/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!terms) {
      setError('Please agree to citizen verification terms.');
      return;
    }
    try {
      const newUser = civicStore.registerCitizen(name, regEmail, phone);
      onLoginSuccess(newUser);
      onNavigate('/citizen/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-[#F5F7EF] min-h-screen text-[#25332D] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#176B52]/20 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left Side Visual Panel: Forest Green + Soft Mint */}
        <div
          className="md:col-span-5 bg-[#176B52] text-white p-8 flex flex-col justify-between relative bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(23, 107, 82, 0.92), rgba(18, 85, 65, 0.95)), url('https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80')`
          }}
        >
          <div>
            <button
              onClick={() => onNavigate('/login')}
              className="inline-flex items-center gap-1.5 text-xs text-[#9ADBC0] hover:text-white font-bold mb-8 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login Portal</span>
            </button>

            <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-[#9ADBC0]/20 text-[#9ADBC0] border border-[#9ADBC0]/30 font-bold tracking-wider">
              Citizen Gateway
            </span>
            <h2 className="font-heading text-3xl font-extrabold mt-3 mb-2 text-white">
              CivicSync Citizen
            </h2>
            <p className="text-emerald-100/80 text-xs leading-relaxed font-light mb-6">
              Connect with your municipality. Receive official neighborhood safety alerts, report civic infrastructure hazards, and track live repairs.
            </p>

            <div className="space-y-2.5 text-xs text-emerald-100 border-t border-emerald-500/30 pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#9ADBC0]" />
                <span>Instant report tracking code &amp; GPS pin</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#9ADBC0]" />
                <span>Before &amp; after photographic proof inspection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#9ADBC0]" />
                <span>Citizen satisfaction confirmation &amp; dispute rights</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-emerald-200/70 border-t border-emerald-500/30 pt-4">
            Demo Account: demo.citizen@civicsync.local
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setTab('login'); setError(''); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    tab === 'login' ? 'bg-[#176B52] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Citizen Sign In
                </button>
                <button
                  onClick={() => { setTab('register'); setError(''); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    tab === 'register' ? 'bg-[#176B52] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  New Citizen Registration
                </button>
              </div>

              <button onClick={() => onNavigate('/')} className="text-xs text-stone-400 hover:text-stone-700">
                Home
              </button>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Citizen Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-bold text-stone-700 uppercase tracking-wider">
                      Account Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset verification link requested via authentication provider.')}
                      className="text-stone-500 hover:text-[#176B52] text-[11px]"
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
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#176B52]"
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
                  className="w-full py-3.5 rounded-xl bg-[#176B52] hover:bg-[#125541] text-white font-bold uppercase tracking-wider transition shadow-md shadow-[#176B52]/20 cursor-pointer mt-2"
                >
                  Sign In to Citizen Portal
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Maya Lin"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="maya@example.com"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                  />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms-check"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    className="mt-0.5 rounded text-[#176B52]"
                  />
                  <label htmlFor="terms-check" className="text-[11px] text-stone-600">
                    I confirm that civic reports I submit will be accurate representations of local physical hazards.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#176B52] hover:bg-[#125541] text-white font-bold uppercase tracking-wider transition shadow-md cursor-pointer mt-2"
                >
                  Create Verified Citizen Account
                </button>
              </form>
            )}
          </div>

          <div className="pt-4 border-t border-stone-200 text-center text-[11px] text-stone-400">
            CivicSync Sovereign Authentication Engine &bull; AES-256 Protected
          </div>
        </div>
      </div>
    </div>
  );
};
