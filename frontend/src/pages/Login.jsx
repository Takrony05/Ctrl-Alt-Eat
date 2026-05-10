import React, { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, signup, user, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const detectedRole = useMemo(
    () => (form.email.trim().toLowerCase().endsWith('@ejust.edu.eg') ? 'chef' : 'customer'),
    [form.email],
  );

  if (!loading && user) {
    return <Navigate to={user.role === 'chef' ? '/chef' : '/menu'} replace />;
  }

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  };

  const handleAuth = async (action) => {
    if (!form.email.trim() || !form.password.trim()) {
      setError('Email and password are required.');
      return;
    }

    const loggedInUser = action === 'signup' ? await signup(form) : await login(form);
    navigate(loggedInUser.role === 'chef' ? '/chef' : '/menu', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-4 py-12 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">
              Kitchen Display System
            </p>
            <h1 className="mt-3 text-3xl font-extrabold">Login / Sign Up</h1>
            <p className="mt-2 text-sm text-white/60">
              Use an EJUST email for chef access. Other emails open the customer menu.
            </p>
          </div>

          <div className="space-y-4">
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
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-orange-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/75" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-orange-400"
                placeholder="Enter password"
              />
            </div>

            <div className="rounded-xl border border-orange-400/20 bg-orange-400/10 px-4 py-3 text-sm text-orange-100">
              Detected role: <span className="font-bold capitalize">{detectedRole}</span>
            </div>

            {error && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleAuth('login')}
                className="rounded-xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleAuth('signup')}
                className="rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/15"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}