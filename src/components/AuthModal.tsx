import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
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
  ArrowRight,
  Smartphone,
  RefreshCw,
  Shield,
  Clock,
  Laptop,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    user,
    isAuthenticated,
    isMfaStep,
    mfaPendingUser,
    mfaCodePreview,
    login, 
    register, 
    verifyMfa,
    resendMfaCode,
    cancelMfa,
    toggleMfaSetting,
    triggerMfaChallengeForCurrentSession,
    demoLogin, 
    logout,
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
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // MFA OTP states
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [trustDevice, setTrustDevice] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMfaStep && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMfaStep, timerSeconds]);

  // When MFA step opens, auto-focus first OTP input
  useEffect(() => {
    if (isMfaStep) {
      setTimerSeconds(300);
      setOtpDigits(['', '', '', '', '', '']);
      setError(null);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isMfaStep]);

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

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please provide a valid BITS institutional email.');
      return;
    }

    try {
      if (activeTab === 'login') {
        const derivedName = name.trim() || undefined;
        await login({ 
          email: email.trim(), 
          password, 
          role, 
          studentId: studentId.trim() || undefined,
          name: derivedName,
          skipMfa: false, // Enforce MFA step
        });
      } else {
        if (!name.trim()) {
          setError('Please provide your full name.');
          return;
        }
        await register({ 
          name: name.trim(), 
          email: email.trim(), 
          password, 
          role, 
          studentId: studentId.trim() || undefined, 
          campus 
        });
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric inputs
    const cleanVal = value.replace(/\D/g, '');
    
    // Handle paste of full 6-digit code
    if (cleanVal.length > 1) {
      const chars = cleanVal.slice(0, 6).split('');
      const updated = [...otpDigits];
      chars.forEach((c, idx) => {
        if (idx < 6) updated[idx] = c;
      });
      setOtpDigits(updated);
      const nextIndex = Math.min(chars.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    const updated = [...otpDigits];
    updated[index] = cleanVal ? cleanVal[0] : '';
    setOtpDigits(updated);

    // Auto move focus to next input
    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillMfa = () => {
    const code = mfaCodePreview || '784229';
    const digits = code.slice(0, 6).split('');
    setOtpDigits(digits);
    otpInputRefs.current[5]?.focus();
  };

  const handleVerifyMfaSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    const code = otpDigits.join('');

    if (code.length < 6) {
      setError('Please enter the full 6-digit authentication code.');
      return;
    }

    try {
      await verifyMfa(code, trustDevice);
    } catch (err: any) {
      setError(err?.message || 'Invalid or expired 6-digit MFA code. Please try again.');
    }
  };

  const handleResend = async () => {
    try {
      setError(null);
      await resendMfaCode();
      setTimerSeconds(300);
      setSuccessMsg('A new 6-digit code has been generated and sent.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (e: any) {
      setError('Failed to resend authentication code.');
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
                    {isAuthenticated && !isMfaStep
                      ? 'Academic Profile & MFA Security'
                      : isMfaStep
                      ? 'BITS Duo 2FA Verification'
                      : 'BITS Pilani Academic Portal'}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700/70">
                    ZC229T
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {isMfaStep 
                    ? 'Dual-Factor Authentication Gate (Security Policy)' 
                    : 'TestGenie Assignment Testing & Automated Grading System'}
                </p>
              </div>
            </div>

            <button
              onClick={closeAuthModal}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close modal"
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

        {/* ========================================================= */}
        {/* VIEW 1: AUTHENTICATED USER PROFILE & MFA SECURITY CENTER */}
        {/* ========================================================= */}
        {isAuthenticated && user && !isMfaStep && (
          <div className="p-6 overflow-y-auto space-y-5 text-xs">
            {/* User Identity Card */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shadow-md ${
                  user.role === 'evaluator'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50'
                }`}>
                  {user.role === 'evaluator' ? (
                    <GraduationCap className="w-6 h-6 text-amber-400" />
                  ) : (
                    <UserIcon className="w-6 h-6 text-indigo-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{user.name}</h4>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      user.role === 'evaluator'
                        ? 'bg-amber-950/90 text-amber-300 border border-amber-700/60'
                        : 'bg-indigo-950/90 text-indigo-300 border border-indigo-700/60'
                    }`}>
                      {user.role === 'evaluator' ? 'Faculty Evaluator' : 'Enrolled Student'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                    <span>ID: <strong className="text-slate-300 font-mono">{user.studentId || '2022A7PS0101P'}</strong></span>
                    <span>•</span>
                    <span>{user.campus || 'Pilani Campus'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MFA Security Compliance Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/50 via-slate-950 to-slate-950 border border-indigo-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                      Multi-Factor Authentication (MFA)
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                        Active & Enforced
                      </span>
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Protected via BITS Duo Security & Institutional 2FA
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleMfaSetting(!user.mfaEnabled)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                    user.mfaEnabled
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700/80'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title="Toggle MFA enforcement state"
                >
                  {user.mfaEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Laptop className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Trust Status: <strong className="text-slate-200">Verified Workstation</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Provider: <strong className="text-slate-200">BITS Duo Mobile</strong></span>
                </div>
              </div>

              {/* Test MFA Challenge Button (For Professor / Evaluator grading demonstration) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={triggerMfaChallengeForCurrentSession}
                  className="w-full py-2 px-3 rounded-lg bg-indigo-900/40 hover:bg-indigo-900/70 border border-indigo-700/70 text-indigo-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer group"
                >
                  <Shield className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span>⚡ Test / Re-verify 2FA Challenge Screen</span>
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                </button>
              </div>
            </div>

            {/* Account Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  logout();
                  setActiveTab('login');
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 hover:underline"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Current Session</span>
              </button>

              <button
                type="button"
                onClick={closeAuthModal}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: STEP 2 - MULTI-FACTOR AUTHENTICATION CHALLENGE   */}
        {/* ========================================================= */}
        {isMfaStep && (
          <div className="p-6 overflow-y-auto space-y-4 text-xs">
            {/* MFA Security Banner */}
            <div className="text-center space-y-1.5 py-1">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 p-0.5 shadow-lg shadow-indigo-950 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-amber-400 animate-pulse" />
                </div>
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                Two-Factor Security Verification
              </h4>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">
                A 6-digit verification code has been dispatched to your BITS institutional credentials:
              </p>
              <div className="inline-block px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-300 font-semibold">
                {mfaPendingUser?.email || 'student@pilani.bits-pilani.ac.in'}
              </div>
            </div>

            {/* Error or Success notification */}
            {error && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/70 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/70 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* 6-Digit OTP Form */}
            <form onSubmit={handleVerifyMfaSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium text-center mb-2">
                  Enter 6-Digit BITS Duo Passcode
                </label>
                <div className="flex items-center justify-center gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpInputRefs.current[idx] = el; }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`w-11 h-12 text-center text-lg font-mono font-bold rounded-xl border bg-slate-950 text-white transition-all focus:outline-none ${
                        digit
                          ? 'border-indigo-500 bg-indigo-950/40 shadow-sm shadow-indigo-900'
                          : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Academic Evaluator Auto-Fill Helper Card */}
              <div className="p-3 rounded-xl bg-slate-950/90 border border-indigo-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Active Demo Passcode:
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-300 bg-amber-950/70 border border-amber-800/60 px-2 py-0.5 rounded">
                    {mfaCodePreview || '784229'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    Master codes: <code className="text-slate-400 font-mono">784229</code> or <code className="text-slate-400 font-mono">123456</code>
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoFillMfa}
                    className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
                  >
                    <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>Auto-Fill Code</span>
                  </button>
                </div>
              </div>

              {/* Workstation Trust & Resend Timer */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={trustDevice}
                    onChange={(e) => setTrustDevice(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0 w-3.5 h-3.5"
                  />
                  <span className="text-[11px] text-slate-400">
                    Trust this workstation for 30 days
                  </span>
                </label>

                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{formatTimer(timerSeconds)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={isLoading || otpDigits.join('').length < 6}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying Two-Factor Code...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-200" />
                      <span>Verify & Complete Authentication</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={cancelMfa}
                    className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    ← Back to Institutional Login
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isLoading}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend Passcode</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: STEP 1 - CREDENTIALS & DEMO ACCESS                */}
        {/* ========================================================= */}
        {!isMfaStep && (!isAuthenticated || !user) && (
          <>
            {/* Quick Demo Access Bar */}
            <div className="bg-slate-950/90 px-6 py-3 border-b border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                  Instant Evaluator & MFA Testing Access:
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  MFA Protected
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Primary Evaluator Demo (Instant Pre-verified MFA) */}
                <button
                  type="button"
                  onClick={() => demoLogin('evaluator', false)}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-900/90 to-indigo-800/90 hover:from-indigo-800 hover:to-indigo-700 border border-indigo-700/70 text-indigo-100 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer group"
                  title="Instant Evaluator login with pre-verified MFA"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <span>⚡ Evaluator (1-Click)</span>
                </button>

                {/* Simulate Full MFA Challenge */}
                <button
                  type="button"
                  onClick={() => demoLogin('student', true)}
                  className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-cyan-200 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                  title="Test the complete 2FA challenge and verification screen"
                >
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>⚡ Test 2FA Challenge</span>
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
            <form onSubmit={handleCredentialsSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
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
                  Protected by 2FA: An authentication passcode will be dispatched on next step.
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
                    <span>Initiating Secure Session...</span>
                  ) : activeTab === 'login' ? (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Proceed to Two-Factor Verification</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Register & Configure MFA</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Multi-Factor Authentication (MFA) Active</span>
          </div>
          <span className="font-mono text-indigo-400">BITS ZC229T Engine</span>
        </div>
      </div>
    </div>
  );
};
