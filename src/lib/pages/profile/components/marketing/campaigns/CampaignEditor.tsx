/**
 * Campaign Editor Component
 *
 * Main editor interface for creating and editing email campaigns.
 * Features split-pane layout with sidebar, preview, and section editing.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/features/auth/useAuth';
import { useCampaign } from '@/lib/features/crm/marketing/hooks';
import { Campaign, EmailSectionType } from '@/lib/features/crm/marketing/types';
import { CampaignSidebar } from './CampaignSidebar';
import { EmailPreview } from './EmailBuilder/EmailPreview';
import { EmailBuilder } from './EmailBuilder/EmailBuilder';
import { AddSectionMenu } from './EmailBuilder/AddSectionMenu';

interface CampaignEditorProps {
  campaignId: string;
}

export function CampaignEditor({ campaignId }: CampaignEditorProps) {
  const router = useRouter();
  const { user } = useAuth();
  const brandId = (user as any)?.brandId || 'test-brand-123';

  const {
    campaign,
    loading,
    saving,
    error,
    hasUnsavedChanges,
    updateCampaign,
    saveCampaign,
  } = useCampaign(brandId, campaignId);

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      await saveCampaign();
    } catch (err) {
      console.error('Failed to save campaign:', err);
    }
  };

  const handleSendTest = async () => {
    // TODO: Implement send test email
    alert('Send test email - not implemented');
  };

  const handleReview = () => {
    // TODO: Navigate to review/schedule page
    alert('Review & schedule - not implemented');
  };

  const handleAddSection = (type: EmailSectionType) => {
    if (!campaign) return;

    const existingSections = campaign.content?.sections || [];
    const newSection = {
      id: crypto.randomUUID(),
      type,
      content: getDefaultContentForType(type),
      order: existingSections.length,
    };

    const updatedSections = [...existingSections, newSection];
    updateCampaign({
      content: { ...campaign.content, sections: updatedSections }
    });

    // Auto-select the new section
    setSelectedSectionId(newSection.id);
  };

  // Helper function to get default content for section type
  const getDefaultContentForType = (type: EmailSectionType) => {
    switch (type) {
      case 'header':
        return { text: 'Your Brand', logoUrl: '' };
      case 'text':
        return { text: '', align: 'left' };
      case 'image':
        return { src: '', alt: '', href: '' };
      case 'button':
        return { text: 'Click here', href: '', backgroundColor: '#ec4899' };
      case 'divider':
        return {};
      case 'footer':
        return {
          companyName: 'Your Company',
          address: '',
          showUnsubscribe: true,
        };
      default:
        return {};
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Please log in to edit campaigns</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4">Error loading campaign: {error.message}</p>
        <button
          onClick={() => router.push('/profile/marketing/campaigns')}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Back to campaigns
        </button>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">Campaign not found</p>
        <button
          onClick={() => router.push('/profile/marketing/campaigns')}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Back to campaigns
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/profile/marketing/campaigns')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <input
                  type="text"
                  value={campaign.subject || campaign.name}
                  onChange={(e) => updateCampaign({ subject: e.target.value })}
                  className="font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-pink-500 rounded px-1 -ml-1"
                  placeholder="Enter campaign subject..."
                />
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded capitalize">
                    {campaign.status}
                  </span>
                  {hasUnsavedChanges && (
                    <span className="text-xs text-orange-600">• Unsaved changes</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Preview modes */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button className="p-2 hover:bg-gray-100" title="Desktop preview">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 border-l border-gray-200" title="Mobile preview">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            {hasUnsavedChanges && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            )}

            <button
              onClick={handleSendTest}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Send test
            </button>

            <button
              onClick={handleReview}
              className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              Review
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Left Sidebar - Campaign Settings */}
        <CampaignSidebar
          campaign={campaign}
          onChange={updateCampaign}
        />

        {/* Center - Email Preview */}
        <div className="flex-1 p-8 overflow-y-auto">
          <EmailPreview
            campaign={campaign}
            selectedSectionId={selectedSectionId}
            onSelectSection={setSelectedSectionId}
          />
        </div>

        {/* Right Sidebar - Section Editor (when section selected) */}
        {selectedSectionId && (
          <EmailBuilder
            campaign={campaign}
            selectedSectionId={selectedSectionId}
            onChange={updateCampaign}
            onClose={() => setSelectedSectionId(null)}
          />
        )}
      </div>

      {/* Add Section Button */}
      <AddSectionMenu onAddSection={handleAddSection} />
    </div>
  );
}
