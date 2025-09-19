/**
 * Client Authentication Types & Interfaces
 * For dph_clients table
 */

export interface ClientUser {
  id: string;
  email: string;
  username: string;
  full_name: string;
  password_hash: string;
  created_at: string;
  last_login: string | null;
}

export interface ClientAuthState {
  user: ClientUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ClientLoginCredentials {
  email: string;
  password: string;
}

export interface ClientLoginResponse {
  success: boolean;
  error?: string;
  user?: ClientUser;
}

export interface ClientAuthContextType extends ClientAuthState {
  login: (credentials: ClientLoginCredentials) => Promise<ClientLoginResponse>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

// Demo credentials for portfolio/development
export const DEMO_CLIENT_CREDENTIALS = [
  {
    email: 'client1@drinkph-demo.com',
    username: 'client_demo1',
    password: 'ClientDemo2025!',
    full_name: 'Demo Client One'
  },
  {
    email: 'client2@drinkph-demo.com',
    username: 'client_demo2',
    password: 'ClientDemo2025!',
    full_name: 'Demo Client Two'
  }
] as const;

export type ClientAuthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: ClientUser | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };