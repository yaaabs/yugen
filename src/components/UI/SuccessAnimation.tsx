import React, { useEffect, useState } from "react";
import { CheckCircle, Sparkles, X } from "lucide-react";

interface SuccessAnimationProps {
  show: boolean;
  title?: string;
  message?: string;
  onComplete?: () => void;
  onClose?: () => void;
  duration?: number;
  showCloseButton?: boolean;
  autoCloseDelay?: number;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  show,
  title = "Success!",
  message = "Your submission has been completed successfully.",
  onComplete,
  onClose,
  duration = 3000,
  showCloseButton = false,
  autoCloseDelay,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 50);

      // Use autoCloseDelay if provided, otherwise use duration
      const closeDelay = autoCloseDelay || duration;

      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, 300);
      }, closeDelay);

      return () => clearTimeout(timer);
    }
  }, [show, duration, autoCloseDelay, onComplete]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center transform transition-all duration-500 relative ${
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Success Icon with Animation */}
        <div className="relative mb-6">
          <div
            className={`mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center transform transition-all duration-700 ${
              isAnimating ? "scale-100 rotate-0" : "scale-0 rotate-180"
            }`}
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          {/* Sparkle Effects */}
          <div
            className={`absolute inset-0 transition-opacity duration-1000 delay-300 ${
              isAnimating ? "opacity-100" : "opacity-0"
            }`}
          >
            <Sparkles className="absolute top-2 left-2 w-4 h-4 text-yellow-400 animate-pulse" />
            <Sparkles className="absolute top-4 right-4 w-3 h-3 text-blue-400 animate-pulse animation-delay-200" />
            <Sparkles className="absolute bottom-6 left-6 w-3 h-3 text-purple-400 animate-pulse animation-delay-400" />
            <Sparkles className="absolute bottom-2 right-2 w-4 h-4 text-pink-400 animate-pulse animation-delay-600" />
          </div>
        </div>

        {/* Success Text */}
        <div
          className={`transform transition-all duration-500 delay-200 ${
            isAnimating
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Animated Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className={`bg-gradient-to-r from-green-400 to-blue-500 h-1 rounded-full transition-all ease-linear ${
                isAnimating ? "w-full" : "w-0"
              }`}
              style={{ transitionDuration: `${duration}ms` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface FloatingSuccessProps {
  show: boolean;
  message?: string;
  position?: "top" | "bottom";
}

export const FloatingSuccess: React.FC<FloatingSuccessProps> = ({
  show,
  message = "Saved successfully!",
  position = "top",
}) => {
  return (
    <div
      className={`fixed ${position === "top" ? "top-4" : "bottom-4"} right-4 z-40 transform transition-all duration-300 ${
        show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

export default SuccessAnimation;
