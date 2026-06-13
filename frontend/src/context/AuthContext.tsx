'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '@/lib/api';
import { normalizeEmail } from '@/lib/normalizeEmail';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object') {
    const axiosErr = err as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    if (axiosErr.response?.data?.message) return axiosErr.response.data.message;
    if (axiosErr.message) return axiosErr.message;
  }
  return 'Something went wrong. Please try again.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api
        .get('/auth/me')
        .then((res) => setUser(res.data.data))
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email: normalizeEmail(email), password });
    localStorage.setItem('token', res.data.data.token);
    setUser(res.data.data);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post('/auth/register', {
      name: name.trim(),
      email: normalizeEmail(email),
      password,
    });
    localStorage.setItem('token', res.data.data.token);
    setUser(res.data.data);
  };

  /**
   * Redirects the browser to the Express backend which then redirects to
   * Google's OAuth consent screen. On success Google redirects back to
   * /api/auth/google/callback → which issues a JWT and sends the browser to
   * /auth/callback?token=... where the token is stored and the user is
   * redirected to /dashboard.
   */
  const loginWithGoogle = () => {
    // Must be a direct URL to the Express server — Google OAuth requires a
    // real redirect, not the Next.js rewrite proxy.
    const backendBase =
      process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    window.location.href = `${backendBase}/api/auth/google`;
  };

  const refreshUser = async () => {
    const res = await api.get('/auth/me');
    setUser(res.data.data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: async (email, password) => {
          try {
            await login(email, password);
          } catch (err) {
            throw new Error(getErrorMessage(err));
          }
        },
        register: async (name, email, password) => {
          try {
            await register(name, email, password);
          } catch (err) {
            throw new Error(getErrorMessage(err));
          }
        },
        loginWithGoogle,
        refreshUser,
        logout: () => {
          localStorage.removeItem('token');
          setUser(null);
        },
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
