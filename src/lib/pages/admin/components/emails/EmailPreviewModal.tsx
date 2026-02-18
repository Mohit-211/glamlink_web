'use client';

import { useState, useEffect } from 'react';
import { UnifiedTemplate } from './EmailsTab';
import { renderEmailToHtml, validateEmailHtml } from '@/lib/emails/utils/emailRenderer';
import { downloadHtmlFile, copyHtmlToClipboard } from '@/lib/emails/utils/emailDownloader';
import SectionBuiltLayout from '@/lib/emails/templates/custom/SectionBuiltLayout';
import ThankYouLayout1 from '@/lib/emails/templates/thank-you/ThankYouLayout1';
import ThankYouShort from '@/lib/emails/templates/thank-you/ThankYouShort';
import MailchimpCampaignModal from '@/lib/emails/components/MailchimpCampaignModal';
import thankYouData from '@/lib/emails/data/thank-you1.json';
import { XMarkIcon, SpinnerIcon } from '@/lib/pages/admin/components/shared/common';

// Component mapping for regular templates
const REGULAR_TEMPLATE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  'ThankYouLayout1': ThankYouLayout1,
  'ThankYouShort': ThankYouShort
};

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: UnifiedTemplate | null;
}

export default function EmailPreviewModal({
  isOpen,
  onClose,
  template
}: EmailPreviewModalProps) {
  const [emailData, setEmailData] = useState<any>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [showCopied, setShowCopied] = useState(false);
  const [dataLoadError, setDataLoadError] = useState<string | null>(null);
  const [showMailchimpModal, setShowMailchimpModal] = useState(false);

  // Load email data when template changes
  useEffect(() => {
    if (!isOpen || !template) return;

    const loadEmailData = async () => {
      setIsLoading(true);
      setDataLoadError(null);

      try {
        if (template.templateType === 'section-based' && template.dataFile) {
          // Load section-based email data from /lib/emails/data/custom/
          try {
            const dataModule = await import(`@/lib/emails/data/custom/${template.dataFile}`);
            setEmailData(dataModule.default);
          } catch (importError) {
            console.error('Error loading data file:', importError);
            setDataLoadError(`Data file not found: ${template.dataFile}`);
          }
        } else if (template.templateType === 'regular') {
          // Regular templates use thank-you data
          setEmailData(thankYouData);
        }
      } catch (error) {
        console.error('Error loading email data:', error);
        setDataLoadError('Failed to load email data');
      } finally {
        setIsLoading(false);
      }
    };

    loadEmailData();
  }, [isOpen, template]);

  // Generate HTML when data or template changes
  useEffect(() => {
    if (!emailData || !template) return;

    try {
      let html: string;

      if (template.templateType === 'section-based') {
        // Render section-based template
        html = renderEmailToHtml(SectionBuiltLayout, { data: emailData });
      } else if (template.templateType === 'regular' && template.component) {
        // Render regular template
        const Component = REGULAR_TEMPLATE_COMPONENTS[template.component];
        if (Component) {
          html = renderEmailToHtml(Component, { data: emailData });
        } else {
          setDataLoadError(`Component not found: ${template.component}`);
          return;
        }
      } else {
        return;
      }

      setHtmlContent(html);

      // Validate the HTML
      const validation = validateEmailHtml(html);
      setValidationWarnings(validation.warnings);
    } catch (error) {
      console.error('Error rendering email:', error);
      setDataLoadError('Failed to render email template');
    }
  }, [emailData, template]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEmailData(null);
      setHtmlContent('');
      setValidationWarnings([]);
      setDataLoadError(null);
      setShowCopied(false);
    }
  }, [isOpen]);

  const handleDownload = () => {
    if (htmlContent && template) {
      const cleanName = template.name.replace(/[^a-z0-9\s\-]/gi, '').trim();
      const filename = `${cleanName}.html`;
      downloadHtmlFile(htmlContent, filename);
    }
  };

  const handleCopy = async () => {
    if (htmlContent) {
      await copyHtmlToClipboard(htmlContent);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  if (!isOpen || !template) return null;

  return (
    <>
      {/* Main Preview Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{template.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{template.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-2"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                template.templateType === 'section-based'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {template.templateType === 'section-based' ? 'Section-Based' : 'Regular'}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                template.category === 'newsletter' ? 'bg-blue-100 text-blue-800' :
                template.category === 'marketing' ? 'bg-green-100 text-green-800' :
                template.category === 'transactional' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={!htmlContent}
                className="px-4 py-2 bg-glamlink-teal text-white font-medium rounded-md hover:bg-glamlink-teal-dark disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Download HTML
              </button>
              <button
                onClick={handleCopy}
                disabled={!htmlContent}
                className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {showCopied ? 'Copied!' : 'Copy HTML'}
              </button>
              <button
                onClick={() => setShowMailchimpModal(true)}
                disabled={!htmlContent}
                className="flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
                </svg>
                Send via Mailchimp
              </button>
            </div>
          </div>

          {/* Data Load Error */}
          {dataLoadError && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{dataLoadError}</p>
            </div>
          )}

          {/* Validation Warnings */}
          {validationWarnings.length > 0 && (
            <div className="mx-6 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Email Validation Warnings:</h3>
              <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                {validationWarnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview Content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-100">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <SpinnerIcon className="h-12 w-12 text-glamlink-teal" />
                <p className="mt-4 text-gray-600">Loading template...</p>
              </div>
            ) : htmlContent ? (
              <div className="mx-auto bg-white shadow-lg" style={{ maxWidth: '700px' }}>
                <iframe
                  srcDoc={htmlContent}
                  className="w-full border-0"
                  style={{ minHeight: '800px' }}
                  title="Email Preview"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                {dataLoadError ? 'Failed to load template' : 'Loading...'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mailchimp Campaign Modal */}
      <MailchimpCampaignModal
        isOpen={showMailchimpModal}
        onClose={() => setShowMailchimpModal(false)}
        htmlContent={htmlContent}
        emailData={emailData}
        templateName={template?.name || 'Email Campaign'}
      />
    </>
  );
}
