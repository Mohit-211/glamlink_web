"use client";

import React from 'react';
import { GetFeaturedFormData } from '../../../featured/types';
import { TemplateConfig } from '../../../featured/config/templates';

interface TemplateRendererProps {
  template: TemplateConfig | null;
  formData: GetFeaturedFormData;
  isPreview?: boolean;
}

export default function TemplateRenderer({
  template,
  formData,
  isPreview = false
}: TemplateRendererProps) {
  // Case 1: No template provided
  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-64 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center p-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Template Not Found</h3>
          <p className="text-gray-500 text-sm max-w-md">
            The requested template could not be found. Please select a different template from the dropdown.
          </p>
        </div>
      </div>
    );
  }

  // Case 2: Template exists but component is not available (placeholder)
  if (!template.component) {
    return (
      <div className="flex items-center justify-center min-h-64 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="text-center p-8">
          <div className="text-yellow-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            {template.name} Template
          </h3>
          <p className="text-yellow-700 text-sm max-w-md mb-4">
            {template.description}
          </p>
          <div className="bg-yellow-100 rounded-lg p-4 text-sm text-yellow-800">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Coming Soon</span>
            </div>
            <p>
              This template is currently under development and will be available in a future update.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Template and component are available - render the template
  try {
    const TemplateComponent = template.component;
    return <TemplateComponent data={formData} isPreview={isPreview} />;
  } catch (error) {
    // Case 4: Error rendering template component
    console.error('Error rendering template:', error);
    return (
      <div className="flex items-center justify-center min-h-64 bg-red-50 rounded-lg border border-red-200">
        <div className="text-center p-8">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-900 mb-2">Template Error</h3>
          <p className="text-red-700 text-sm max-w-md">
            There was an error rendering the "{template.name}" template. Please try selecting a different template.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="text-xs text-red-600 cursor-pointer">Error Details</summary>
              <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
                {error instanceof Error ? error.message : String(error)}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }
}

// Helper component for rendering multiple templates with consistent styling
interface TemplateGalleryProps {
  templates: TemplateConfig[];
  formData: GetFeaturedFormData;
  selectedTemplate: TemplateConfig | null;
  onTemplateSelect?: (template: TemplateConfig) => void;
  showSelector?: boolean;
}

export function TemplateGallery({
  templates,
  formData,
  selectedTemplate,
  onTemplateSelect,
  showSelector = false
}: TemplateGalleryProps) {
  if (!templates.length) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Templates Available</h3>
        <p className="text-gray-500 text-sm">
          There are currently no templates available for this category.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {templates.map((template) => (
        <div
          key={template.id}
          className={`
            relative rounded-lg border-2 transition-all duration-200
            ${selectedTemplate?.id === template.id
              ? 'border-glamlink-teal bg-glamlink-teal/5'
              : 'border-gray-200 hover:border-gray-300'
            }
            ${onTemplateSelect ? 'cursor-pointer' : ''}
          `}
          onClick={() => onTemplateSelect?.(template)}
        >
          {selectedTemplate?.id === template.id && (
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-glamlink-teal text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Selected
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
              {!template.isAvailable && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  Coming Soon
                </span>
              )}
            </div>

            <div className="bg-white rounded-lg overflow-hidden">
              <TemplateRenderer
                template={template}
                formData={formData}
                isPreview={true}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}