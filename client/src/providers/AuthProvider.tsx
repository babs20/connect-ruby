import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback } from 'react';

export interface AuthContext {
  token: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContext | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const login = async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          email: credentials.email,
          password: credentials.password,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const authToken = response.headers.get('Authorization')?.split(' ')[1];
    if (!authToken) {
      throw new Error('No token received');
    }

    setToken(authToken);
    localStorage.setItem('token', authToken);
  };

  const logout = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    setToken(null);
    localStorage.removeItem('token');
  };

  const authFetch = useCallback(
    (url: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return fetch(url, { ...options, headers });
    },
    [token],
  );

  const contextValue: AuthContext = {
    token,
    login,
    logout,
    authFetch,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
