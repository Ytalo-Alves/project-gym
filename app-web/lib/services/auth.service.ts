import { api } from "./api";
import type { LoginRequest, LoginResponse } from "../types/auth.types";

const TOKEN_KEY = "@gym:token";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      "/authenticate",
      credentials
    );

    // Store token in localStorage
    if (response.token) {
      localStorage.setItem(TOKEN_KEY, response.token);
    }

    return response;
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Decode JWT to get user info (simple base64 decode)
  getUserFromToken(): {
    id: string;
    role: string;
    name: string;
    email: string;
    avatarUrl?: string;
  } | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return {
        id: decoded.sub,
        role: decoded.role,
        name: decoded.name || "Usuário",
        email: decoded.email || "",
        avatarUrl: decoded.avatarUrl,
      };
    } catch {
      return null;
    }
  },
};
