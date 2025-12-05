/**
 * Authentication Types & Interfaces
 * Modern TypeScript definitions for robust auth system
 */

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  role: "admin" | "super_admin";
  created_at: string;
  last_login: string | null;
}

export interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  error?: string;
  user?: AdminUser;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

// Demo credentials for portfolio/development
export const DEMO_ADMIN_CREDENTIALS = {
  email: "admin@drinkph-demo.com",
  username: "drinkph_admin",
  password: "DrinkPH2025!",
  displayName: "DrinkPH Admin",
} as const;

export type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: AdminUser | null }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_ERROR" }
  | { type: "LOGOUT" };
