import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CTAButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

const CTAButton: React.FC<CTAButtonProps> = ({
  variant,
  onClick,
  children,
  className = ''
}) => {
  const baseClasses = "inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 transform hover:scale-105 active:scale-95";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-[#1A66FF] to-[#77C624] text-white shadow-lg hover:shadow-xl focus:ring-[#1A66FF]/50",
    secondary: "bg-white/90 backdrop-blur-sm text-gray-700 border-2 border-gray-200 hover:border-[#1A66FF] hover:text-[#1A66FF] shadow-lg hover:shadow-xl focus:ring-gray-300"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      type="button"
    >
      {children}
    </button>
  );
};

export default CTAButton;