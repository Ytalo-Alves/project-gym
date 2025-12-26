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
  login: (
    credentials: LoginRequest,
    options?: { rememberMe?: boolean }
  ) => Promise<void>;
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
        const tokenUser = authService.getUserFromToken();
        const storedUser = authService.getStoredUser();

        if (tokenUser) {
          const safeStoredUser =
            storedUser?.id === tokenUser.id ? storedUser : null;

          const mergedUser = {
            id: tokenUser.id,
            role: tokenUser.role,
            name: safeStoredUser?.name ?? tokenUser.name,
            email: safeStoredUser?.email ?? tokenUser.email,
            avatarUrl: safeStoredUser?.avatarUrl ?? tokenUser.avatarUrl,
          };
          setUser(mergedUser);
          authService.setStoredUser(mergedUser);
        } else {
          setUser(storedUser);
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (
    credentials: LoginRequest,
    options?: { rememberMe?: boolean }
  ) => {
    await authService.login(credentials, options);
    const tokenUser = authService.getUserFromToken();
    const storedUser = authService.getStoredUser();

    if (tokenUser) {
      const safeStoredUser = storedUser?.id === tokenUser.id ? storedUser : null;

      const mergedUser = {
        id: tokenUser.id,
        role: tokenUser.role,
        name: tokenUser.name,
        email: tokenUser.email,
        avatarUrl: tokenUser.avatarUrl ?? safeStoredUser?.avatarUrl,
      };
      setUser(mergedUser);
      authService.setStoredUser(mergedUser);
    } else {
      setUser(storedUser);
    }
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
      const updatedUser = { ...prevUser, ...updates };
      authService.setStoredUser(updatedUser);
      return updatedUser;
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
