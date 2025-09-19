/**
 * Authentication Context & Provider
 * Modern React Context with useReducer for robust state management
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { 
  AuthState, 
  AuthContextType, 
  AdminUser, 
  LoginCredentials, 
  LoginResponse,
  AuthAction,
  DEMO_ADMIN_CREDENTIALS 
} from '../types/auth';

// Auth reducer for predictable state management
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // Simulate network delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 800));

      // Demo authentication - in production, this would be a secure API call
      if (
        credentials.email === DEMO_ADMIN_CREDENTIALS.email && 
        credentials.password === DEMO_ADMIN_CREDENTIALS.password
      ) {
        const adminUser: AdminUser = {
          id: 'demo-admin-' + Date.now(),
          email: DEMO_ADMIN_CREDENTIALS.email,
          username: DEMO_ADMIN_CREDENTIALS.username,
          role: 'admin',
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        };

        // Store session securely (in production, use httpOnly cookies)
        const sessionData = {
          user: adminUser,
          timestamp: Date.now(),
          expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };

        sessionStorage.setItem('drinkph_admin_session', JSON.stringify(sessionData));
        dispatch({ type: 'SET_USER', payload: adminUser });

        return { 
          success: true, 
          user: adminUser 
        };
      } else {
        const error = 'Invalid email or password. Please check your credentials.';
        dispatch({ type: 'SET_ERROR', payload: error });
        return { 
          success: false, 
          error 
        };
      }
    } catch (error) {
      const errorMessage = 'Login failed. Please try again later.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const logout = useCallback(() => {
    // Clear session storage
    sessionStorage.removeItem('drinkph_admin_session');
    // Clear localStorage as backup
    localStorage.removeItem('drinkph_admin_session');
    
    dispatch({ type: 'LOGOUT' });
    
    // Optional: Redirect to login page
    if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      window.location.href = '/admin/login';
    }
  }, []);

  const checkAuth = useCallback(async (): Promise<void> => {
    try {
      const sessionData = sessionStorage.getItem('drinkph_admin_session');
      
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        
        // Check if session is expired
        if (parsed.expires && Date.now() > parsed.expires) {
          console.log('🔐 Session expired, clearing...');
          sessionStorage.removeItem('drinkph_admin_session');
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }

        // Validate session structure
        if (parsed.user && parsed.user.id && parsed.user.email) {
          console.log('🔐 Valid session found, restoring user...');
          dispatch({ type: 'SET_USER', payload: parsed.user });
        } else {
          console.log('🔐 Invalid session structure, clearing...');
          sessionStorage.removeItem('drinkph_admin_session');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('🔐 Auth check failed:', error);
      sessionStorage.removeItem('drinkph_admin_session');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Auto-logout on session expiry
  useEffect(() => {
    if (state.user) {
      const interval = setInterval(() => {
        const sessionData = sessionStorage.getItem('drinkph_admin_session');
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          if (parsed.expires && Date.now() > parsed.expires) {
            console.log('🔐 Session expired, auto-logging out...');
            logout();
          }
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [state.user, logout]);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    checkAuth,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;