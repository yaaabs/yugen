import React, { useState } from "react";
import { Menu, X, ExternalLink, Github, Home } from "lucide-react";

interface HeaderProps {
  onNavigateToPortal: () => void;
  onNavigateToTracker: () => void;
  onViewGitHub: () => void;
  currentPath?: string;
}

const Header: React.FC<HeaderProps> = ({
  onNavigateToPortal,
  onNavigateToTracker,
  onViewGitHub,
  currentPath = "/",
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
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
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Drink PH - Not Official
              </h1>
              <p className="text-xs text-[#1A66FF] hidden sm:block">
                Client Communication Portal
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a
              href="/"
              className={`flex items-center space-x-2 transition-colors font-medium relative ${
                currentPath === "/"
                  ? "text-[#1A66FF] after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-0.5 after:bg-[#1A66FF] after:rounded-full"
                  : "text-gray-700 hover:text-[#1A66FF]"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </a>
            <button
              onClick={onNavigateToPortal}
              className="text-gray-700 hover:text-[#1A66FF] transition-colors font-medium"
            >
              Client Portal
            </button>
            <button
              onClick={onNavigateToTracker}
              className="text-gray-700 hover:text-[#1A66FF] transition-colors font-medium"
            >
              Track Project
            </button>
            <button
              onClick={onViewGitHub}
              className="inline-flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              <Github className="w-4 h-4" />
              <span>View Code</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#1A66FF] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1A66FF] transition-colors"
              aria-expanded="false"
              aria-label="Toggle navigation menu"
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
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-80 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            <a
              href="/"
              onClick={closeMobileMenu}
              className={`flex items-center space-x-2 w-full px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                currentPath === "/"
                  ? "text-[#1A66FF] bg-blue-50 font-semibold"
                  : "text-gray-700 hover:text-[#1A66FF] hover:bg-gray-50"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </a>
            <button
              onClick={() => {
                onNavigateToPortal();
                closeMobileMenu();
              }}
              className="flex items-center w-full px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:text-[#1A66FF] hover:bg-gray-50 transition-colors duration-200"
            >
              Client Portal
            </button>
            <button
              onClick={() => {
                onNavigateToTracker();
                closeMobileMenu();
              }}
              className="flex items-center w-full px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:text-[#1A66FF] hover:bg-gray-50 transition-colors duration-200"
            >
              Track Project
            </button>
            <button
              onClick={() => {
                onViewGitHub();
                closeMobileMenu();
              }}
              className="flex items-center space-x-2 w-full px-4 py-3 rounded-md text-base font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <Github className="w-4 h-4" />
              <span>View Code</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
