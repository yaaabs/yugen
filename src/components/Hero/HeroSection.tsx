import React, { useState } from "react";
import {
  ArrowRight,
  Play,
  CheckCircle,
  Sparkles,
  Globe,
  Users,
  X,
} from "lucide-react";
import FeatureCard from "./FeatureCard";
import CTAButton from "./CTAButton";

interface HeroSectionProps {
  onNavigateToPortal: () => void;
  onViewDocumentation: () => void;
  onNavigateToAdmin: () => void;
  onNavigateToTracker: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigateToPortal,
  onViewDocumentation,
  onNavigateToAdmin,
  onNavigateToTracker,
}) => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const features = [
    {
      icon: Globe,
      title: "Multi-Step Forms",
      description:
        "Professional submission workflows with real-time validation",
    },
    {
      icon: Users,
      title: "Project Tracking",
      description: "Real-time status updates and progress monitoring",
    },
    {
      icon: Sparkles,
      title: "Admin Dashboard",
      description: "Comprehensive project management interface",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#1A66FF] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-[#77C624] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      {/* Disclaimer Banner */}
      {showDisclaimer && (
        <div className="relative z-10 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center space-x-2 text-amber-800">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium text-center">
                    Portfolio Demo Project • Not Officially Affiliated with
                    Drink PH • Created for Web Developer Application
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="ml-4 p-1 rounded-full text-amber-600 hover:text-amber-800 hover:bg-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Close disclaimer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 pb-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-200px)] sm:min-h-[calc(100vh-120px)]">
          {/* Left Column - Content */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-[#1A66FF]/20 rounded-full px-4 py-2 text-sm font-medium text-[#1A66FF] shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>Professional Portfolio Demonstration</span>
            </div>

            {/* Headlines */}
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Sustainability{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A66FF] to-[#77C624]">
                  Stories
                </span>{" "}
                That Stand Out
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
                A modern client communication portal demonstration showcasing
                professional web development capabilities. Built with React,
                TypeScript, and modern design principles.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-2 sm:space-y-3">
              {[
                "Enhanced form validation with real-time feedback",
                "Mobile-first responsive design implementation",
                "Professional admin dashboard interface",
                "Modern UI/UX with accessibility compliance",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 text-gray-700"
                >
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#77C624] flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-lg leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <CTAButton
                variant="primary"
                onClick={onNavigateToPortal}
                icon={ArrowRight}
                className="group w-full sm:w-auto"
              >
                <span>View Client Portal</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </CTAButton>

              <CTAButton
                variant="secondary"
                onClick={onViewDocumentation}
                icon={Play}
                className="w-full sm:w-auto"
              >
                <Play className="w-5 h-5 mr-2" />
                <span>View Documentation</span>
              </CTAButton>
            </div>

            {/* Tech Stack Badges */}
            <div className="pt-6 sm:pt-8 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                Built with modern technologies:
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  "React 18",
                  "TypeScript",
                  "Tailwind CSS",
                  "Vite",
                  "React Router",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-2 sm:px-3 py-1 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full text-xs sm:text-sm font-medium text-gray-700 shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="relative order-1 lg:order-2">
            <div className="grid gap-4 sm:gap-6 space-y-2 sm:space-y-4">
              {features.map((feature, index) => {
                let onClick;
                if (feature.title === "Multi-Step Forms") {
                  onClick = onNavigateToPortal;
                } else if (feature.title === "Project Tracking") {
                  onClick = onNavigateToTracker;
                } else if (feature.title === "Admin Dashboard") {
                  onClick = onNavigateToAdmin;
                }

                return (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    delay={index * 200}
                    onClick={onClick}
                  />
                );
              })}

              {/* Mobile Responsive Achievement Card - Now with animation */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 mt-4 animate-float hover-lift transition-all mobile-animate-standout">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#1A66FF] to-[#77C624] rounded-xl flex items-center justify-center flex-shrink-0 animate-gradient">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                      100%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                      <span>Mobile Responsive</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default HeroSection;
