import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login, signup, user, loading } = useAuth();
  const navigate = useNavigate();

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
    return <Navigate to={user.role === 'chef' ? '/chef' : '/menu'} replace />;
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
    if (!form.email.trim() || !form.password.trim()) {
      return 'Email and password are required.';
    }

    if (!emailIsValid) {
      return 'Please enter a valid email address.';
    }

    if (!passwordIsValid) {
      return 'Password must be at least 6 characters.';
    }

    return '';
  };

  const handleAuth = async (event) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const loggedInUser = mode === 'signup' ? await signup(form) : await login(form);
      setToast({ type: 'success', message: mode === 'signup' ? 'Account created successfully.' : 'Logged in successfully.' });

      setTimeout(() => {
        navigate(loggedInUser.role === 'chef' ? '/chef' : '/menu', { replace: true });
      }, 550);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setToast({ type: 'error', message: err.message || 'Authentication failed.' });

      if (err.code === 'ACCOUNT_NOT_FOUND') {
        setTimeout(() => switchMode('signup'), 900);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const modeCopy = mode === 'login'
    ? {
        title: 'Welcome back',
        subtitle: 'Log in with the account you created on this device.',
        button: 'Login',
        switchText: "Don't have an account?",
        switchAction: 'Sign Up',
      }
    : {
        title: 'Create your account',
        subtitle: 'Sign up once, then use the same email and password to log in.',
        button: 'Sign Up',
        switchText: 'Already have an account?',
        switchAction: 'Login',
      };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0f] px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.22),transparent_34%),linear-gradient(135deg,#0a0a0f_0%,#17151f_48%,#111827_100%)]" />
      <div className="absolute inset-0 bg-grid opacity-70" />
      <div className="absolute left-0 top-0 h-24 w-full bg-gradient-to-b from-white/5 to-transparent" />

      {toast && (
        <div className="fixed right-4 top-5 z-50 animate-fade-in rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm shadow-2xl backdrop-blur-md sm:right-6">
          <div className="flex items-center gap-3">
            <span className={`h-2.5 w-2.5 rounded-full ${toast.type === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <span className="font-semibold text-white">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
        <section className="hidden animate-fade-in-up lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">
            Kitchen Display System
          </p>
          <h1 className="mt-4 max-w-xl text-5xl font-black leading-tight tracking-tight">
            Fast sign-in for chefs and customers.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/65">
            Your email decides where you land: EJUST staff move to the chef dashboard, while everyone else goes straight to the customer menu.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
            <span className="rounded-full border border-orange-300/20 bg-orange-300/10 px-4 py-2">Role-aware routing</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Local demo accounts</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Responsive UI</span>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md animate-fade-in-up rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-7">
          <div className="mb-7">
            <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 p-1 text-sm font-semibold">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`rounded-full px-4 py-2 transition-all duration-300 ${mode === 'login' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' : 'text-white/55 hover:text-white'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`rounded-full px-4 py-2 transition-all duration-300 ${mode === 'signup' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' : 'text-white/55 hover:text-white'}`}
              >
                Sign Up
              </button>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight">{modeCopy.title}</h2>
            <p className="mt-2 text-sm leading-6 text-white/60">{modeCopy.subtitle}</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-white/75" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-white/30 hover:border-white/20 focus:border-orange-400 focus:bg-black/30 focus:ring-4 focus:ring-orange-400/10"
                placeholder="you@example.com"
              />
              {form.email && !emailIsValid && (
                <p className="mt-2 text-xs font-medium text-red-300">Enter a valid email address.</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/75" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 pr-20 text-white outline-none transition-all duration-300 placeholder:text-white/30 hover:border-white/20 focus:border-orange-400 focus:bg-black/30 focus:ring-4 focus:ring-orange-400/10"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-bold text-orange-200 transition hover:bg-white/10 hover:text-white"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {form.password && !passwordIsValid && (
                <p className="mt-2 text-xs font-medium text-red-300">Password must be at least 6 characters.</p>
              )}
            </div>

            <div className="rounded-2xl border border-orange-400/20 bg-orange-400/10 px-4 py-3 text-sm text-orange-100 transition-all duration-300">
              Detected role: <span className="font-bold capitalize">{detectedRole}</span>
            </div>

            {error && (
              <div className="animate-fade-in rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3.5 font-extrabold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-orange-500/40 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {submitting && <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />}
              <span>{submitting ? 'Please wait...' : modeCopy.button}</span>
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/55">
            {modeCopy.switchText}{' '}
            <button
              type="button"
              onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
              className="font-bold text-orange-300 transition hover:text-orange-200"
            >
              {modeCopy.switchAction}
            </button>
          </p>
        </section>
      </div>
    </div>
  );
}