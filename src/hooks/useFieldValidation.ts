import { useState, useCallback } from 'react';
import { validateEmail, validatePhoneNumber } from '../utils/helpers';

interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const useFieldValidation = () => {
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({});

  const validateField = useCallback((fieldName: string, value: string): ValidationResult => {
    let result: ValidationResult = { isValid: true, message: '' };

    switch (fieldName) {
      case 'contactEmail':
        if (!value.trim()) {
          result = { isValid: false, message: 'Email is required' };
        } else if (!validateEmail(value)) {
          result = { isValid: false, message: 'Please enter a valid email (e.g., user@gmail.com)' };
        } else {
          result = { isValid: true, message: 'Valid email address' };
        }
        break;

      case 'contactPhone':
        if (!value.trim()) {
          result = { isValid: false, message: 'Phone number is required' };
        } else if (!validatePhoneNumber(value)) {
          result = { isValid: false, message: 'Please enter a valid PH mobile number (e.g., +63 976 125 1205)' };
        } else {
          result = { isValid: true, message: 'Valid Philippine mobile number' };
        }
        break;

      case 'companyName':
        // No real-time validation for company name - just basic required check during form submission
        result = { isValid: true, message: '' };
        break;

      case 'description':
        if (!value.trim()) {
          result = { isValid: false, message: 'Project description is required' };
        } else if (value.trim().length < 50) {
          result = { isValid: false, message: `Please provide at least 50 characters (${value.trim().length}/50)` };
        } else {
          result = { isValid: true, message: `Good description (${value.trim().length} characters)` };
        }
        break;

      default:
        result = { isValid: true, message: '' };
    }

    setValidationResults(prev => ({
      ...prev,
      [fieldName]: result
    }));

    return result;
  }, []);

  const getFieldValidation = useCallback((fieldName: string): ValidationResult => {
    return validationResults[fieldName] || { isValid: true, message: '' };
  }, [validationResults]);

  const clearFieldValidation = useCallback((fieldName: string) => {
    setValidationResults(prev => {
      const newResults = { ...prev };
      delete newResults[fieldName];
      return newResults;
    });
  }, []);

  return {
    validateField,
    getFieldValidation,
    clearFieldValidation
  };
};

export default useFieldValidation;