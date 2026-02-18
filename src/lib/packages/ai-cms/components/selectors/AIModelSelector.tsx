'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

// Import from package
import { useAIModel } from '../../contexts/AIModelContext';
import { AI_MODELS, getAvailableModels } from '../../config';

// Import types
import type { ModelSelectorProps, AIModel } from '../../types';

export function AIModelSelector({ 
  selectedModel: controlledModel,
  onModelChange,
  variant = 'default',
  disabled = false,
  showDescription = true,
  className = ''
}: ModelSelectorProps) {
  const { selectedModel: contextModel, setSelectedModel } = useAIModel();
  
  // Use controlled model if provided, otherwise use context
  const currentModel = controlledModel || contextModel;
  const handleModelChange = onModelChange || setSelectedModel;
  
  const availableModels = getAvailableModels();
  const currentModelConfig = AI_MODELS[currentModel];

  const isCompact = variant === 'compact';
  const isDetailed = variant === 'detailed';

  return (
    <div className={`relative ${className}`}>
      <select
        value={currentModel}
        onChange={(e) => handleModelChange(e.target.value as AIModel)}
        disabled={disabled}
        className={`
          appearance-none bg-white border border-gray-300 rounded-md
          focus:ring-2 focus:ring-purple-500 focus:border-transparent
          pr-8 transition-colors cursor-pointer
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${isCompact 
            ? 'px-2 py-1 text-xs' 
            : isDetailed
            ? 'px-4 py-3 text-base'
            : 'px-3 py-2 text-sm'
          }
        `}
        title={currentModelConfig.description}
      >
        {availableModels.map((model) => (
          <option key={model.id} value={model.id}>
            {isCompact ? model.label : `Model: ${model.label}`}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <ChevronDown className={`text-gray-400 ${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
      </div>
      
      {/* Model description */}
      {showDescription && !isCompact && (
        <p className={`text-gray-500 mt-1 ${isDetailed ? 'text-sm' : 'text-xs'}`}>
          {currentModelConfig.description}
        </p>
      )}
      
      {/* Detailed view with additional info */}
      {isDetailed && (
        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Max Tokens:</span>
            <span>{currentModelConfig.maxTokens.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Temperature:</span>
            <span>{currentModelConfig.temperature}</span>
          </div>
        </div>
      )}
    </div>
  );
}