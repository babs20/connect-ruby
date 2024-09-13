import type { ReactNode } from 'react';
import React, { createContext, useContext, useCallback } from 'react';

interface User {
  id: string;
  email: string;
}

export interface AuthContext {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
  isLoggedIn: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContext | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);

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

    setIsLoggedIn(true);
    const userData = await response.json();
    setUser(userData);
  };

  const logout = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    setIsLoggedIn(false);
    setUser(null);
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
    isLoggedIn,
    user,
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
