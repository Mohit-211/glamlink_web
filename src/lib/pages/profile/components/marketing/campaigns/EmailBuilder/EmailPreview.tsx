/**
 * Email Preview Component
 *
 * Renders live preview of email with all sections.
 * Allows clicking to select sections for editing.
 */

'use client';

import { Campaign, EmailSection, CampaignContent } from '@/lib/features/crm/marketing/types';

interface EmailPreviewProps {
  campaign: Campaign;
  selectedSectionId: string | null;
  onSelectSection: (id: string) => void;
}

const DEFAULT_COLORS: NonNullable<CampaignContent['colors']> = {
  background: '#f5f5f5',
  contentBackground: '#ffffff',
  border: '#dbdbdb',
  text: '#333333',
  link: '#ec4899',
};

export function EmailPreview({ campaign, selectedSectionId, onSelectSection }: EmailPreviewProps) {
  const { content } = campaign;
  const colors = { ...DEFAULT_COLORS, ...content?.colors };

  return (
    <div
      className="max-w-xl mx-auto rounded-lg shadow-lg overflow-hidden"
      style={{ backgroundColor: colors.background || '#f5f5f5' }}
    >
      <div
        className="p-6"
        style={{
          backgroundColor: colors.contentBackground || '#ffffff',
          borderColor: colors.border || '#dbdbdb',
        }}
      >
        {content?.sections?.map((section) => (
          <div
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            className={`
              relative cursor-pointer transition-all mb-2
              ${selectedSectionId === section.id
                ? 'ring-2 ring-pink-500 ring-offset-2'
                : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
              }
            `}
          >
            {/* Section type label */}
            {selectedSectionId === section.id && (
              <div className="absolute -top-3 left-2 px-2 py-0.5 bg-pink-500 text-white text-xs rounded capitalize">
                {section.type}
              </div>
            )}

            <SectionPreview section={section} colors={colors} />
          </div>
        ))}

        {(!content?.sections || content.sections.length === 0) && (
          <div className="py-12 text-center text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="font-medium text-gray-600 mb-1">Your email is empty</p>
            <p>Click "Add section" below to start building your email</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Section Preview Component
 *
 * Renders individual section based on type
 */
function SectionPreview({ section, colors }: { section: EmailSection; colors: any }) {
  switch (section.type) {
    case 'header':
      return (
        <div className="py-4 text-center border-b" style={{ borderColor: colors.border }}>
          {section.content?.logoUrl ? (
            <img src={section.content.logoUrl} alt="Logo" className="h-8 mx-auto" />
          ) : (
            <h1 className="text-xl font-semibold" style={{ color: colors.text }}>
              {section.content?.text || 'Your Brand'}
            </h1>
          )}
        </div>
      );

    case 'text':
      return (
        <div
          className="py-4"
          style={{ textAlign: section.content?.align || 'left', color: colors.text }}
        >
          {section.content?.text || 'Enter your text here...'}
        </div>
      );

    case 'image':
      return (
        <div className="py-4">
          {section.content?.src ? (
            <img
              src={section.content.src}
              alt={section.content?.alt || ''}
              className="max-w-full mx-auto rounded"
            />
          ) : (
            <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>Add an image</p>
              </div>
            </div>
          )}
        </div>
      );

    case 'button':
      return (
        <div className="py-4 text-center">
          <a
            href={section.content?.href || '#'}
            className="inline-block px-6 py-3 rounded-lg font-medium text-white"
            style={{ backgroundColor: section.content?.backgroundColor || '#ec4899' }}
            onClick={(e) => e.preventDefault()}
          >
            {section.content?.text || 'Click here'}
          </a>
        </div>
      );

    case 'divider':
      return (
        <div className="py-4">
          <hr style={{ borderColor: colors.border }} />
        </div>
      );

    case 'footer':
      return (
        <div className="py-4 text-center text-sm text-gray-500 border-t" style={{ borderColor: colors.border }}>
          <p className="font-medium">{section.content?.companyName || 'Your Company'}</p>
          {section.content?.address && (
            <p className="whitespace-pre-line mt-1">{section.content.address}</p>
          )}
          {section.content?.showUnsubscribe !== false && (
            <a href="#" className="underline mt-2 inline-block" style={{ color: colors.link }} onClick={(e) => e.preventDefault()}>
              Unsubscribe
            </a>
          )}
          <p className="mt-2 text-xs">&copy; {new Date().getFullYear()} {section.content?.companyName || 'Your Company'}</p>
        </div>
      );

    default:
      return (
        <div className="py-4 text-gray-400 text-center">
          Unknown section type: {section.type}
        </div>
      );
  }
}
