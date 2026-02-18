/**
 * Request Validation Middleware
 * 
 * Validates API request data for AI generation endpoints.
 * Ensures data integrity and security before processing.
 */

import { NextRequest } from 'next/server';
import type { 
  GenerateRequest, 
  ContentBlockRequest, 
  SingleFieldRequest,
  AIModel,
  FieldType 
} from '../../types';

export interface ValidationResult {
  success: boolean;
  data?: any;
  errors?: string[];
}

export interface ValidationRules {
  required?: boolean;
  type?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  options?: string[];
  custom?: (value: any) => string | null;
}

/**
 * Generic field validator
 */
export function validateField(
  value: any, 
  fieldName: string, 
  rules: ValidationRules
): string[] {
  const errors: string[] = [];

  // Required check
  if (rules.required && (value === undefined || value === null || value === '')) {
    errors.push(`${fieldName} is required`);
    return errors; // Return early if required field is missing
  }

  // Skip other validations if value is empty and not required
  if (!value && !rules.required) {
    return errors;
  }

  // Type validation
  if (rules.type) {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (actualType !== rules.type) {
      errors.push(`${fieldName} must be of type ${rules.type}, got ${actualType}`);
    }
  }

  // String-specific validations
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`${fieldName} must be at least ${rules.minLength} characters long`);
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`${fieldName} must be no more than ${rules.maxLength} characters long`);
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(`${fieldName} format is invalid`);
    }
  }

  // Array-specific validations
  if (Array.isArray(value)) {
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`${fieldName} must have at least ${rules.minLength} items`);
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`${fieldName} must have no more than ${rules.maxLength} items`);
    }
  }

  // Options validation
  if (rules.options && !rules.options.includes(value)) {
    errors.push(`${fieldName} must be one of: ${rules.options.join(', ')}`);
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return errors;
}

/**
 * Validate multi-field generation request
 */
export function validateMultiFieldRequest(data: any): ValidationResult {
  const errors: string[] = [];

  // Validate required fields
  errors.push(...validateField(data.contentType, 'contentType', {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 100
  }));

  errors.push(...validateField(data.userPrompt, 'userPrompt', {
    required: true,
    type: 'string',
    minLength: 5,
    maxLength: 2000
  }));

  errors.push(...validateField(data.currentData, 'currentData', {
    required: true,
    type: 'object'
  }));

  errors.push(...validateField(data.selectedFields, 'selectedFields', {
    required: true,
    type: 'object',
    minLength: 1,
    maxLength: 20
  }));

  // Validate optional fields
  if (data.model) {
    errors.push(...validateField(data.model, 'model', {
      type: 'string',
      options: ['gpt-5', 'gpt-5-mini', 'gpt-5-nano']
    }));
  }

  if (data.isRefinement !== undefined) {
    errors.push(...validateField(data.isRefinement, 'isRefinement', {
      type: 'boolean'
    }));
  }

  // Validate refinement context if provided
  if (data.refinementContext) {
    errors.push(...validateField(data.refinementContext, 'refinementContext', {
      type: 'object'
    }));

    if (data.refinementContext.currentIteration !== undefined) {
      errors.push(...validateField(data.refinementContext.currentIteration, 'refinementContext.currentIteration', {
        type: 'number',
        custom: (value) => {
          if (value < 1 || value > 10) {
            return 'currentIteration must be between 1 and 10';
          }
          return null;
        }
      }));
    }
  }

  // Validate selected fields structure
  if (data.selectedFields && typeof data.selectedFields === 'object') {
    const fieldNames = Object.keys(data.selectedFields);
    if (fieldNames.length === 0) {
      errors.push('At least one field must be selected');
    }

    fieldNames.forEach(fieldName => {
      if (typeof fieldName !== 'string' || fieldName.length === 0) {
        errors.push('Field names must be non-empty strings');
      }
    });
  }

  return {
    success: errors.length === 0,
    data: errors.length === 0 ? data as GenerateRequest : undefined,
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * Validate content block generation request
 */
export function validateContentBlockRequest(data: any): ValidationResult {
  const errors: string[] = [];

  // Validate required fields
  errors.push(...validateField(data.contentType, 'contentType', {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 100
  }));

  errors.push(...validateField(data.userPrompt, 'userPrompt', {
    required: true,
    type: 'string',
    minLength: 5,
    maxLength: 2000
  }));

  errors.push(...validateField(data.contentField, 'contentField', {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 100
  }));

  // Validate optional fields
  if (data.currentContent) {
    errors.push(...validateField(data.currentContent, 'currentContent', {
      type: 'string',
      maxLength: 50000
    }));
  }

  if (data.model) {
    errors.push(...validateField(data.model, 'model', {
      type: 'string',
      options: ['gpt-5', 'gpt-5-mini', 'gpt-5-nano']
    }));
  }

  if (data.maxLength !== undefined) {
    errors.push(...validateField(data.maxLength, 'maxLength', {
      type: 'number',
      custom: (value) => {
        if (value < 10 || value > 10000) {
          return 'maxLength must be between 10 and 10000 characters';
        }
        return null;
      }
    }));
  }

  if (data.preserveFormatting !== undefined) {
    errors.push(...validateField(data.preserveFormatting, 'preserveFormatting', {
      type: 'boolean'
    }));
  }

  if (data.includeMarkdown !== undefined) {
    errors.push(...validateField(data.includeMarkdown, 'includeMarkdown', {
      type: 'boolean'
    }));
  }

  return {
    success: errors.length === 0,
    data: errors.length === 0 ? data as ContentBlockRequest : undefined,
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * Validate single field generation request
 */
export function validateSingleFieldRequest(data: any): ValidationResult {
  const errors: string[] = [];

  // Validate required fields
  errors.push(...validateField(data.contentType, 'contentType', {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 100
  }));

  errors.push(...validateField(data.fieldName, 'fieldName', {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 100
  }));

  errors.push(...validateField(data.userPrompt, 'userPrompt', {
    required: true,
    type: 'string',
    minLength: 3,
    maxLength: 1000
  }));

  // Validate optional fields
  if (data.fieldType) {
    errors.push(...validateField(data.fieldType, 'fieldType', {
      type: 'string',
      options: ['text', 'textarea', 'html', 'url', 'email', 'number', 'date', 'select']
    }));
  }

  if (data.currentValue) {
    errors.push(...validateField(data.currentValue, 'currentValue', {
      type: 'string',
      maxLength: 5000
    }));
  }

  if (data.model) {
    errors.push(...validateField(data.model, 'model', {
      type: 'string',
      options: ['gpt-5', 'gpt-5-mini', 'gpt-5-nano']
    }));
  }

  if (data.maxLength !== undefined) {
    errors.push(...validateField(data.maxLength, 'maxLength', {
      type: 'number',
      custom: (value) => {
        if (value < 1 || value > 2000) {
          return 'maxLength must be between 1 and 2000 characters';
        }
        return null;
      }
    }));
  }

  if (data.suggestions) {
    errors.push(...validateField(data.suggestions, 'suggestions', {
      type: 'object',
      maxLength: 10
    }));
  }

  if (data.context) {
    errors.push(...validateField(data.context, 'context', {
      type: 'object'
    }));
  }

  return {
    success: errors.length === 0,
    data: errors.length === 0 ? data as SingleFieldRequest : undefined,
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export function sanitizeInput(data: any): any {
  if (typeof data === 'string') {
    // Remove potentially dangerous HTML tags and scripts
    return data
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return data;
}

/**
 * Validate request based on type
 */
export function validateRequest(
  requestType: 'multiField' | 'contentBlock' | 'singleField',
  data: any
): ValidationResult {
  // Sanitize input first
  const sanitizedData = sanitizeInput(data);
  
  switch (requestType) {
    case 'multiField':
      return validateMultiFieldRequest(sanitizedData);
    case 'contentBlock':
      return validateContentBlockRequest(sanitizedData);
    case 'singleField':
      return validateSingleFieldRequest(sanitizedData);
    default:
      return {
        success: false,
        errors: ['Invalid request type']
      };
  }
}

/**
 * Middleware wrapper for request validation
 */
export function withValidation<T>(
  requestType: 'multiField' | 'contentBlock' | 'singleField',
  handler: (request: NextRequest, validatedData: T) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    try {
      // Parse request body
      let data;
      try {
        data = await request.json();
      } catch (error) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Invalid JSON in request body'
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Validate request
      const validationResult = validateRequest(requestType, data);
      
      if (!validationResult.success) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Validation failed',
            details: validationResult.errors
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Add validated data to request context
      (request as any).validatedData = validationResult.data;

      // Call handler with validated data
      return await handler(request, validationResult.data as T);

    } catch (error) {
      console.error('Validation middleware error:', error);
      
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Internal validation error'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  };
}

/**
 * Get validated data from request (after validation middleware)
 */
export function getValidatedDataFromRequest<T>(request: NextRequest): T | null {
  return (request as any).validatedData || null;
}