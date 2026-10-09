import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User as UserIcon, 
  GraduationCap, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { useAuth, BITS_DEMO_ACCOUNTS } from '../context/AuthContext';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    login, 
    register, 
    demoLogin, 
    isLoading,
    authModalReason 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('evaluator');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [campus, setCampus] = useState('Pilani Campus');
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSuffixClick = (suffix: string) => {
    if (!email) {
      setEmail(`student${suffix}`);
    } else if (!email.includes('@')) {
      setEmail(`${email}${suffix}`);
    } else {
      const prefix = email.split('@')[0];
      setEmail(`${prefix}${suffix}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please provide a valid BITS institutional email.');
      return;
    }

    try {
      if (activeTab === 'login') {
        await login({ email, password, role, studentId });
      } else {
        if (!name.trim()) {
          setError('Please provide your full name.');
          return;
        }
        await register({ name, email, password, role, studentId, campus });
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* BITS Pilani Branded Header */}
        <div className="relative bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 px-6 py-5 border-b border-indigo-900/40">
          {/* Subtle gold / navy accent stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-indigo-500 to-amber-300"></div>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* BITS Emblem-style Insignia */}
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-700 to-amber-500 p-0.5 shadow-lg shadow-indigo-950 flex items-center justify-center flex-shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-300 font-bold text-xs tracking-tighter flex-col">
                  <span className="text-[10px] text-amber-400 font-mono tracking-widest font-black leading-none">BITS</span>
                  <span className="text-[8px] text-indigo-300 font-sans tracking-tight leading-none mt-0.5">PILANI</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    BITS Pilani Academic Portal
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700/70">
                    ZC229T
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  TestGenie Assignment Testing & Automated Grading System
                </p>
              </div>
            </div>

            <button
              onClick={closeAuthModal}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action explanation prompt if triggered by user click */}
          {authModalReason && (
            <div className="mt-3 text-[11px] text-amber-300 bg-amber-950/60 border border-amber-800/60 rounded-lg px-3 py-1.5 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>{authModalReason}</span>
            </div>
          )}
        </div>

        {/* Quick Demo Access Bar */}
        <div className="bg-slate-950/90 px-6 py-3 border-b border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              Instant 1-Click Evaluation Login:
            </span>
            <span className="text-[10px] text-slate-500 font-mono">No password required</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Primary Evaluator Demo */}
            <button
              type="button"
              onClick={() => demoLogin('evaluator')}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-900/90 to-indigo-800/90 hover:from-indigo-800 hover:to-indigo-700 border border-indigo-700/70 text-indigo-100 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all group cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>⚡ BITS Evaluator</span>
            </button>

            {/* Student Demo */}
            <button
              type="button"
              onClick={() => demoLogin('student')}
              className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>⚡ Student Demo</span>
            </button>
          </div>
        </div>

        {/* Tab Controls: Sign In vs Register */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(null); }}
            className={`py-2.5 text-xs font-semibold border-b-2 mr-6 transition-all ${
              activeTab === 'login'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Institutional Sign In
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setError(null); }}
            className={`py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'register'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            New Student / Faculty Registration
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/70 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Academic Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  role === 'student'
                    ? 'bg-indigo-950 text-indigo-200 border-indigo-600 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>BITS Student</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('evaluator')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  role === 'evaluator'
                    ? 'bg-amber-950 text-amber-200 border-amber-600 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>Evaluator / Faculty</span>
              </button>
            </div>
          </div>

          {/* Registration Extra Fields */}
          {activeTab === 'register' && (
            <>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Shivansh Shrivastava"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">BITS Campus</label>
                <select
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="Pilani Campus">Pilani Campus (Rajasthan)</option>
                  <option value="Goa Campus">K. K. Birla Goa Campus</option>
                  <option value="Hyderabad Campus">Hyderabad Campus</option>
                  <option value="Dubai Campus">Dubai Campus</option>
                  <option value="WILP Off-Campus">WILP Programmes Division</option>
                </select>
              </div>
            </>
          )}

          {/* Institutional Email Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-medium">Institutional BITS Email</label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => handleSuffixClick('@pilani.bits-pilani.ac.in')}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono hover:underline"
                >
                  +@pilani.bits-pilani.ac.in
                </button>
              </div>
            </div>

            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="f20220101@pilani.bits-pilani.ac.in"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Supports standard BITS domains (@pilani.bits-pilani.ac.in, @goa.bits-pilani.ac.in, or academic ID)
            </p>
          </div>

          {/* Student ID / Faculty ID */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {role === 'student' ? 'Student ID / Roll No' : 'Faculty / Staff ID'}
            </label>
            <div className="relative">
              <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder={role === 'student' ? 'e.g., 2022A7PS0101P' : 'e.g., BITS-FAC-CS-892'}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-medium">Password</label>
              {activeTab === 'login' && (
                <span className="text-[10px] text-slate-500 font-mono">Demo: any key / test</span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40 disabled:opacity-60 transition-all cursor-pointer"
            >
              {isLoading ? (
                <span>Authenticating with BITS Portal...</span>
              ) : activeTab === 'login' ? (
                <>
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Sign In to TestGenie</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Create BITS Academic Account</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure BITS WILP Single Sign-On</span>
          </div>
          <span className="font-mono text-indigo-400">Course ZC229T</span>
        </div>
      </div>
    </div>
  );
};
