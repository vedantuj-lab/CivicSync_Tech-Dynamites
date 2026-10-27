import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { UserRole, UserProfile } from '../../types/civic';
import { DEMO_USERS, civicStore } from '../../services/store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'citizen'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('maya.lin@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  
  // Register fields (Citizen only)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSelectDemoUser = (user: UserProfile) => {
    civicStore.setCurrentUser(user.id);
    onLoginSuccess(user);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Find user by email
    const state = civicStore.getState();
    const found = state.users.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
    if (found) {
      civicStore.setCurrentUser(found.id);
      onLoginSuccess(found);
      onClose();
    } else {
      setErrorMessage('Account not found with this email. Try one of the demonstration accounts or register below.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim() || !regEmail.trim()) {
      setErrorMessage('Please provide your full legal name and email.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please confirm agreement to CivicSync terms and verification standards.');
      return;
    }

    try {
      const newUser = civicStore.registerCitizen(regName.trim(), regEmail.trim(), regPhone.trim());
      onLoginSuccess(newUser);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] text-[#26243A] rounded-3xl shadow-2xl overflow-hidden border border-stone-200 grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left Information Panel (Indigo & Coral theme) */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#4338CA] via-[#3730A3] to-[#312E81] text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#FF8066]/20 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-[#FF8066] text-[#FAF8F5] font-black text-lg flex items-center justify-center shadow-lg">
                CS
              </div>
              <span className="font-heading font-extrabold text-xl text-white">CivicSync Auth</span>
            </div>

            <h2 className="font-heading text-2xl font-bold mb-3 leading-tight text-white">
              Unified Access to Municipal Operations
            </h2>
            <p className="text-indigo-100/80 text-xs leading-relaxed mb-6 font-light">
              Secure authentication with role-isolated permissions for citizens, municipal directors, and field repair technicians.
            </p>

            <div className="space-y-3 border-t border-indigo-400/20 pt-6">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#FF8066] font-semibold">
                Instant Demo Personas
              </div>
              {DEMO_USERS.map((usr) => (
                <button
                  key={usr.id}
                  onClick={() => handleSelectDemoUser(usr)}
                  className="w-full text-left p-2.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-400/20 transition flex items-center gap-3 cursor-pointer group"
                >
                  <img src={usr.avatarUrl} alt={usr.name} className="w-8 h-8 rounded-full object-cover border border-indigo-300" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-[#FF8066] transition truncate">
                      {usr.name}
                    </div>
                    <div className="text-[10px] text-indigo-200/70 uppercase font-mono">
                      {usr.role.replace('_', ' ')}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-300 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-indigo-400/20 text-[11px] text-indigo-200/60 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FF8066]" />
            <span>End-to-End Audit & RBAC Protection</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => { setMode('login'); setErrorMessage(''); }}
                  className={`px-4 py-2 rounded-lg transition ${
                    mode === 'login' ? 'bg-[#4338CA] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMode('register'); setErrorMessage(''); }}
                  className={`px-4 py-2 rounded-lg transition ${
                    mode === 'register' ? 'bg-[#4338CA] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Citizen Registration
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {errorMessage}
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. maya.lin@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Account Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset verification email requested through authentication provider.')}
                      className="text-xs text-[#4338CA] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#4338CA] hover:bg-[#3730A3] text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-[#4338CA]/20 cursor-pointer"
                  >
                    Authenticate & Enter Workspace
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Maya Lin"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="maya@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Phone (Optional for SMS Alerts)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+1 (555) 234-8891"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-stone-300 text-[#4338CA] focus:ring-[#4338CA]"
                  />
                  <label htmlFor="terms" className="text-[11px] text-stone-600 leading-tight">
                    I verify that reports I submit will be accurate representations of physical hazards in my community.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#4338CA] hover:bg-[#3730A3] text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-[#4338CA]/20 cursor-pointer mt-2"
                >
                  Create Citizen Account
                </button>
              </form>
            )}
          </div>

          <div className="pt-6 border-t border-stone-100 text-center text-xs text-stone-500">
            Municipal personnel accounts are provisioned exclusively through authorized agency administrators.
          </div>
        </div>
      </div>
    </div>
  );
};
