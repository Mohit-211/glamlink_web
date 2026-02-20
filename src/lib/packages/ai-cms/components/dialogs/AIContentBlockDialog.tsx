'use client';

import { useState, useEffect } from 'react';
import Modal from '@/lib/components/Modal';
import { Sparkles, Loader2, AlertCircle, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';

// Import from package
import { useAIModel } from '../../contexts/AIModelContext';
import { AIModelSelector } from '../selectors/AIModelSelector';
import { formatHtmlForDisplay } from '../../utils';

// Import types
import type { 
  AIContentBlockDialogProps,
  ContentBlockGroup,
  AIContentBlockResponse
} from '../../types';

export function AIContentBlockDialog({
  isOpen,
  onClose,
  section,
  onApply
}: AIContentBlockDialogProps) {
  const { selectedModel } = useAIModel();
  const [userPrompt, setUserPrompt] = useState('');
  const [userResponseMessage, setUserResponseMessage] = useState('');
  const [contentBlockGroups, setContentBlockGroups] = useState<ContentBlockGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [iterationCount, setIterationCount] = useState(0);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<Set<number>>(new Set());
  const [showBlockSelection, setShowBlockSelection] = useState(true);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setUserPrompt('');
      setUserResponseMessage('');
      setContentBlockGroups([]);
      setError(null);
      setShowAnswer(false);
      setExpandedGroups(new Set());
      setIterationCount(0);
      setPromptHistory([]);
      setSelectedBlocks(new Set());
      setShowBlockSelection(true);
    }
  }, [isOpen]);

  // Extract field value using dot notation path
  const getFieldValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Set field value using dot notation path
  const setFieldValue = (obj: any, path: string, value: any): any => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
    return obj;
  };

  // Type guard to check if content is CustomSectionContent
  const isCustomSectionContent = (content: any): boolean => {
    return content && content.type === 'custom-section' && Array.isArray(content.contentBlocks);
  };

  const handleSendPrompt = async () => {
    if (!userPrompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowAnswer(false);
    setUserResponseMessage('');

    try {
      // TODO: Implement content block generation logic
      // This is a placeholder implementation
      setError('Content block generation not yet implemented in package');
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('AI content block dialog error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyChanges = () => {
    // TODO: Implement apply changes logic
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              AI Content Block Editor
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
            How would you like to modify the content blocks?
          </label>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="E.g., Add more Key Achievements about my Ranowo startup, Update The Journey section with intro about growing up in Los Angeles..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={3}
            disabled={isLoading}
          />
        </div>

        {/* Action Button */}
        <div className="mb-4">
          <button
            onClick={handleSendPrompt}
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
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Placeholder for content block groups */}
        <div className="mb-6">
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Content Block AI editing will be implemented in a future update.</p>
            <p className="text-sm mt-1">Use the Multi-Field dialog for now.</p>
          </div>
        </div>

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
            disabled={true}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Apply Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}