import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeOffIcon, ChefHatIcon, StarIcon } from '../components/Icons';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login, signup, user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const cleanEmail = form.email.trim().toLowerCase();
  const detectedRole = useMemo(
    () => (cleanEmail.endsWith('@ejust.edu.eg') ? 'chef' : 'customer'),
    [cleanEmail],
  );

  const emailIsValid = emailPattern.test(cleanEmail);
  const passwordIsValid = form.password.length >= 6;
  const canSubmit = emailIsValid && passwordIsValid && !submitting;

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!loading && user) {
    return <Navigate to={user.role === 'chef' ? '/kitchen-dashboard' : '/menu'} replace />;
  }

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setToast(null);
  };

  const validateForm = () => {
    if (!form.email.trim() || !form.password.trim()) return 'Email and password are required.';
    if (!emailIsValid) return 'Please enter a valid email address.';
    if (!passwordIsValid) return 'Password must be at least 6 characters.';
    return '';
  };

  const handleAuth = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }
    setSubmitting(true);
    setError('');
    try {
      const loggedInUser = mode === 'signup' ? await signup(form) : await login(form);
      setToast({ type: 'success', message: mode === 'signup' ? 'Account created!' : 'Welcome back!' });
      setTimeout(() => {
        navigate(loggedInUser.role === 'chef' ? '/chef' : '/menu', { replace: true });
      }, 550);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setToast({ type: 'error', message: err.message || 'Authentication failed.' });
      if (err.code === 'ACCOUNT_NOT_FOUND') setTimeout(() => switchMode('signup'), 900);
    } finally {
      setSubmitting(false);
    }
  };

  const modeCopy = mode === 'login'
    ? { title: t('login_title'), button: t('login_button'), switchText: t('no_account_text'), switchAction: t('create_account') }
    : { title: t('create_account'), button: t('create_account'), switchText: t('signup_text'), switchAction: t('login_button') };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10" style={{ background: 'var(--bg-primary)' }}>
      {/* Warm ambient background */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top left, rgba(232,146,60,0.15), transparent 40%), radial-gradient(ellipse at bottom right, rgba(218,165,32,0.1), transparent 40%), var(--bg-primary)' }} />
      <div className="absolute inset-0 bg-grid opacity-60" />

      {/* Toast */}
      {toast && (
        <div className="fixed right-4 top-5 z-50 animate-fade-in rounded-2xl px-4 py-3 text-sm shadow-2xl backdrop-blur-md sm:right-6" style={{ background: 'rgba(var(--glass-color),0.1)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <span className={`h-2.5 w-2.5 rounded-full ${toast.type === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <span className="font-semibold" style={{ color: 'var(--cream)' }}>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        {/* Left — Welcome section */}
        <section className="hidden animate-fade-in-up lg:flex flex-col items-center text-center">
          <img src="/logo.png" alt="Ctrl+Alt+Eat" className="w-72 mb-8 animate-float" style={{ filter: 'drop-shadow(0 8px 30px rgba(var(--orange-rgb),0.25))' }} />
          <h1 className="text-4xl font-black leading-tight tracking-tight" style={{ color: 'var(--cream)' }}>
            {t('login_title')} <span className="gradient-text">Ctrl+Alt+Eat</span>
          </h1>
          <p className="mt-4 max-w-md text-base leading-7" style={{ color: 'var(--cream-muted)' }}>
            Your favorite campus kitchen, just a click away. Fresh meals, sweet treats, and refreshing drinks — all made to order.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            <span className="rounded-full px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(var(--orange-rgb),0.1)', border: '1px solid rgba(var(--orange-rgb),0.2)', color: 'var(--orange-light)' }}>
              <StarIcon /> Fresh & Delicious
            </span>
            <span className="rounded-full px-4 py-2" style={{ background: 'rgba(var(--glass-color),0.05)', border: '1px solid var(--border)', color: 'var(--cream-muted)' }}>
              Quick Ordering
            </span>
            <span className="rounded-full px-4 py-2" style={{ background: 'rgba(var(--glass-color),0.05)', border: '1px solid var(--border)', color: 'var(--cream-muted)' }}>
              Campus Favorites
            </span>
          </div>
        </section>

        {/* Right — Auth form */}
        <section className="mx-auto w-full max-w-md animate-fade-in-up rounded-[2rem] p-5 shadow-2xl sm:p-7" style={{ background: 'rgba(var(--glass-color),0.04)', border: '1px solid var(--border)', backdropFilter: 'blur(24px)' }}>
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <img src="/logo.png" alt="Ctrl+Alt+Eat" className="h-14" />
          </div>

          <div className="mb-7">
            {/* Mode toggle */}
            <div className="mb-5 inline-flex rounded-full p-1 text-sm font-semibold" style={{ background: 'rgba(var(--glass-color),0.05)', border: '1px solid var(--border)' }}>
              <button type="button" onClick={() => switchMode('login')}
                className={`rounded-full px-4 py-2 transition-all duration-300 ${mode === 'login' ? 'text-white shadow-lg' : ''}`}
                style={mode === 'login' ? { background: 'var(--orange)', boxShadow: '0 4px 16px rgba(232,146,60,0.35)' } : { color: 'var(--cream-subtle)' }}>
                Login
              </button>
              <button type="button" onClick={() => switchMode('signup')}
                className={`rounded-full px-4 py-2 transition-all duration-300 ${mode === 'signup' ? 'text-white shadow-lg' : ''}`}
                style={mode === 'signup' ? { background: 'var(--orange)', boxShadow: '0 4px 16px rgba(232,146,60,0.35)' } : { color: 'var(--cream-subtle)' }}>
                Sign Up
              </button>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--cream)' }}>{modeCopy.title}</h2>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: 'var(--cream-muted)' }} htmlFor="email">{t('email_placeholder')}</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
                className="input-field w-full rounded-2xl" placeholder="you@example.com" />
              {form.email && !emailIsValid && (
                <p className="mt-2 text-xs font-medium" style={{ color: 'var(--danger)' }}>Enter a valid email address.</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: 'var(--cream-muted)' }} htmlFor="password">{t('password_placeholder')}</label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange}
                  className="input-field w-full rounded-2xl pr-20" placeholder="At least 6 characters" />
                <button type="button" onClick={() => setShowPassword(c => !c)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 transition"
                  style={{ color: 'var(--orange-light)', fontSize: '1.1em' }}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {form.password && !passwordIsValid && (
                <p className="mt-2 text-xs font-medium" style={{ color: 'var(--danger)' }}>Password must be at least 6 characters.</p>
              )}
            </div>

            {/* Role detection */}
            <div className="rounded-2xl px-4 py-3 text-sm flex items-center gap-3" style={{ background: 'rgba(var(--orange-rgb),0.08)', border: '1px solid rgba(var(--orange-rgb),0.18)', color: 'var(--orange-light)' }}>
              {detectedRole === 'chef' ? <ChefHatIcon /> : <StarIcon />}
              <span>Detected role: <span className="font-bold capitalize">{detectedRole}</span></span>
            </div>

            {error && (
              <div className="animate-fade-in rounded-2xl px-4 py-3 text-sm font-medium" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: 'var(--danger)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={!canSubmit}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-extrabold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45"
              style={{ background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))', boxShadow: '0 6px 24px rgba(var(--orange-rgb),0.3)' }}>
              {submitting && <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />}
              <span>{submitting ? 'Please wait...' : modeCopy.button}</span>
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--cream-muted)' }}>
            {modeCopy.switchText}{' '}
            <button type="button" onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
              className="font-bold transition" style={{ color: 'var(--orange-light)' }}>
              {modeCopy.switchAction}
            </button>
          </p>
        </section>
      </div>
    </div>
  );
}