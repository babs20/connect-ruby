import type { TUserSchema } from '@/api/schemas/shared/base';
import { GetCurrentUserResponseSchema, PostLoginRequestSchema } from '@/api/schemas/users';
import React, { createContext, useContext, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface AuthContext {
  // Helpers
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;

  // State
  isLoading: boolean;
  isLoggedIn: boolean;
  user: TUserSchema | null;
}

const AuthContext = createContext<AuthContext | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState<TUserSchema | null>(null);

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

    const body = await response.json();
    const parsedBody = PostLoginRequestSchema.safeParse(body);

    if (!parsedBody.success || !parsedBody.data.data) {
      console.error('Failed to parse login response', parsedBody.error);
      setIsLoggedIn(false);
      return;
    }

    setUser(parsedBody.data.data.attributes);
    setIsLoggedIn(true);
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

  const authFetch = useCallback((url: string, options: RequestInit = {}) => {
    return fetch(url, {
      ...options,
      credentials: 'include',
    });
  }, []);

  const getCurrentUser = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/current_user`, {
      credentials: 'include',
    });

    if (!response.ok) {
      setUser(null);
      setIsLoggedIn(false);
      return;
    }

    const body = await response.json();
    const parsedUser = GetCurrentUserResponseSchema.safeParse(body);

    if (!parsedUser.success || !parsedUser.data.data) {
      console.error('Failed to parse user data', parsedUser.error);
      setUser(null);
      setIsLoggedIn(false);
      return;
    }

    setUser(parsedUser.data.data.attributes);
    setIsLoggedIn(true);
  };

  useEffect(() => {
    void getCurrentUser().finally(() => setIsLoading(false));
  }, []);

  const contextValue: AuthContext = {
    login,
    logout,
    authFetch,
    isLoading,
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
