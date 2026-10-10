import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import {
  registerUser,
  loginUser,
  fetchCurrentUser,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
} from '../services/apiClient';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load current user from session or backend on mount
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      const savedToken = getAuthToken();
      if (!savedToken) {
        if (isMounted) {
          setUser(null);
          setToken(null);
          setIsLoading(false);
        }
        return;
      }

      // Check stored user cache first for fast responsiveness
      try {
        const cachedUser = localStorage.getItem('sitegen_auth_user');
        if (cachedUser) {
          const parsed = JSON.parse(cachedUser);
          if (parsed && isMounted) {
            setUser(parsed);
          }
        }
      } catch {}

      // Validate session with backend
      try {
        const currentUser = await fetchCurrentUser();
        if (isMounted) {
          if (currentUser) {
            setUser(currentUser);
            localStorage.setItem('sitegen_auth_user', JSON.stringify(currentUser));
          } else {
            // Invalid / expired token
            removeAuthToken();
            localStorage.removeItem('sitegen_auth_user');
            setUser(null);
            setToken(null);
          }
        }
      } catch {
        // Network failure; keep offline cache if present
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const register = async (name: string, email: string, password: string) => {
    const data = await registerUser({ name, email, password });
    if (data.token && data.user) {
      setAuthToken(data.token);
      localStorage.setItem('sitegen_auth_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
  };

  const login = async (email: string, password: string) => {
    const data = await loginUser({ email, password });
    if (data.token && data.user) {
      setAuthToken(data.token);
      localStorage.setItem('sitegen_auth_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
  };

  const logout = () => {
    removeAuthToken();
    localStorage.removeItem('sitegen_auth_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
