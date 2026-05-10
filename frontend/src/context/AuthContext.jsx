import React, { createContext, useCallback, useContext, useState } from 'react';

const AuthContext = createContext(null);
const ACCOUNTS_KEY = 'kds_accounts';
const USER_KEY = 'kds_user';
const TOKEN_KEY = 'kds_token';

function getRoleFromEmail(email) {
  return email.trim().toLowerCase().endsWith('@ejust.edu.eg') ? 'chef' : 'customer';
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function createUser(email) {
  const cleanEmail = normalizeEmail(email);
  return {
    email: cleanEmail,
    name: cleanEmail.split('@')[0],
    role: getRoleFromEmail(cleanEmail),
  };
}

function readAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || {};
  } catch (_) {
    return {};
  }
}

function saveSession(nextUser) {
  const nextToken = `demo-token-${Date.now()}`;
  localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  localStorage.setItem(TOKEN_KEY, nextToken);
  return nextToken;
}

function createAuthError(message, code) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (_) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading] = useState(false);

  const login = useCallback(async ({ email, password }) => {
    const cleanEmail = normalizeEmail(email);
    const accounts = readAccounts();
    const account = accounts[cleanEmail];

    if (!account) {
      throw createAuthError('Account not found. Please sign up first.', 'ACCOUNT_NOT_FOUND');
    }

    if (account.password !== password) {
      throw createAuthError('Incorrect password. Please try again.', 'INVALID_PASSWORD');
    }

    const nextUser = createUser(cleanEmail);
    const nextToken = saveSession(nextUser);
    setUser(nextUser);
    setToken(nextToken);

    return nextUser;
  }, []);

  const signup = useCallback(async ({ email, password }) => {
    const cleanEmail = normalizeEmail(email);
    const accounts = readAccounts();

    if (accounts[cleanEmail]) {
      throw createAuthError('Account already exists. Please log in.', 'ACCOUNT_EXISTS');
    }

    const nextUser = createUser(cleanEmail);
    const nextAccounts = {
      ...accounts,
      [cleanEmail]: {
        email: cleanEmail,
        password,
        role: nextUser.role,
        createdAt: new Date().toISOString(),
      },
    };

    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(nextAccounts));
    const nextToken = saveSession(nextUser);
    setUser(nextUser);
    setToken(nextToken);

    return nextUser;
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
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