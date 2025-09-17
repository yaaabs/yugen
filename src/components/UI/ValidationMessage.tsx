import React from 'react';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface ValidationMessageProps {
  message: string;
  isValid: boolean;
  show?: boolean;
  className?: string;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({
  message,
  isValid,
  show = true,
  className = ''
}) => {
  if (!show || !message.trim()) return null;

  const getIcon = () => {
    if (isValid) {
      return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    } else if (!isValid) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    } else {
      return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  const getMessageStyles = () => {
    if (isValid) {
      return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    } else if (!isValid) {
      return 'text-red-600 bg-red-50 border-red-200';
    } else {
      return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className={`flex items-center space-x-2 mt-2 px-3 py-2 rounded-lg border ${getMessageStyles()} transition-all duration-300 ease-in-out ${className}`}>
      {getIcon()}
      <span className="text-sm font-medium">
        {message}
      </span>
    </div>
  );
};

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  validationMessage?: string;
  isValid?: boolean;
  showValidation?: boolean;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  error,
  validationMessage,
  isValid = true,
  showValidation = false,
  className = '',
  ...props
}) => {
  const getInputStyles = () => {
    if (error) {
      return 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50/30';
    } else if (isValid && showValidation && validationMessage) {
      return 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20 bg-emerald-50/30';
    } else {
      return 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white hover:border-slate-400';
    }
  };

  const inputClassName = `
    block w-full px-4 py-3 rounded-xl border-2 shadow-sm 
    placeholder-slate-400 
    focus:outline-none focus:ring-4 
    transition-all duration-200 ease-in-out
    text-slate-900 font-medium
    ${getInputStyles()}
    ${className}
  `;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          className={inputClassName}
          {...props}
        />
        {/* Success indicator */}
        {isValid && showValidation && validationMessage && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
        )}
      </div>
      
      {/* Show error first, then validation message */}
      {error ? (
        <ValidationMessage 
          message={error} 
          isValid={false} 
          show={true}
        />
      ) : showValidation && validationMessage ? (
        <ValidationMessage 
          message={validationMessage} 
          isValid={isValid} 
          show={true}
        />
      ) : null}
    </div>
  );
};

interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  validationMessage?: string;
  isValid?: boolean;
  showValidation?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
}

export const ValidatedTextarea: React.FC<ValidatedTextareaProps> = ({
  label,
  error,
  validationMessage,
  isValid = true,
  showValidation = false,
  showCharCount = false,
  maxLength,
  className = '',
  value = '',
  ...props
}) => {
  const getTextareaStyles = () => {
    if (error) {
      return 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50/30';
    } else if (isValid && showValidation && validationMessage) {
      return 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20 bg-emerald-50/30';
    } else {
      return 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white hover:border-slate-400';
    }
  };

  const textareaClassName = `
    block w-full px-4 py-3 rounded-xl border-2 shadow-sm 
    placeholder-slate-400 
    focus:outline-none focus:ring-4 
    transition-all duration-200 ease-in-out
    text-slate-900 font-medium
    resize-none
    ${getTextareaStyles()}
    ${className}
  `;

  const charCount = typeof value === 'string' ? value.length : 0;
  const isNearLimit = maxLength && charCount > (maxLength * 0.8);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
        {showCharCount && (
          <span className={`text-sm font-medium ${
            isNearLimit ? 'text-amber-600' : 'text-slate-500'
          }`}>
            {charCount}{maxLength ? `/${maxLength}` : ''}
          </span>
        )}
      </div>
      
      <div className="relative">
        <textarea
          className={textareaClassName}
          value={value}
          {...props}
        />
        {/* Success indicator */}
        {isValid && showValidation && validationMessage && (
          <div className="absolute top-3 right-3">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
        )}
      </div>
      
      {/* Show error first, then validation message */}
      {error ? (
        <ValidationMessage 
          message={error} 
          isValid={false} 
          show={true}
        />
      ) : showValidation && validationMessage ? (
        <ValidationMessage 
          message={validationMessage} 
          isValid={isValid} 
          show={true}
        />
      ) : !error && !showValidation && (
        <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-slate-600 text-sm font-medium">
            💡 Minimum 50 characters required for a detailed description
          </p>
        </div>
      )}
    </div>
  );
};

export default ValidationMessage;