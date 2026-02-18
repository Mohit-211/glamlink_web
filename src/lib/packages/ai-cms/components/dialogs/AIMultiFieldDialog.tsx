'use client';

import { useState, useEffect } from 'react';
import Modal from '@/lib/components/Modal';
import { Sparkles, Loader2, AlertCircle, CheckCircle, Eye, Code } from 'lucide-react';

// Import from package
import { useAIModel } from '../../contexts/AIModelContext';
import { useAIEndpoint } from '../../contexts/AIConfigContext';
import { AIModelSelector } from '../selectors/AIModelSelector';
import { getFieldsForContentType } from '../../config';
import { formatHtmlForDisplay } from '../../utils';

// Import types
import type { 
  FieldDefinition, 
  FieldComparison, 
  AIMultiFieldDialogProps,
  AIMultiFieldResponse 
} from '../../types';

export function AIMultiFieldDialog({
  isOpen,
  onClose,
  contentType,
  currentData,
  onApply,
  sectionSchema,
  endpoint
}: AIMultiFieldDialogProps) {
  // Debug logging to verify dialog is being called
  console.log('🎯 [AIMultiFieldDialog] Rendering with:', {
    isOpen,
    contentType,
    hasCurrentData: !!currentData,
    currentDataKeys: currentData ? Object.keys(currentData) : []
  });
  const { selectedModel } = useAIModel();
  const defaultEndpoint = useAIEndpoint('multiField');
  const apiEndpoint = endpoint || defaultEndpoint;
  const [userPrompt, setUserPrompt] = useState('');
  const [userResponseMessage, setUserResponseMessage] = useState('');
  const [fieldComparisons, setFieldComparisons] = useState<FieldComparison[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isRefinementMode, setIsRefinementMode] = useState(false);
  const [iterationCount, setIterationCount] = useState(0);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setUserPrompt('');
      setUserResponseMessage('');
      setFieldComparisons([]);
      setError(null);
      setShowAnswer(false);
      setIsRefinementMode(false);
      setIterationCount(0);
      setPromptHistory([]);
    }
  }, [isOpen]);

  // Get field definitions based on content type
  const getFieldDefinitions = (): FieldDefinition[] => {
    if (contentType === 'custom-section' && sectionSchema?.fields) {
      // For custom sections, use the schema fields
      return sectionSchema.fields
        .filter((field: any) => field.type !== 'image' && field.type !== 'image-array')
        .map((field: any) => ({
          fieldName: field.name,
          displayName: field.label || field.name,
          fieldType: getFieldTypeMapping(field.type),
          description: field.description || field.help
        }));
    } else {
      // For basic-info and cover-config, use predefined mappings
      return getFieldsForContentType('magazine', contentType, true);
    }
  };

  // Map section field types to our field types
  const getFieldTypeMapping = (sectionFieldType: string): FieldDefinition['fieldType'] => {
    switch (sectionFieldType) {
      case 'html':
      case 'textarea':
        return 'html';
      case 'number':
        return 'number';
      case 'date':
        return 'date';
      case 'select':
        return 'select';
      default:
        return 'text';
    }
  };

  const handleSendPrompt = async (forceRefinementMode?: boolean) => {
    if (!userPrompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Use the forced refinement mode or the current state
    const effectiveRefinementMode = forceRefinementMode ?? isRefinementMode;
    
    // Only hide answer section for initial generation, keep it visible for refinements
    if (!effectiveRefinementMode) {
      setShowAnswer(false);
      setUserResponseMessage('');
    }

    try {
      // Get field definitions for this content type
      const fieldDefinitions = getFieldDefinitions();
      
      // Prepare the current content data
      // In refinement mode, use the AI-proposed values as the "current" data
      const relevantData: Record<string, any> = {};
      fieldDefinitions.forEach(field => {
        let rawValue;
        if (effectiveRefinementMode && fieldComparisons.length > 0) {
          // Use the AI-proposed value from the previous iteration as the base
          const comparison = fieldComparisons.find(c => c.fieldName === field.fieldName);
          rawValue = comparison?.newValue || currentData[field.fieldName] || '';
        } else {
          // Initial generation: use the original current data
          rawValue = currentData[field.fieldName] || '';
        }
        
        // Clean value to avoid circular references
        if (typeof rawValue === 'string' || typeof rawValue === 'number' || typeof rawValue === 'boolean') {
          relevantData[field.fieldName] = rawValue;
        } else {
          relevantData[field.fieldName] = rawValue ? String(rawValue) : '';
        }
      });

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          currentData: relevantData,
          userPrompt,
          selectedFields: fieldDefinitions.map(field => field.fieldName),
          selectedModel,
          isRefinement: effectiveRefinementMode,
          iterationCount: iterationCount + 1,
          promptHistory: effectiveRefinementMode ? [...promptHistory, userPrompt] : [userPrompt]
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `HTTP error! status: ${response.status}`);
      }

      const result: AIMultiFieldResponse = await response.json();

      if (!result.success) {
        setError(result.error || 'Failed to get AI response');
        return;
      }

      if (result.fieldUpdates && result.userResponse) {
        setUserResponseMessage(result.userResponse);
        
        // Update iteration tracking
        const newIterationCount = iterationCount + 1;
        setIterationCount(newIterationCount);
        setPromptHistory(prev => [...prev, userPrompt]);
        
        // Create field comparisons
        // In refinement mode, preserve previous AI-proposed values for unchanged fields
        const comparisons: FieldComparison[] = fieldDefinitions.map(field => {
          if (effectiveRefinementMode && fieldComparisons.length > 0) {
            // Find the previous comparison for this field
            const previousComp = fieldComparisons.find(c => c.fieldName === field.fieldName);
            
            // If AI returned an update for this field, use it. Otherwise, keep the previous AI value
            const newValue = result.fieldUpdates![field.fieldName] !== undefined 
              ? result.fieldUpdates![field.fieldName]
              : (previousComp?.newValue !== undefined && previousComp?.newValue !== '' 
                  ? previousComp.newValue  // Preserve previous AI value if it exists and isn't empty
                  : currentData[field.fieldName] || ''); // Fall back to original data
            
            return {
              fieldName: field.fieldName,
              displayName: field.displayName,
              fieldType: field.fieldType,
              oldValue: currentData[field.fieldName] || '', // Always show original data as "old"
              newValue: newValue,
              shouldUpdate: newValue !== (currentData[field.fieldName] || '') // Compare against original, not previous AI
            };
          } else {
            // Initial generation - compare against original data
            return {
              fieldName: field.fieldName,
              displayName: field.displayName,
              fieldType: field.fieldType,
              oldValue: currentData[field.fieldName] || '',
              newValue: result.fieldUpdates![field.fieldName] || currentData[field.fieldName] || '',
              shouldUpdate: result.fieldUpdates![field.fieldName] !== undefined && 
                           result.fieldUpdates![field.fieldName] !== (currentData[field.fieldName] || '')
            };
          }
        });
        
        setFieldComparisons(comparisons);
        setShowAnswer(true);
        
        // Clear prompt for next refinement
        setUserPrompt('');
      } else {
        setError('Invalid response format from AI');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('AI multi-field dialog error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldToggle = (fieldName: string) => {
    setFieldComparisons(prev =>
      prev.map(comp =>
        comp.fieldName === fieldName
          ? { ...comp, shouldUpdate: !comp.shouldUpdate }
          : comp
      )
    );
  };

  const handleRequestChanges = async () => {
    if (!userPrompt.trim()) {
      setError('Please enter your change request first');
      return;
    }
    
    setIsRefinementMode(true);
    
    // Pass true directly to avoid async state timing issues
    await handleSendPrompt(true);
  };

  const handleApplyChanges = () => {
    const updates: Record<string, any> = {};
    
    fieldComparisons.forEach(comp => {
      if (comp.shouldUpdate) {
        updates[comp.fieldName] = comp.newValue;
      }
    });
    
    if (Object.keys(updates).length > 0) {
      onApply(updates);
      onClose();
    }
  };

  const formatValueForDisplay = (value: any, fieldType: FieldDefinition['fieldType']): string => {
    if (!value) return '';
    
    if (fieldType === 'html') {
      return formatHtmlForDisplay(value);
    }
    
    return String(value);
  };

  const getContentTypeTitle = (): string => {
    switch (contentType) {
      case 'basic-info':
        return 'Basic Information';
      case 'cover-config':
        return 'Cover Configuration';
      case 'custom-section':
        return 'Custom Section';
      default:
        return 'Content';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              AI Content Editor - {getContentTypeTitle()}
              {iterationCount > 0 && (
                <span className="ml-2 px-2 py-1 text-sm bg-purple-100 text-purple-700 rounded-full">
                  {iterationCount === 1 ? '1st' : iterationCount === 2 ? '2nd' : iterationCount === 3 ? '3rd' : `${iterationCount}th`} iteration
                </span>
              )}
            </h2>
          </div>
          
          <AIModelSelector variant="compact" />
        </div>

        {/* Prompt Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isRefinementMode 
              ? "What specific changes would you like to make?" 
              : `How would you like to modify the ${getContentTypeTitle().toLowerCase()}?`
            }
          </label>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder={isRefinementMode 
              ? "E.g., Make the editor's note longer and add a paragraph about Tricia Evans, Shorten the title, Fix the description formatting..."
              : "E.g., Make this more professional, Add more details about..., Optimize for SEO, Fix grammar and tone..."
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={3}
            disabled={isLoading}
          />
          {isRefinementMode && (
            <p className="text-xs text-gray-500 mt-1">
              💡 Tip: Be specific about which fields to change. Unmentioned fields will stay the same.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mb-4 flex gap-3">
          {/* Send to AI - only show for initial generation */}
          {!showAnswer && (
            <button
              onClick={() => handleSendPrompt()}
              disabled={isLoading || !userPrompt.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Send to AI
                </>
              )}
            </button>
          )}
          
          {/* Request Changes - only show after initial response */}
          {showAnswer && (
            <button
              onClick={handleRequestChanges}
              disabled={isLoading || !userPrompt.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Refining...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Request Changes
                </>
              )}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Answer Section */}
        {showAnswer && userResponseMessage && (
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <h3 className="font-medium text-purple-900">AI Response:</h3>
            </div>
            <p className="text-sm text-purple-800 whitespace-pre-wrap">{userResponseMessage}</p>
          </div>
        )}

        {/* Field Comparisons */}
        {showAnswer && fieldComparisons.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Proposed Changes</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {fieldComparisons.map((comp) => (
                <div
                  key={comp.fieldName}
                  className={`p-4 border rounded-lg ${
                    comp.shouldUpdate ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      checked={comp.shouldUpdate}
                      onChange={() => handleFieldToggle(comp.fieldName)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label className="font-medium text-gray-900">{comp.displayName}</label>
                    {comp.shouldUpdate && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        Will update
                      </span>
                    )}
                    {isRefinementMode && comp.shouldUpdate && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        Refined
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Current Value */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Current:</h4>
                      <div className="min-h-[60px] p-3 border border-gray-200 rounded bg-white overflow-y-auto">
                        {comp.fieldType === 'html' ? (
                          <div
                            className="text-sm text-gray-600 whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: comp.oldValue || '<em>No content</em>' }}
                          />
                        ) : (
                          <div className="text-sm text-gray-600 whitespace-pre-wrap">
                            {formatValueForDisplay(comp.oldValue, comp.fieldType) || (
                              <em className="text-gray-400">No content</em>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Proposed Value */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">AI Proposed:</h4>
                      <div className="min-h-[60px] p-3 border border-gray-200 rounded bg-blue-50 overflow-y-auto">
                        {comp.fieldType === 'html' ? (
                          <div
                            className="text-sm text-gray-800 whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: comp.newValue || '<em>No content</em>' }}
                          />
                        ) : (
                          <div className="text-sm text-gray-800 whitespace-pre-wrap">
                            {formatValueForDisplay(comp.newValue, comp.fieldType) || (
                              <em className="text-gray-400">No content</em>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Action Buttons */}
        <div className="flex justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleApplyChanges}
            disabled={!fieldComparisons.some(comp => comp.shouldUpdate)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Apply Selected Changes ({fieldComparisons.filter(comp => comp.shouldUpdate).length})
          </button>
        </div>
      </div>
    </Modal>
  );
}