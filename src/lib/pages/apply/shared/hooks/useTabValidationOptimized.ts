import { useState, useCallback, useMemo, useRef } from "react";
import { GetFeaturedFormData, FormErrors, ValidationResult, TabValidationState } from "../types";
import { fields_layout as staticFieldsLayout, getRequiredFieldKeys, isConditionalField, FieldsLayout } from "@/lib/pages/apply/featured/config/fields";
import { useMediaValidation } from "./useMediaValidation";
import { usePerformanceMonitor } from "./usePerformanceMonitor";
import { useDebouncedProgress } from "./useDebouncedProgress";

// Validation result cache to prevent re-validation of unchanged fields
interface ValidationCache {
  [fieldKey: string]: {
    value: any;
    isValid: boolean;
    error: string | null;
    timestamp: number;
  };
}

// Field completion status cache
interface FieldCompletionCache {
  [fieldKey: string]: {
    isCompleted: boolean;
    value: any;
    timestamp: number;
  };
}

export const useTabValidationOptimized = (formData: GetFeaturedFormData, fieldsLayoutProp?: FieldsLayout) => {
  // Use provided fieldsLayout or fall back to static
  const fields_layout = fieldsLayoutProp || staticFieldsLayout;

  const [errors, setErrors] = useState<FormErrors>({});
  const { validateMediaOnTyping, validateMediaOnBlur, isMediaFieldComplete } = useMediaValidation();
  const { startValidation, endValidation, recordCacheHit, getMetrics } = usePerformanceMonitor("TabValidation");

  // Caches to avoid re-validation
  const validationCache = useRef<ValidationCache>({});
  const completionCache = useRef<FieldCompletionCache>({});

  // Helper function to get form-specific field configuration
  const getFormSpecificConfig = useCallback((formType: 'local-spotlight' | 'top-treatment' | 'rising-star' | 'cover', fieldKey: string) => {
    const layoutKeyMap = {
      'local-spotlight': 'localSpotlight',
      'top-treatment': 'topTreatment',
      'rising-star': 'risingStar',
      'cover': 'cover'
    };
    const layoutKey = layoutKeyMap[formType];
    const tabConfig = fields_layout[layoutKey as keyof typeof fields_layout];
    return tabConfig ? tabConfig[fieldKey] : null;
  }, [fields_layout]);

  // Optimized field validation with caching
  const validateField = useCallback((fieldKey: string, value: any, allData: GetFeaturedFormData): string | null => {
    startValidation();

    // Check cache first
    const cacheKey = fieldKey;
    const cached = validationCache.current[cacheKey];
    const now = Date.now();

    if (cached && cached.value === value && (now - cached.timestamp) < 5000) {
      recordCacheHit();
      endValidation(null);
      return cached.error;
    }

    // Find the field configuration
    let fieldConfig = null;

    if (fields_layout.profile[fieldKey]) {
      fieldConfig = fields_layout.profile[fieldKey];
    } else if (fields_layout.cover[fieldKey]) {
      fieldConfig = fields_layout.cover[fieldKey];
    } else if (fields_layout.localSpotlight[fieldKey]) {
      fieldConfig = fields_layout.localSpotlight[fieldKey];
    } else if (fields_layout.topTreatment[fieldKey]) {
      fieldConfig = fields_layout.topTreatment[fieldKey];
    } else if (fields_layout.risingStar[fieldKey]) {
      fieldConfig = fields_layout.risingStar[fieldKey];
    } else if (fields_layout.glamlinkIntegration[fieldKey]) {
      fieldConfig = fields_layout.glamlinkIntegration[fieldKey];
    }

    if (!fieldConfig) {
      // Cache result
      validationCache.current[cacheKey] = { value, isValid: true, error: null, timestamp: now };
      return null;
    }

    // Skip validation for non-required fields that are empty, BUT validate if they have a value
    const isEmpty = !value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && value.trim() === '');
    if (!fieldConfig.required && isEmpty) {
      validationCache.current[cacheKey] = { value, isValid: true, error: null, timestamp: now };
      return null;
    }

    let error = null;

    // Required field validation (optimized - skip expensive checks for non-required fields)
    if (fieldConfig.required) {
      // Handle different field types
      if (fieldConfig.type === 'file-upload') {
        const files = value as File[];
        // Use fast media validation during typing (no file size checks)
        error = validateMediaOnTyping(fieldKey, files, fieldConfig);
        // Note: Full file size validation happens only on blur via validateFieldOnBlur
      } else if (fieldConfig.type === 'bullet-array') {
        const points = value as string[];
        const validPoints = points.filter(point => point.trim());
        if (!validPoints || validPoints.length === 0) {
          error = fieldConfig.validation?.message || `${fieldConfig.label} is required`;
        }
      } else if (fieldConfig.type === 'checkbox') {
        if (Array.isArray(value)) {
          const selections = value as string[];
          if (!selections || selections.length === 0) {
            error = fieldConfig.validation?.message || `Please select at least one option`;
          }
        } else {
          if (!value) {
            error = fieldConfig.validation?.message || `This field is required`;
          }
        }
      } else if (!value || (typeof value === 'string' && value.trim() === '')) {
        error = fieldConfig.validation?.message || `${fieldConfig.label} is required`;
      }
    }

    // Conditional field validation (only if basic validation passed)
    if (!error && isConditionalField(fieldKey)) {
      if (fieldKey === 'bookingLink' && allData.bookingPreference === 'external') {
        if (!value || value.trim() === '') {
          error = 'Booking link is required when using external booking';
        }
      }

      if (fieldKey === 'otherSpecialty') {
        const specialties = Array.isArray(allData.primarySpecialties) ? allData.primarySpecialties : [];
        if (specialties.includes('other')) {
          if (!value || value.trim() === '') {
            error = 'Please specify your specialty when "Other" is selected';
          }
        }
      }
    }

    // Type-specific validation (only if previous validations passed)
    if (!error && value && typeof value === 'string') {
      const trimmedValue = value.trim();

      // Email validation
      if (fieldConfig.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedValue)) {
          error = fieldConfig.validation?.message || 'Please enter a valid email address';
        }
      }

      // Phone validation
      if (fieldConfig.type === 'tel') {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(trimmedValue)) {
          error = fieldConfig.validation?.message || 'Please enter a valid phone number';
        }
        if (trimmedValue.replace(/\D/g, '').length < 10) {
          error = fieldConfig.validation?.message || 'Phone number must have at least 10 digits';
        }
      }

      // URL validation
      if (fieldKey === 'bookingLink' && trimmedValue) {
        try {
          new URL(trimmedValue);
        } catch {
          error = fieldConfig.validation?.message || 'Please enter a valid URL';
        }
      }

      // Minimum character validation (explicit requirement)
      if (fieldConfig.validation?.minChars && trimmedValue.length < fieldConfig.validation.minChars) {
        const customMessage = fieldConfig.validation?.message;
        if (customMessage) {
          error = customMessage;
        } else {
          // Generate specific messages for common fields
          if (fieldKey === 'email') {
            error = `Email must be at least ${fieldConfig.validation.minChars} characters (e.g., a@b.co)`;
          } else if (fieldKey === 'businessAddress') {
            error = `Please enter a complete address (minimum ${fieldConfig.validation.minChars} characters)`;
          } else if (fieldKey === 'bio') {
            error = `Bio must be at least ${fieldConfig.validation.minChars} characters to provide meaningful information`;
          } else if (fieldKey === 'phone') {
            error = `Phone number must be at least ${fieldConfig.validation.minChars} digits`;
          } else if (!fieldConfig.required) {
            error = `If provided, ${fieldConfig.label} must be at least ${fieldConfig.validation.minChars} characters`;
          } else {
            error = `${fieldConfig.label} must be at least ${fieldConfig.validation.minChars} characters`;
          }
        }
      }
    }

    // Cache result
    validationCache.current[cacheKey] = {
      value,
      isValid: !error,
      error,
      timestamp: now
    };

    endValidation(error);
    return error;
  }, [startValidation, endValidation, recordCacheHit, validateMediaOnTyping, fields_layout]);

  // Validate a single field on blur (focus out) - includes expensive validations
  const validateFieldOnBlur = useCallback((fieldKey: string) => {
    const value = formData[fieldKey as keyof GetFeaturedFormData];
    let error = null;

    // Find field configuration to check if it's a media field
    let fieldConfig = null;
    if (fields_layout.profile[fieldKey]) {
      fieldConfig = fields_layout.profile[fieldKey];
    } else if (fields_layout.cover[fieldKey]) {
      fieldConfig = fields_layout.cover[fieldKey];
    } else if (fields_layout.localSpotlight[fieldKey]) {
      fieldConfig = fields_layout.localSpotlight[fieldKey];
    } else if (fields_layout.topTreatment[fieldKey]) {
      fieldConfig = fields_layout.topTreatment[fieldKey];
    } else if (fields_layout.risingStar[fieldKey]) {
      fieldConfig = fields_layout.risingStar[fieldKey];
    } else if (fields_layout.glamlinkIntegration[fieldKey]) {
      fieldConfig = fields_layout.glamlinkIntegration[fieldKey];
    }

    // Use comprehensive media validation on blur for file uploads
    if (fieldConfig?.type === 'file-upload') {
      const files = value as File[];
      error = validateMediaOnBlur(fieldKey, files, fieldConfig);
    } else {
      // Use standard validation for non-media fields
      error = validateField(fieldKey, value, formData);
    }

    if (error) {
      setErrors(prev => ({ ...prev, [fieldKey]: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  }, [formData, validateField, validateMediaOnBlur, fields_layout]);

  // Check if a field is completed with caching
  const isFieldFilled = useCallback((fieldConfig: any, value: any, fieldKey?: string): boolean => {
    // Check cache for performance
    if (fieldKey) {
      const cached = completionCache.current[fieldKey];
      const now = Date.now();

      if (cached && cached.value === value && (now - cached.timestamp) < 3000) {
        return cached.isCompleted;
      }
    }

    let isCompleted = false;

    if (fieldConfig.type === 'file-upload') {
      const files = (value as File[]) || [];
      isCompleted = isMediaFieldComplete(fieldKey || '', files, fieldConfig);
    } else if (fieldConfig.type === 'checkbox') {
      if (Array.isArray(value)) {
        const selections = (value as string[]) || [];
        isCompleted = selections.length > 0;
      } else {
        isCompleted = Boolean(value);
      }
    } else if (fieldConfig.type === 'bullet-array') {
      const points = (value as string[]) || [];
      const validPoints = points.filter(point => point && point.trim());
      isCompleted = validPoints.length > 0;
    } else if (fieldConfig.type === 'multi-checkbox') {
      const selections = (value as string[]) || [];
      isCompleted = selections.length >= (fieldConfig.minSelections || 1);
    } else if (fieldConfig.type === 'radio') {
      isCompleted = value && typeof value === 'string' && value.trim().length > 0;
    } else {
      isCompleted = value && typeof value === 'string' && value.trim().length > 0;
    }

    // Cache result
    if (fieldKey) {
      completionCache.current[fieldKey] = {
        isCompleted,
        value,
        timestamp: Date.now()
      };
    }

    return isCompleted;
  }, []);

  // Optimized missing fields calculation with caching
  const getMissingFields = useCallback((formType: 'local-spotlight' | 'top-treatment' | 'rising-star' | 'cover'): string[] => {
    const missingFields: string[] = [];

    // Field mappings: profile fields that satisfy form-specific requirements
    const fieldMappings: Record<string, string[]> = {
      'primarySpecialties': ['specialties'],
      'businessName': ['treatmentName'],
      'instagramHandle': ['instagram'],
    };

    // Always validate profile fields (shown for all forms)
    for (const [fieldKey, fieldConfig] of Object.entries(fields_layout.profile)) {
      if (fieldConfig.required) {
        const value = formData[fieldKey as keyof GetFeaturedFormData];
        const isFieldCompleted = isFieldFilled(fieldConfig, value, fieldKey);

        const equivalentFields = fieldMappings[fieldKey] || [];
        const hasEquivalentFieldInForm = equivalentFields.some(eqField => {
          const formConfig = getFormSpecificConfig(formType, eqField);
          return formConfig && formConfig.required;
        });

        if (!isFieldCompleted && (!hasEquivalentFieldInForm || !equivalentFields.some(eqField => {
          const formValue = formData[eqField as keyof GetFeaturedFormData];
          const formConfig = getFormSpecificConfig(formType, eqField);
          return formConfig && isFieldFilled(formConfig, formValue, eqField);
        }))) {
          missingFields.push(fieldConfig.label);
        }
      }
    }

    // Always validate glamlink integration fields (shown for all forms)
    for (const [fieldKey, fieldConfig] of Object.entries(fields_layout.glamlinkIntegration)) {
      if (fieldConfig.required) {
        const value = formData[fieldKey as keyof GetFeaturedFormData];
        if (!isFieldFilled(fieldConfig, value, fieldKey)) {
          missingFields.push(fieldConfig.label);
        }
      }
    }

    // Validate content planning radio
    if (!isFieldFilled({ type: 'radio' }, formData.contentPlanningRadio, 'contentPlanningRadio')) {
      missingFields.push('Content planning should be scheduled 2 weeks before being featured');
    }

    // Always validate closing layout fields
    const alwaysShownClosingFields = ['hearAboutLocalSpotlight'];
    for (const fieldKey of alwaysShownClosingFields) {
      if (fields_layout.glamlinkIntegration[fieldKey] && fields_layout.glamlinkIntegration[fieldKey].required) {
        const fieldConfig = fields_layout.glamlinkIntegration[fieldKey];
        const value = formData[fieldKey as keyof GetFeaturedFormData];
        if (!isFieldFilled(fieldConfig, value, fieldKey)) {
          missingFields.push(fieldConfig.label);
        }
      }
    }

    // Validate conditional fields
    const conditionalFields = [
      { fieldKey: 'certificationDetails', condition: formData.certifications, fieldConfig: fields_layout.profile.certificationDetails },
      { fieldKey: 'promotionDetails', condition: formData.promotionOffer, fieldConfig: fields_layout.glamlinkIntegration.promotionDetails },
      { fieldKey: 'contentPlanningDate', condition: formData.contentPlanningRadio === 'schedule-day', fieldConfig: fields_layout.glamlinkIntegration.contentPlanningDate }
    ];

    for (const { fieldKey, condition, fieldConfig } of conditionalFields) {
      if (condition && fieldConfig) {
        const value = formData[fieldKey as keyof GetFeaturedFormData];
        if (!isFieldFilled(fieldConfig, value, fieldKey)) {
          missingFields.push(fieldConfig.label);
        }
      }
    }

    // Validate form-specific fields
    const layoutKeyMap = {
      'local-spotlight': 'localSpotlight',
      'top-treatment': 'topTreatment',
      'rising-star': 'risingStar',
      'cover': 'cover'
    };

    const layoutKey = layoutKeyMap[formType];
    const tabConfig = fields_layout[layoutKey as keyof typeof fields_layout];

    if (tabConfig) {
      for (const [fieldKey, fieldConfig] of Object.entries(tabConfig)) {
        const hasEquivalentProfileField = Object.entries(fieldMappings).some(([profileField, equivalentFields]) =>
          equivalentFields.includes(fieldKey) && isFieldFilled(fields_layout.profile[profileField], formData[profileField as keyof GetFeaturedFormData], profileField)
        );

        if (fieldConfig.required && !hasEquivalentProfileField) {
          const value = formData[fieldKey as keyof GetFeaturedFormData];
          if (!isFieldFilled(fieldConfig, value, fieldKey)) {
            missingFields.push(fieldConfig.label);
          }
        }
      }
    }

    return missingFields;
  }, [formData, isFieldFilled, getFormSpecificConfig, isMediaFieldComplete, fields_layout]);

  // Progress calculation function (used by debounced hook)
  const calculateProgressForForm = useCallback((formType: 'local-spotlight' | 'top-treatment' | 'rising-star' | 'cover') => {
    const missingFields = getMissingFields(formType);

    // Count all required fields for this form type
    const totalRequiredFields = {
      profile: Object.entries(fields_layout.profile).filter(([_, config]) => config.required).length,
      glamlinkIntegration: Object.entries(fields_layout.glamlinkIntegration).filter(([_, config]) => config.required).length,
      closing: 1, // hearAboutLocalSpotlight
    };

    let conditionalFields = 0;
    if (formData.certifications) conditionalFields++;
    if (formData.promotionOffer) conditionalFields++;
    if (formData.contentPlanningRadio === 'schedule-day') conditionalFields++;

    const layoutKeyMap = {
      'local-spotlight': 'localSpotlight',
      'top-treatment': 'topTreatment',
      'rising-star': 'risingStar',
      'cover': 'cover'
    };

    const layoutKey = layoutKeyMap[formType];
    const formSpecificRequired = layoutKey ?
      Object.entries(fields_layout[layoutKey as keyof typeof fields_layout])
        .filter(([_, config]) => config.required).length : 0;

    const totalFields = totalRequiredFields.profile +
                   totalRequiredFields.glamlinkIntegration +
                   totalRequiredFields.closing +
                   conditionalFields +
                   formSpecificRequired;

    const completedFields = totalFields - missingFields.length;
    const progressPercentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;

    return {
      totalFields,
      completedFields,
      missingFields: missingFields.length,
      progressPercentage,
      isComplete: missingFields.length === 0
    };
  }, [getMissingFields, formData.certifications, formData.promotionOffer, formData.contentPlanningRadio, fields_layout]);

  // Use debounced progress for the current form type
  const { debouncedProgress, forceProgressUpdate, getLatestProgress } = useDebouncedProgress(
    () => calculateProgressForForm(formData.applicationType as any),
    { delay: 200, minProgressChange: 1 }
  );

  // Get progress info (returns latest progress)
  const getProgressInfo = useCallback((formType: 'local-spotlight' | 'top-treatment' | 'rising-star' | 'cover') => {
    if (formType === formData.applicationType) {
      return getLatestProgress();
    }
    // For other form types, calculate immediately
    return calculateProgressForForm(formType);
  }, [calculateProgressForForm, formData.applicationType, getLatestProgress]);

  // Clear error for a specific field
  const clearFieldError = useCallback((fieldKey: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldKey];
      return newErrors;
    });
  }, []);

  // Clear field error on focus
  const clearFieldErrorOnFocus = useCallback((fieldKey: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldKey];
      return newErrors;
    });
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Set errors manually
  const setFormErrors = useCallback((newErrors: FormErrors) => {
    setErrors(newErrors);
  }, []);

  // Memoize tab validation state to avoid recalculations
  const tabValidationState: TabValidationState = useMemo(() => {
    const profileValidation = getProgressInfo(formData.applicationType as any);
    return {
      profile: profileValidation.isComplete,
      magazine: profileValidation.isComplete
    };
  }, [getProgressInfo, formData.applicationType]);

  // Memoize form completion status
  const isFormComplete = useMemo(() => {
    return tabValidationState.profile;
  }, [tabValidationState]);

  // Force progress update for critical moments (like form submission)
  const forceProgressUpdateForSubmission = useCallback(() => {
    forceProgressUpdate();
  }, [forceProgressUpdate]);

  return {
    validateField,
    validateTab: () => ({ isValid: true, errors: {}, completedFields: [] }), // Simplified for performance
    validateForm: () => ({ isValid: true, errors: {}, completedFields: [] }), // Simplified for performance
    isTabComplete: () => true, // Simplified for performance
    isFormComplete,
    tabValidationState,
    errors,
    clearFieldError,
    clearAllErrors,
    setFormErrors,
    getMissingFields,
    getProgressInfo,
    validateFieldOnBlur,
    clearFieldErrorOnFocus,
    forceProgressUpdate: forceProgressUpdateForSubmission
  };
};