/**
 * Client Authentication Context & Provider
 * Similar to Admin, but for dph_clients
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  ClientAuthState,
  ClientAuthContextType,
  ClientUser,
  ClientLoginCredentials,
  ClientLoginResponse,
  ClientAuthAction,
} from "../types/clientAuth";
import { supabase } from "../lib/supabase";

const clientAuthReducer = (
  state: ClientAuthState,
  action: ClientAuthAction,
): ClientAuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

const initialState: ClientAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(
  undefined,
);

interface ClientAuthProviderProps {
  children: ReactNode;
}

export const ClientAuthProvider: React.FC<ClientAuthProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(clientAuthReducer, initialState);

  // Supabase-backed login logic
  const login = async (
    credentials: ClientLoginCredentials,
  ): Promise<ClientLoginResponse> => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "CLEAR_ERROR" });
    try {
      // Query dph_clients for matching email
      const { data, error } = await supabase
        .from("dph_clients")
        .select("*")
        .eq("email", credentials.email)
        .eq("is_active", true)
        .single();
      if (error || !data) {
        dispatch({
          type: "SET_ERROR",
          payload: "Invalid email or password. Please check your credentials.",
        });
        return {
          success: false,
          error: "Invalid email or password. Please check your credentials.",
        };
      }
      // Check password (plain text for demo, hash for production)
      if (data.password_hash !== credentials.password) {
        dispatch({
          type: "SET_ERROR",
          payload: "Invalid email or password. Please check your credentials.",
        });
        return {
          success: false,
          error: "Invalid email or password. Please check your credentials.",
        };
      }
      // Build ClientUser object
      const clientUser: ClientUser = {
        id: data.user_id,
        email: data.email,
        username: data.username || "",
        full_name: data.full_name || "",
        password_hash: data.password_hash || "",
        created_at: data.created_at,
        last_login: data.last_login || null,
      };
      // Store session
      const sessionData = {
        user: clientUser,
        timestamp: Date.now(),
        expires: Date.now() + 24 * 60 * 60 * 1000,
      };
      sessionStorage.setItem(
        "drinkph_client_session",
        JSON.stringify(sessionData),
      );
      dispatch({ type: "SET_USER", payload: clientUser });
      return { success: true, user: clientUser };
    } catch (error) {
      const errorMessage = "Login failed. Please try again later.";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = useCallback(() => {
    sessionStorage.removeItem("drinkph_client_session");
    localStorage.removeItem("drinkph_client_session");
    dispatch({ type: "LOGOUT" });
    if (
      window.location.pathname.startsWith("/client") &&
      window.location.pathname !== "/client/login"
    ) {
      window.location.href = "/client/login";
    }
  }, []);

  const checkAuth = useCallback(async (): Promise<void> => {
    try {
      const sessionData = sessionStorage.getItem("drinkph_client_session");
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (parsed.expires && Date.now() > parsed.expires) {
          sessionStorage.removeItem("drinkph_client_session");
          dispatch({ type: "SET_LOADING", payload: false });
          return;
        }
        if (parsed.user && parsed.user.id && parsed.user.email) {
          dispatch({ type: "SET_USER", payload: parsed.user });
        } else {
          sessionStorage.removeItem("drinkph_client_session");
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } catch (error) {
      sessionStorage.removeItem("drinkph_client_session");
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (state.user) {
      const interval = setInterval(() => {
        const sessionData = sessionStorage.getItem("drinkph_client_session");
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          if (parsed.expires && Date.now() > parsed.expires) {
            logout();
          }
        }
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [state.user, logout]);

  const value: ClientAuthContextType = {
    ...state,
    login,
    logout,
    checkAuth,
    clearError,
  };

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
};

export const useClientAuth = (): ClientAuthContextType => {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error("useClientAuth must be used within a ClientAuthProvider");
  }
  return context;
};

export default ClientAuthProvider;
