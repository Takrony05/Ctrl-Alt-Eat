import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, signup, user, loading } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode]         = useState('login'); // 'login' | 'signup'
  const [form, setForm]         = useState({ username: '', email: '', password: '', name: '' });
  const [error, setError]       = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Already logged in
  if (!loading && user) {
    return <Navigate to={user.role === 'chef' ? '/chef' : '/menu'} replace />;
  }

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      let loggedInUser;
      if (mode === 'login') {
        loggedInUser = await login({ username: form.username, password: form.password });
      } else {
        loggedInUser = await signup(form);
      }
      navigate(loggedInUser.role === 'chef' ? '/chef' : '/menu', { replace: true });
    } catch (err) {
      const data = err?.response?.data;
      if (data) {
        const msgs = Object.values(data).flat().join(' ');
        setError(msgs || 'Something went wrong.');
      } else {
        setError('Network error. Is the backend running?');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isChefEmail = mode === 'signup' && form.email.toLowerCase().endsWith('@ejust.edu.eg');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl shadow-lg shadow-orange-500/30 mb-4">
            <span className="text-3xl">🍽️</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Ctrl-Alt-Eat</h1>
          <p className="text-slate-400 mt-1 text-sm">Kitchen Display System</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 rounded-3xl">
          {/* Tab toggle */}
          <div className="flex bg-slate-800/60 rounded-xl p-1 mb-6 gap-1">
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === m
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name — signup only */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="input-field"
                />
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="username"
                required
                className="input-field"
              />
            </div>

            {/* Email — signup only */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required={mode === 'signup'}
                  className="input-field"
                />
                {isChefEmail && (
                  <p className="mt-1.5 text-xs text-orange-400 font-medium flex items-center gap-1">
                    <span>👨‍🍳</span> Chef account detected (EJUST domain)
                  </p>
                )}
                {mode === 'signup' && form.email && !isChefEmail && (
                  <p className="mt-1.5 text-xs text-sky-400 font-medium flex items-center gap-1">
                    <span>🛒</span> Customer account
                  </p>
                )}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                className="input-field"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary mt-2"
            >
              {submitting
                ? <span className="flex items-center justify-center gap-2"><span className="spinner" /> Processing…</span>
                : mode === 'login' ? 'Sign In' : 'Create Account'
              }
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Chef accounts: use your <span className="text-orange-400">@ejust.edu.eg</span> email
        </p>
      </div>
    </div>
  );
}
