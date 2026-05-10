import React, { createContext, useCallback, useContext, useState } from 'react';

const AuthContext = createContext(null);

function getRoleFromEmail(email) {
  return email.trim().toLowerCase().endsWith('@ejust.edu.eg') ? 'chef' : 'customer';
}

function createUser(email) {
  const cleanEmail = email.trim().toLowerCase();
  return {
    email: cleanEmail,
    name: cleanEmail.split('@')[0],
    role: getRoleFromEmail(cleanEmail),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('kds_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('kds_token'));
  const [loading] = useState(false);

  const authenticate = useCallback(async ({ email }) => {
    const nextUser = createUser(email);
    const nextToken = `demo-token-${Date.now()}`;

    localStorage.setItem('kds_user', JSON.stringify(nextUser));
    localStorage.setItem('kds_token', nextToken);
    setUser(nextUser);
    setToken(nextToken);

    return nextUser;
  }, []);

  const login = useCallback((credentials) => authenticate(credentials), [authenticate]);
  const signup = useCallback((credentials) => authenticate(credentials), [authenticate]);

  const logout = useCallback(async () => {
    localStorage.removeItem('kds_user');
    localStorage.removeItem('kds_token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}