import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-gray-500'
  };

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      aria-label="Loading..."
    />
  );
};

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText,
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:bg-primary-300',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 disabled:border-primary-300 disabled:text-primary-300'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        isDisabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
      }`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && (
        <LoadingSpinner 
          size={size === 'lg' ? 'md' : 'sm'} 
          color={variant === 'outline' ? 'primary' : 'white'}
          className="mr-2"
        />
      )}
      <span className={isLoading ? 'opacity-75' : ''}>
        {isLoading && loadingText ? loadingText : children}
      </span>
    </button>
  );
};

export default LoadingSpinner;