import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Send, FileText, Clock, DollarSign, Building2 } from 'lucide-react';
import { FormData, FormErrors, ProjectSubmission, FileAttachment } from '../../types';
import { validateForm, generateId, saveToLocalStorage, getFromLocalStorage, getBudgetRanges, Currency } from '../../utils/helpers';
import { projectTypes } from '../../data/mockData';
import FileUpload from '../FileUpload/FileUpload';
import usePageTitle from '../../hooks/usePageTitle';
import useFieldValidation from '../../hooks/useFieldValidation';
import { LoadingButton } from '../UI/LoadingSpinner';
import { SuccessAnimation, FloatingSuccess } from '../UI/SuccessAnimation';
import { ValidatedInput, ValidatedTextarea } from '../UI/ValidationMessage';

const ClientPortal: React.FC = () => {
  // Set dynamic page title
  usePageTitle('Submit Project', 'Start Your Sustainability Journey');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [currency, setCurrency] = useState<Currency>('PHP'); // Default to PHP
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    contactEmail: '',
    contactPhone: '',
    projectType: '',
    description: '',
    timeline: '',
    budgetRange: '',
    files: []
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showAutoSaveSuccess, setShowAutoSaveSuccess] = useState(false);
  
  // Real-time validation
  const { validateField, getFieldValidation } = useFieldValidation();

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = getFromLocalStorage<FormData>('clientPortalForm');
    if (savedData) {
      setFormData(savedData);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage('clientPortalForm', formData);
      // Show auto-save success feedback
      setShowAutoSaveSuccess(true);
      setTimeout(() => setShowAutoSaveSuccess(false), 2000);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (field in errors && errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Real-time validation for specific fields
    if (['contactEmail', 'contactPhone', 'companyName', 'description'].includes(field)) {
      validateField(field, value);
    }
  };

  const handleFilesChange = (files: FileAttachment[]) => {
    setFormData(prev => ({ ...prev, files }));
  };

  const validateCurrentStep = (): boolean => {
    const stepErrors: FormErrors = {};
    
    switch (currentStep) {
      case 1:
        if (!formData.companyName.trim()) stepErrors.companyName = 'Company name is required';
        if (!formData.contactEmail.trim()) {
          stepErrors.contactEmail = 'Contact email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
          stepErrors.contactEmail = 'Please enter a valid email address';
        }
        break;
      case 2:
        if (!formData.projectType) stepErrors.projectType = 'Please select a project type';
        if (!formData.description.trim()) {
          stepErrors.description = 'Project description is required';
        } else if (formData.description.trim().length < 50) {
          stepErrors.description = 'Please provide at least 50 characters for the project description';
        }
        break;
      case 3:
        if (!formData.timeline.trim()) stepErrors.timeline = 'Timeline is required';
        if (!formData.budgetRange) stepErrors.budgetRange = 'Please select a budget range';
        break;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Go back to first step with errors
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const submission: ProjectSubmission = {
        id: generateId(),
        companyName: formData.companyName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        projectType: formData.projectType as any,
        description: formData.description,
        timeline: formData.timeline,
        budgetRange: formData.budgetRange as any,
        files: formData.files,
        status: 'Submitted',
        submittedAt: new Date(),
        lastUpdated: new Date()
      };

      // Save to localStorage (simulating database)
      const existingSubmissions = getFromLocalStorage<ProjectSubmission[]>('projectSubmissions') || [];
      saveToLocalStorage('projectSubmissions', [...existingSubmissions, submission]);

      // Clear form data
      localStorage.removeItem('clientPortalForm');
      
      // Show success animation
      setShowSuccessAnimation(true);
      
      console.log('📧 Email notification sent to:', formData.contactEmail);
      console.log('📧 Internal notification: New project submission from', formData.companyName);

      // Reset form after animation
      setTimeout(() => {
        setFormData({
          companyName: '',
          contactEmail: '',
          contactPhone: '',
          projectType: '',
          description: '',
          timeline: '',
          budgetRange: '',
          files: []
        });
        setCurrentStep(1);
        setShowSuccessAnimation(false);
      }, 3500);

    } catch (error) {
      toast.error('There was an error submitting your project. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building2 className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Company Information</h2>
              <p className="text-gray-600 mt-2">Tell us about your organization</p>
            </div>

            <ValidatedInput
              label="Company Name *"
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Enter your company name"
              error={errors.companyName}
              showValidation={false}
            />

            <ValidatedInput
              label="Contact Email *"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              placeholder="your.email@company.com"
              error={errors.contactEmail}
              validationMessage={getFieldValidation('contactEmail').message}
              isValid={getFieldValidation('contactEmail').isValid}
              showValidation={formData.contactEmail.length > 0}
            />

            <ValidatedInput
              label="Contact Phone"
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              placeholder="+63 9XX XXX XXXX"
              validationMessage={getFieldValidation('contactPhone').message}
              isValid={getFieldValidation('contactPhone').isValid}
              showValidation={formData.contactPhone.length > 0}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <FileText className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Project Details</h2>
              <p className="text-gray-600 mt-2">Describe your sustainability project</p>
            </div>

            <div>
              <label className="form-label">
                Project Type *
              </label>
              <select
                value={formData.projectType}
                onChange={(e) => handleInputChange('projectType', e.target.value)}
                className={`input-field ${errors.projectType ? 'input-error' : ''}`}
              >
                <option value="">Select a project type</option>
                {projectTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.projectType && (
                <p className="text-red-600 text-sm mt-1">{errors.projectType}</p>
              )}
            </div>

            <ValidatedTextarea
              label="Project Description *"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={6}
              placeholder="Describe your project goals, requirements, and any specific sustainability metrics you want to track..."
              error={errors.description}
              validationMessage={getFieldValidation('description').message}
              isValid={getFieldValidation('description').isValid}
              showValidation={formData.description.length > 0}
              showCharCount={true}
              maxLength={500}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="flex justify-center space-x-4 mb-4">
                <Clock className="w-12 h-12 text-primary-600" />
                <DollarSign className="w-12 h-12 text-primary-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Timeline & Budget</h2>
              <p className="text-gray-600 mt-2">Help us plan your project scope</p>
            </div>

            <div>
              <label className="form-label">
                Desired Timeline *
              </label>
              <input
                type="text"
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                className={`input-field ${errors.timeline ? 'input-error' : ''}`}
                placeholder="e.g., 3-4 months, ASAP, by Q2 2024"
              />
              {errors.timeline && (
                <p className="text-red-600 text-sm mt-1">{errors.timeline}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => {
                  const newCurrency = e.target.value as Currency;
                  setCurrency(newCurrency);
                  // Reset budget range when currency changes
                  handleInputChange('budgetRange', '');
                }}
                className="input-field"
              >
                <option value="PHP">Philippine Peso (₱)</option>
                <option value="USD">US Dollar ($)</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {currency === 'PHP' ? 'Budget-friendly rates for MSMEs, NGOs, and small businesses' : 'Approximate USD equivalent (1 USD ≈ ₱56)'}
              </p>
            </div>

            <div>
              <label className="form-label">
                Budget Range *
              </label>
              <select
                value={formData.budgetRange}
                onChange={(e) => handleInputChange('budgetRange', e.target.value)}
                className={`input-field ${errors.budgetRange ? 'input-error' : ''}`}
              >
                <option value="">Select budget range</option>
                {getBudgetRanges(currency).map((range) => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
              {errors.budgetRange && (
                <p className="text-red-600 text-sm mt-1">{errors.budgetRange}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <FileText className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Supporting Documents</h2>
              <p className="text-gray-600 mt-2">Upload any relevant files (optional)</p>
            </div>

            <FileUpload
              files={formData.files}
              onFilesChange={handleFilesChange}
              maxFiles={5}
              maxSize={5 * 1024 * 1024} // 5MB
            />

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-800 mb-2">Ready to Submit</h3>
              <div className="text-sm text-primary-700 space-y-1">
                <p><strong>Company:</strong> {formData.companyName}</p>
                <p><strong>Email:</strong> {formData.contactEmail}</p>
                <p><strong>Project:</strong> {formData.projectType}</p>
                <p><strong>Timeline:</strong> {formData.timeline}</p>
                <p><strong>Budget:</strong> {formData.budgetRange}</p>
                <p><strong>Files:</strong> {formData.files.length} attached</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        {/* Progress indicator */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="progress-bar h-2">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {renderStep()}

        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
          >
            Previous
          </button>

          {currentStep < 4 ? (
            <button onClick={nextStep} className="btn-primary order-1 sm:order-2">
              Next Step
            </button>
          ) : (
            <LoadingButton
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Submitting Project..."
              variant="primary"
              size="md"
              className="order-1 sm:order-2"
            >
              <div className="flex items-center justify-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Submit Project</span>
              </div>
            </LoadingButton>
          )}
        </div>
      </div>

      {/* Success Animation */}
      <SuccessAnimation
        show={showSuccessAnimation}
        title="Project Submitted Successfully! 🎉"
        message="Thank you for choosing Drink PH! We'll review your project and get back to you within 24 hours with next steps."
        onComplete={() => setShowSuccessAnimation(false)}
      />

      {/* Auto-save Success Notification */}
      <FloatingSuccess
        show={showAutoSaveSuccess}
        message="Progress saved automatically"
        position="bottom"
      />
    </div>
  );
};

export default ClientPortal;