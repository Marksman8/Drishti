import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  login,
  register,
  forgotPassword,
  loginWithGoogle,
  logout,
  isAuthenticated,
  getUser,
  onAuthChange,
} from '../services/AuthService';
import { logActivity } from '../services/Activity';
import GoogleSignInButton from './GoogleSignInButton';
import PhoneVerification from './PhoneVerification';

const HomeAuthForm = () => {
  const navigate = useNavigate();

  // STUDENT | INSTITUTION
  const [role, setRole] = useState('STUDENT');
  // LOGIN | REGISTER
  const [mode, setMode] = useState('LOGIN');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPhoneVerify, setShowPhoneVerify] = useState(false);

  const [authed, setAuthed] = useState(isAuthenticated());
  const [me, setMe] = useState(getUser());

  useEffect(() => {
    const unsub = onAuthChange(() => {
      setAuthed(isAuthenticated());
      setMe(getUser());
    });
    return () => unsub();
  }, []);

  const finishAuth = (result, expectedRole) => {
    const userRole = result?.user?.role;
    if (userRole !== expectedRole) {
      logout();
      setError(
        userRole === 'ADMIN'
          ? 'Admin accounts must log in through the admin portal.'
          : `This account is registered as ${userRole?.toLowerCase()}.`
      );
      return;
    }
    logActivity('LOGIN', `${userRole} signed in`);
    if (result?.phoneVerificationRequired) {
      setShowPhoneVerify(true);
      return;
    }
    navigate('/course');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'REGISTER') {
        await register({ email, password, fullName, role });
        setMode('LOGIN');
        setError('Registered! Now log in to continue.');
      } else {
        const result = await login({ email, password });
        finishAuth(result, role);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setError('');
    setLoading(true);
    try {
      const result = await loginWithGoogle(credential, role);
      finishAuth(result, role);
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email) {
      setError('Enter your email above first, then click "Forgot password?".');
      return;
    }
    try {
      const res = await forgotPassword(email);
      setError(res?.message || 'If an account exists, a reset link has been sent.');
    } catch (err) {
      setError(err.message || 'Could not send reset link.');
    }
  };

  // --- Logged-in: replace the form with a friendly welcome panel ---
  if (authed && me) {
    return (
      <div className="relative home-auth-enter">
        <div className="absolute -top-12 -right-12 w-72 h-72 bg-[#f4b41a]/20 rounded-full blur-[100px]" />
        <div className="relative bg-white/[0.05] backdrop-blur-xl border border-white/15 rounded-[2.5rem] p-10 shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4b41a] mb-3">Welcome back</p>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white leading-tight">
            {me.fullName || 'Drishti Learner'}
          </h2>
          <div className="w-12 h-1 bg-[#f4b41a] mt-4 rounded-full" />
          <p className="text-blue-100/70 text-sm mt-6 mb-8">
            You're signed in as <span className="font-bold text-white">{me.role?.toLowerCase()}</span>.
            Jump back into your courses or check your dashboard.
          </p>
          <div className="space-y-3">
            <Link
              to={me.role === 'ADMIN' ? '/admin' : '/course'}
              className="block w-full text-center bg-[#f4b41a] text-[#032b7a] py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all active:scale-95 shadow-lg shadow-yellow-900/20"
            >
              {me.role === 'ADMIN' ? 'Admin Console' : 'Browse Courses'}
            </Link>
            <Link
              to="/dashboard"
              className="block w-full text-center bg-white/10 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all"
            >
              My Dashboard
            </Link>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="w-full text-slate-300 hover:text-white text-[10px] font-bold uppercase tracking-widest pt-2"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Logged-out: the auth form ---
  const isLogin = mode === 'LOGIN';
  const isStudent = role === 'STUDENT';

  return (
    <div className="relative home-auth-enter">
      {/* Glow */}
      <div className="absolute -top-16 -right-16 w-72 h-72 bg-[#f4b41a]/20 rounded-full blur-[100px] pointer-events-none home-auth-glow" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none home-auth-glow" style={{ animationDelay: '3s' }} />

      <div className="relative bg-white/[0.05] backdrop-blur-xl border border-white/15 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
        <div className="flex justify-between items-baseline mb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4b41a]">
              {isLogin ? 'Welcome back' : 'Join Drishti'}
            </p>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white mt-1">
              {isLogin ? 'Sign in' : 'Create account'}
            </h2>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-blue-100/50">
            {isStudent ? 'Student' : 'Institution'}
          </div>
        </div>

        {/* Role tabs */}
        <div className="flex bg-black/20 border border-white/10 rounded-full p-1 mb-6">
          <RoleTab active={isStudent} onClick={() => setRole('STUDENT')}>Student</RoleTab>
          <RoleTab active={!isStudent} onClick={() => setRole('INSTITUTION')}>Institution</RoleTab>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3" key={`${role}-${mode}`}>
          {!isLogin && (
            <input
              type="text"
              placeholder={isStudent ? 'Full name' : 'Institution name'}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#f4b41a] transition-all home-auth-field-enter"
            />
          )}
          <input
            type="email"
            placeholder={isStudent ? 'Email address' : 'Official email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#f4b41a] transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#f4b41a] transition-all"
          />

          {error && (
            <p className="text-[11px] text-yellow-200/90 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2 home-auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f4b41a] text-[#032b7a] py-3.5 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all active:scale-95 shadow-lg shadow-yellow-900/20 disabled:opacity-50"
          >
            {loading ? 'Processing…' : (isLogin ? 'Log in' : 'Sign up')}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[9px] font-bold text-blue-100/40 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <GoogleSignInButton onCredential={handleGoogleCredential} />

        <div className="flex justify-between items-center mt-5 text-[10px] font-bold uppercase tracking-widest">
          <button
            type="button"
            onClick={() => { setMode(isLogin ? 'REGISTER' : 'LOGIN'); setError(''); }}
            className="text-blue-100/60 hover:text-[#f4b41a] transition-colors"
          >
            {isLogin ? 'New here? Register' : 'Have an account? Log in'}
          </button>
          {isLogin && (
            <button
              type="button"
              onClick={handleForgot}
              className="text-blue-100/40 hover:text-[#f4b41a] transition-colors"
            >
              Forgot password?
            </button>
          )}
        </div>
      </div>

      {showPhoneVerify && (
        <PhoneVerification
          onVerified={() => { setShowPhoneVerify(false); navigate('/course'); }}
        />
      )}
    </div>
  );
};

const RoleTab = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
      active
        ? 'bg-[#f4b41a] text-[#032b7a] shadow-lg shadow-yellow-900/20'
        : 'text-blue-100/60 hover:text-white'
    }`}
  >
    {children}
  </button>
);

export default HomeAuthForm;
