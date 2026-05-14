import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);
const USER_KEY = 'kds_user';
const TOKEN_KEY = 'kds_token';

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
  const [loading, setLoading] = useState(true);

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        setUser(res.data);
      } catch (err) {
        console.error('Session validation failed', err);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = useCallback(async ({ email, password }) => {
    try {
      // We use email as the username for the backend
      const res = await api.login({ username: email, password });
      const { token: nextToken, user: nextUser } = res.data;

      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      localStorage.setItem(TOKEN_KEY, nextToken);
      
      setUser(nextUser);
      setToken(nextToken);

      return nextUser;
    } catch (err) {
      const message = err.response?.data?.non_field_errors?.[0] || 
                      err.response?.data?.detail || 
                      'Invalid email or password.';
      throw new Error(message);
    }
  }, []);

  const signup = useCallback(async ({ email, password }) => {
    try {
      // Use email as username for simplicity
      const res = await api.signup({ 
        username: email, 
        email, 
        password,
        name: email.split('@')[0]
      });
      const { token: nextToken, user: nextUser } = res.data;

      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      localStorage.setItem(TOKEN_KEY, nextToken);

      setUser(nextUser);
      setToken(nextToken);

      return nextUser;
    } catch (err) {
      const message = err.response?.data?.email?.[0] || 
                      err.response?.data?.username?.[0] || 
                      'Could not create account. Please try again.';
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout API call failed', err);
    } finally {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }
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