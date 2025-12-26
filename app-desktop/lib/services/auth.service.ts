import { api } from "./api";
import type { LoginRequest, LoginResponse } from "../types/auth.types";

const TOKEN_KEY = "@gym:token";
const USER_KEY = "@gym:user";

type StoredUser = {
  id: string;
  role: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

function getStorage(hasPersistence: boolean): Storage {
  return hasPersistence ? localStorage : sessionStorage;
}

function getActiveStorage(): Storage {
  if (typeof window === "undefined") {
    throw new Error("Storage is not available outside the browser");
  }
  if (sessionStorage.getItem(TOKEN_KEY)) return sessionStorage;
  return localStorage;
}

export const authService = {
  async login(
    credentials: LoginRequest,
    options?: { rememberMe?: boolean }
  ): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      "/authenticate",
      credentials
    );

    const rememberMe = options?.rememberMe ?? true;

    // Store token according to rememberMe
    if (response.token) {
      const storage = getStorage(rememberMe);
      storage.setItem(TOKEN_KEY, response.token);

      // Ensure token isn't persisted in the other storage
      (rememberMe ? sessionStorage : localStorage).removeItem(TOKEN_KEY);
    }

    const tokenUser = this.getUserFromToken();
    if (tokenUser) {
      const storedUser = this.getStoredUser();
      const previousAvatarUrl =
        storedUser?.id === tokenUser.id ? storedUser.avatarUrl : undefined;

      this.setStoredUser({
        id: tokenUser.id,
        role: tokenUser.role,
        name: tokenUser.name,
        email: tokenUser.email,
        avatarUrl: tokenUser.avatarUrl ?? previousAvatarUrl,
      });

      // Ensure user isn't persisted in the other storage
      (rememberMe ? sessionStorage : localStorage).removeItem(USER_KEY);
    }

    return response;
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return (
      sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY)
    );
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

  getStoredUser(): StoredUser | null {
    if (typeof window === "undefined") return null;
    const raw =
      sessionStorage.getItem(USER_KEY) ?? localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredUser;
    } catch {
      return null;
    }
  },

  setStoredUser(user: StoredUser): void {
    if (typeof window === "undefined") return;
    const storage = getActiveStorage();
    storage.setItem(USER_KEY, JSON.stringify(user));
  },
};
