import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Building2, Shield, Menu, X, Home } from 'lucide-react';

// Components
import HomePage from './pages/HomePage';
import ClientPortal from './components/ClientPortal/ClientPortal';
import AdminPanel from './components/AdminPanel/AdminPanel';
import { StatusTracker } from './components/StatusTracker/StatusTracker';
import AdminLogin from './components/AdminLogin/AdminLogin';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import BackToTop from './components/UI/BackToTop';

// Authentication Context
import { AuthProvider } from './contexts/AuthContext';
import { ClientAuthProvider, useClientAuth } from './contexts/ClientAuthContext';
import ClientLogin from './components/ClientLogin/ClientLogin';
import ClientProtectedRoute from './components/Auth/ClientProtectedRoute';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAdminLogin = location.pathname === '/admin/login';
  const isClientLogin = location.pathname === '/client/login';

  if (isHomePage) {
    return <HomePage />;
  }

  if (isAdminLogin) {
    return <AdminLogin />;
  }

  if (isClientLogin) {
    return <ClientLogin />;
  }

  return <PortalLayout />;
};

const PortalLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when window is resized to desktop
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Client auth for logout and conditional nav
  // Use hook directly (imported at top)
  const { isAuthenticated, logout } = useClientAuth();
  const handleClientNav = (path: string) => {
    if (!isAuthenticated) {
      window.location.href = '/client/login';
    } else {
      window.location.href = path;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <a 
              href="/" 
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center justify-center w-10 h-10">
                <img 
                  src="/drink logo.png" 
                  alt="Drink PH Logo" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                Drink PH - Not Official
                </h1>
                <p className="text-xs sm:text-sm text-primary-600 hidden sm:block">Client Communication Portal</p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <a 
                href="/" 
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </a>
              <button
                onClick={() => handleClientNav('/client')}
                className={`flex items-center space-x-2 transition-colors relative ${
                  location.pathname === '/client'
                    ? 'text-[#1A66FF] font-medium after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-0.5 after:bg-[#1A66FF] after:rounded-full'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Client Portal</span>
              </button>
              <button
                onClick={() => handleClientNav('/track')}
                className={`flex items-center space-x-2 transition-colors relative ${
                  location.pathname === '/track'
                    ? 'text-[#1A66FF] font-medium after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-0.5 after:bg-[#1A66FF] after:rounded-full'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Track Project</span>
              </button>
              {isAuthenticated && (
                <button
                  onClick={logout}
                  className="ml-4 px-4 py-2 flex items-center gap-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label="Logout"
                  title="Logout"
                >
                  {/* Lucide LogOut icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
            </nav>

                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                  <button
                    onClick={toggleMobileMenu}
                    className="inline-flex items-center justify-center p-3 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors min-h-[44px] min-w-[44px]"
                    aria-expanded={isMobileMenuOpen ? "true" : "false"}
                    aria-label="Toggle navigation menu"
                    type="button"
                  >
                    {isMobileMenuOpen ? (
                      <X className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Menu className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {/* Mobile Navigation Menu */}
              <div className={`lg:hidden transition-all duration-300 ease-in-out ${
                isMobileMenuOpen 
                  ? 'max-h-56 opacity-100' 
                  : 'max-h-0 opacity-0 overflow-hidden'
              }`}>
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
                <a
                  href="/"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors duration-200 min-h-[44px] active:bg-gray-100"
                  role="button"
                  tabIndex={0}
                >
                  <Home className="w-5 h-5 flex-shrink-0" />
                  <span>Home</span>
                </a>
                <button
                  onClick={() => { closeMobileMenu(); handleClientNav('/client'); }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 min-h-[44px] ${
                    location.pathname === '/client'
                      ? 'text-[#1A66FF] bg-blue-50 font-semibold'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50 active:bg-gray-100'
                  }`}
                  role="button"
                  tabIndex={0}
                >
                  <Building2 className="w-5 h-5 flex-shrink-0" />
                  <span>Client Portal</span>
                </button>
                <button
                  onClick={() => { closeMobileMenu(); handleClientNav('/track'); }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 min-h-[44px] ${
                    location.pathname === '/track'
                      ? 'text-[#1A66FF] bg-blue-50 font-semibold'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50 active:bg-gray-100'
                  }`}
                  role="button"
                  tabIndex={0}
                >
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  <span>Track Project</span>
                </button>
                {isAuthenticated && (
                  <button
                    onClick={() => { closeMobileMenu(); logout(); }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium text-red-600 hover:text-white hover:bg-red-500 active:bg-red-600 transition-colors duration-200 min-h-[44px] w-full"
                    aria-label="Logout"
                    title="Logout"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/client/login" element={<ClientLogin />} />
              <Route 
                path="/client" 
                element={
                  <ClientProtectedRoute>
                    <ClientPortal />
                  </ClientProtectedRoute>
                }
              />
              <Route 
                path="/track" 
                element={
                  <ClientProtectedRoute>
                    <StatusTracker />
                  </ClientProtectedRoute>
                }
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/client" replace />} />
            </Routes>
          </main>
        </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ClientAuthProvider>
            <AppContent />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#10b981',
                  color: '#ffffff',
                },
                success: {
                  style: {
                    background: '#10b981',
                  },
                },
                error: {
                  style: {
                    background: '#ef4444',
                  },
                },
              }}
            />
            <BackToTop />
          </ClientAuthProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;