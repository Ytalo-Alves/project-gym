export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface User {
  id: string;
  email: string;
  role: string;
}
