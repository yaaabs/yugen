/**
 * Client Protected Route
 * Only allows access if client is authenticated
 */
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useClientAuth } from "../../contexts/ClientAuthContext";
import { Shield, Loader2 } from "lucide-react";

interface ClientProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

const ClientProtectedRoute: React.FC<ClientProtectedRouteProps> = ({
  children,
  fallbackPath = "/client/login",
}) => {
  const { isAuthenticated, isLoading, user } = useClientAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Verifying access...</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Please wait while we check your credentials
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    const redirectTo =
      location.pathname !== "/client/login" ? location.pathname : "/client";
    return <Navigate to={fallbackPath} state={{ from: redirectTo }} replace />;
  }

  return <>{children}</>;
};

export default ClientProtectedRoute;
