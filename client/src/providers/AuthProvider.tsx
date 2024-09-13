import type { ReactNode } from 'react';
import React, { createContext, useContext, useCallback } from 'react';

export interface AuthContext {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContext | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const login = async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: 'POST',
      credentials: 'include',
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
  };

  const logout = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  };

  const authFetch = useCallback(
    (url: string, options: RequestInit = {}) => {
      return fetch(url, {
        ...options,
        credentials: 'include',
      });
    },
    [],
  );

  const contextValue: AuthContext = {
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
