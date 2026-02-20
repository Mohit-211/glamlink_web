/**
 * Create Campaign Modal
 *
 * Modal for selecting campaign type and creating a new campaign.
 * Displays different marketing activity types (Email, SMS, etc.)
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCampaigns } from '@/lib/features/crm/marketing/hooks';

interface CreateCampaignModalProps {
  brandId: string;
  onClose: () => void;
}

type ActivityType = {
  id: string;
  name: string;
  description: string;
  category: 'email' | 'ads' | 'social' | 'sms';
  icon: string;
  isPaid?: boolean;
  isFree?: boolean;
  recommended?: boolean;
};

const ACTIVITY_TYPES: ActivityType[] = [
  {
    id: 'email',
    name: 'Email Campaign',
    description: '10,000 free emails per month; $1 per 1,000 additional emails',
    category: 'email',
    icon: '✉️',
    isFree: true,
  },
  {
    id: 'sms',
    name: 'SMS Campaign',
    description: 'Send text messages to subscribers',
    category: 'sms',
    icon: '📱',
    isPaid: true,
  },
  // Future: Ads integrations
  // {
  //   id: 'pinterest_catalog',
  //   name: 'Pinterest catalog sales ad',
  //   description: 'Drive sales on your products with shopping ads',
  //   category: 'ads',
  //   icon: '📌',
  //   isPaid: true,
  // },
];

export function CreateCampaignModal({ brandId, onClose }: CreateCampaignModalProps) {
  const router = useRouter();
  const { createCampaign } = useCampaigns(brandId);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [creating, setCreating] = useState(false);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'email', label: 'Email' },
    { id: 'sms', label: 'SMS' },
    // { id: 'ads', label: 'Ads' },
    // { id: 'social', label: 'Social Post' },
  ];

  const filteredTypes = ACTIVITY_TYPES.filter(
    t => activeCategory === 'all' || t.category === activeCategory
  );

  const handleSelect = async (type: ActivityType) => {
    setCreating(true);
    try {
      const campaign = await createCampaign({
        name: 'Untitled campaign',
        type: type.category === 'email' ? 'email' : 'sms',
        status: 'draft',
        recipientType: 'all',
        recipientCount: 0,
        content: {
          colors: {
            background: '#f5f5f5',
            contentBackground: '#ffffff',
            border: '#dbdbdb',
            text: '#333333',
            link: '#ec4899',
          },
          sections: [],
        },
        metrics: {
          sent: 0,
          delivered: 0,
          deliveryRate: 0,
          opened: 0,
          openRate: 0,
          clicked: 0,
          clickRate: 0,
          unsubscribed: 0,
          bounced: 0,
          complained: 0,
          conversions: 0,
          conversionRate: 0,
          revenue: 0,
        },
      });

      router.push(`/profile/marketing/campaigns/${campaign.id}`);
    } catch (error) {
      console.error('Failed to create campaign:', error);
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Select a marketing activity</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-1 px-6 py-3 border-b border-gray-200">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                px-4 py-2 text-sm rounded-lg transition-colors
                ${activeCategory === cat.id
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Activity Types */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="space-y-2">
            {filteredTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleSelect(type)}
                disabled={creating}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors text-left disabled:opacity-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-xl">
                    {type.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{type.name}</span>
                      {type.recommended && (
                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">Recommended</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">
            Increase sessions, engage shoppers, and promote products by adding more marketing apps.
          </p>
        </div>
      </div>
    </div>
  );
}
