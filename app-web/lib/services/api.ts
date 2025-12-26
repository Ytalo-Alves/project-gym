const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("@gym:token");
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken();

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Só adiciona Content-Type se houver body e não for FormData
    if (options.body && !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (!response.ok) {
        // Tentar ler o corpo da resposta como JSON para erros
        let errorMessage = `Erro ${response.status}: ${response.statusText}`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const text = await response.text();
            if (text) {
              const error: ApiError = JSON.parse(text);
              // Include status code in message for frontend error handling
              errorMessage = `[${response.status}] ${
                error.message || errorMessage
              }`;
            }
          }
        } catch (parseError) {
          // Se não conseguir ler como JSON, usar o status text com código
          console.error("Erro ao parsear resposta de erro:", parseError);
          errorMessage = `[${response.status}] ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Se a resposta for 204 (No Content), não tentar fazer parse do JSON
      if (response.status === 204) {
        return undefined as unknown as T;
      }

      // Verificar se há conteúdo para fazer parse
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const text = await response.text();
        return text ? JSON.parse(text) : (undefined as unknown as T);
      }

      return undefined as unknown as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro desconhecido na requisição");
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string): Promise<void> {
    await this.request<void>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient(API_URL);
