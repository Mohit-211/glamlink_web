'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

// Import from package
import { AIMultiFieldDialog, AIContentBlockDialog } from '../dialogs';
import { getContentTypeConfig } from '../../config';

// Import types
import type { AITabProps } from '../../types';

export function AITab({ section, onUpdate, sectionSchema, disabled = false }: AITabProps) {
  const [showAIDialog, setShowAIDialog] = useState(false);

  // Type guard to check if content has content blocks
  const hasContentBlocks = (content: any): boolean => {
    return content && content.type === 'custom-section' && Array.isArray(content.contentBlocks);
  };
  
  // Detect if this section has content blocks
  const hasBlocks = hasContentBlocks(section.content) && section.content.contentBlocks.length > 0;

  const handleAIUpdates = (updates: Record<string, any>) => {
    // Apply updates to the section
    const sectionUpdates: any = {};
    
    // Update basic section fields
    Object.entries(updates).forEach(([key, value]) => {
      if (['title', 'subtitle'].includes(key)) {
        sectionUpdates[key] = value;
      } else {
        // Update content fields
        if (!sectionUpdates.content) {
          sectionUpdates.content = { ...section.content };
        }
        sectionUpdates.content[key] = value;
      }
    });
    
    onUpdate(sectionUpdates);
  };

  // Get content type configuration for examples
  const contentTypeConfig = getContentTypeConfig('magazine-section');

  if (disabled) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-400 mb-4">
          <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">AI Content Assistant</h3>
          <p className="text-sm">AI editing is currently unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* AI Tab Content */}
      <div className="text-center">
        <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          AI Content Assistant
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {hasBlocks 
            ? "Let AI help you improve your content blocks. AI will organize updates by section and show exactly what changed."
            : "Let AI help you improve your section content. Describe what changes you want, and AI will update multiple fields at once."
          }
        </p>
        
        <button
          onClick={() => setShowAIDialog(true)}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
        >
          <Sparkles className="w-5 h-5" />
          Ask AI to Edit Content
        </button>
        
        <div className="mt-8 text-left bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Examples of what you can ask:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {hasBlocks ? (
              <>
                <li>• "Add more Key Achievements about my startup experience"</li>
                <li>• "Update The Journey section with more personal details"</li>
                <li>• "Make the professional bio more engaging and detailed"</li>
                <li>• "Add more specialties to the professional profile"</li>
                <li>• "Improve the section headers to be more compelling"</li>
                <li>• "Update content to be more descriptive"</li>
              </>
            ) : contentTypeConfig?.defaultPrompts?.examples ? (
              contentTypeConfig.defaultPrompts.examples.map((example, index) => (
                <li key={index}>• "{example}"</li>
              ))
            ) : (
              <>
                <li>• "Make this more professional and engaging"</li>
                <li>• "Add more details about the benefits"</li>
                <li>• "Optimize this for SEO with relevant keywords"</li>
                <li>• "Fix grammar and improve the tone"</li>
                <li>• "Make this more beginner-friendly"</li>
                <li>• "Add more excitement and energy to the content"</li>
              </>
            )}
          </ul>
        </div>
        
        {sectionSchema && (
          <div className="mt-4 text-left bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Section Type: {sectionSchema.label || 'Custom Section'}
            </h4>
            {sectionSchema.description && (
              <p className="text-sm text-gray-600 mb-2">{sectionSchema.description}</p>
            )}
            {sectionSchema.fields && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">
                  AI can update: {sectionSchema.fields
                    .filter((f: any) => f.type !== 'image' && f.type !== 'image-array')
                    .map((f: any) => f.label || f.name)
                    .join(', ')
                  }
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Note: Image fields will not be modified by AI
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* AI Dialog - Choose appropriate dialog based on content structure */}
      {hasBlocks ? (
        <AIContentBlockDialog
          isOpen={showAIDialog}
          onClose={() => setShowAIDialog(false)}
          section={section}
          onApply={handleAIUpdates}
        />
      ) : (
        <AIMultiFieldDialog
          isOpen={showAIDialog}
          onClose={() => setShowAIDialog(false)}
          contentType="custom-section"
          currentData={{ ...section, ...section.content }}
          onApply={handleAIUpdates}
          sectionSchema={sectionSchema}
        />
      )}
    </div>
  );
}