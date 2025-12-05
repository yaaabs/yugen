/**
 * Admin Login Component
 * Modern, secure login form with validation and beautiful UI
 */

import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, Shield, AlertCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { DEMO_ADMIN_CREDENTIALS } from "../../types/auth";
import usePageTitle from "../../hooks/usePageTitle";

const AdminLogin: React.FC = () => {
  // Set page title
  usePageTitle("Admin Login", "Access DrinkPH Admin Dashboard");

  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear error when component mounts or form changes
  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (formData.email || formData.password) {
      clearError();
    }
  }, [formData.email, formData.password, clearError]);

  // Redirect if already authenticated (AFTER all hooks are called)
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (result.success) {
        // Navigation will be handled by the Navigate component above
        console.log("🔐 Login successful, redirecting to admin dashboard...");
      }
    } catch (error) {
      console.error("🔐 Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: DEMO_ADMIN_CREDENTIALS.email,
      password: DEMO_ADMIN_CREDENTIALS.password,
    });
  };

  const isFormValid = formData.email.trim() && formData.password.length >= 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Access the DrinkPH Admin Dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="admin@drinkph-demo.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Demo Credentials Helper - Modern UI */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 sm:p-4">
              <div className="flex items-center mb-1.5">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-2.5">
                  <h3 className="text-sm sm:text-lg font-semibold text-blue-900 leading-tight">
                    Quick Demo Access
                  </h3>
                  <p className="text-[9px] sm:text-[11px] text-blue-700 leading-tight">
                    Click below to instantly fill the admin login form
                  </p>
                </div>
              </div>
              <div className="grid gap-2 w-full mt-2">
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="w-full flex items-center justify-between p-1 sm:p-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] sm:text-xs font-semibold text-gray-900 group-hover:text-blue-900">
                      Admin Account
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-blue-700 group-hover:text-blue-800">
                      {DEMO_ADMIN_CREDENTIALS.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-[9px] sm:text-xs text-blue-400 font-semibold group-hover:text-blue-600">
                      Use Account
                    </span>
                    <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:bg-blue-600 transition-colors"></div>
                  </div>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting || isLoading}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting || isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Back to Landing */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              ← Back to DrinkPH Landing
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            DrinkPH Admin Portal • Secure Access Required
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
