"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth.service";
import type { LoginRequest } from "../types/auth.types";

interface AuthContextData {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: string;
    role: string;
    name: string;
    email: string;
    avatarUrl?: string;
  } | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  updateUser: (
    updates: Partial<{ name: string; email: string; avatarUrl: string }>
  ) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{
    id: string;
    role: string;
    name: string;
    email: string;
    avatarUrl?: string;
  } | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const userData = authService.getUserFromToken();
        setUser(userData);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    await authService.login(credentials);
    const userData = authService.getUserFromToken();
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (
    updates: Partial<{ name: string; email: string; avatarUrl: string }>
  ) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return { ...prevUser, ...updates };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
