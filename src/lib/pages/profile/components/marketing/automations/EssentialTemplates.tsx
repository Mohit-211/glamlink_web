/**
 * EssentialTemplates Component
 *
 * Displays essential automation templates with progress tracking
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAutomations } from '@/lib/features/crm/marketing/hooks';
import { TemplatePreviewModal } from './TemplatePreviewModal';

interface EssentialTemplatesProps {
  brandId: string;
}

const ESSENTIAL_TEMPLATES = [
  {
    id: 'recover_abandoned_checkout',
    name: 'Recover abandoned checkout',
    description:
      "Send an email 10 hours after a customer gets to checkout but doesn't place an order to recover lost sales.",
    icon: '🛒',
  },
  {
    id: 'recover_abandoned_cart',
    name: 'Recover abandoned cart',
    description:
      "Convert motivated customers who have added products to their cart but haven't proceeded to checkout.",
    icon: '🛍️',
  },
  {
    id: 'convert_abandoned_browse',
    name: 'Convert abandoned product browse',
    description:
      "Send a marketing email to customers who viewed a product but didn't add it to their cart.",
    icon: '👀',
  },
  {
    id: 'welcome_new_subscribers',
    name: 'Welcome new subscribers with a discount email',
    description: 'Send new subscribers a welcome email with a discount when they subscribe through a form.',
    icon: '👋',
  },
  {
    id: 'thank_customers',
    name: 'Thank customers after they purchase',
    description: 'Send a different thank you email to customers after their first and second purchases.',
    icon: '🙏',
  },
];

export function EssentialTemplates({ brandId }: EssentialTemplatesProps) {
  const router = useRouter();
  const { automations } = useAutomations(brandId);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Check which templates are already implemented
  const implementedTemplates = new Set(automations.map((a) => a.templateId).filter(Boolean));

  const completedCount = ESSENTIAL_TEMPLATES.filter((t) =>
    implementedTemplates.has(t.id)
  ).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Progress Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative w-8 h-8">
          <svg className="w-8 h-8 text-gray-200" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" />
          </svg>
          <svg
            className="absolute top-0 left-0 w-8 h-8 text-pink-500"
            viewBox="0 0 36 36"
            style={{ transform: 'rotate(-90deg)' }}
          >
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${(completedCount / ESSENTIAL_TEMPLATES.length) * 100} 100`}
            />
          </svg>
        </div>
        <span className="text-sm text-gray-600">
          {completedCount} of {ESSENTIAL_TEMPLATES.length} tasks complete
        </span>
      </div>

      {/* Section Title */}
      <h3 className="font-medium text-gray-900 mb-2">Start with these essential templates</h3>
      <p className="text-sm text-gray-500 mb-6">
        Automate customer communications to increase engagement, sales, and return on your marketing spend.
      </p>

      {/* Templates List */}
      <div className="space-y-3">
        {ESSENTIAL_TEMPLATES.map((template) => {
          const isCompleted = implementedTemplates.has(template.id);

          return (
            <div
              key={template.id}
              className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                isCompleted ? 'bg-green-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => !isCompleted && setSelectedTemplate(template.id)}
            >
              {/* Status Icon */}
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-500' : 'border-2 border-gray-300'
                }`}
              >
                {isCompleted && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium ${isCompleted ? 'text-green-700' : 'text-gray-900'}`}>
                  {template.name}
                </h4>
                <p className="text-sm text-gray-500 mt-0.5">{template.description}</p>

                {!isCompleted && (
                  <button className="mt-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    Preview template
                  </button>
                )}
              </div>

              {/* Preview Image */}
              <div className="flex-shrink-0 w-24 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl">
                {template.icon}
              </div>
            </div>
          );
        })}
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <TemplatePreviewModal
          templateId={selectedTemplate}
          brandId={brandId}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </div>
  );
}

export default EssentialTemplates;
