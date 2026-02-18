# Messaging & Email System Plan

> **Priority**: Campaign Creation - Build after dashboard
> **Dependencies**: `1-marketing-infrastructure.md`, `2-marketing-dashboard.md`
> **Estimated Scope**: Email builder, templates, campaign management, subscriber targeting

---

## Overview

The Messaging system enables professionals to create, manage, and send email campaigns to their subscribers. It includes a visual email builder, template system, recipient targeting, and campaign lifecycle management.

---

## 1. Route Structure

```
app/profile/marketing/campaigns/
├── page.tsx                    # Campaign list
├── new/
│   └── page.tsx               # Create new campaign (type selector)
└── [id]/
    ├── page.tsx               # Campaign editor
    └── preview/
        └── page.tsx           # Full preview mode
```

### File: `app/profile/marketing/campaigns/page.tsx`

```typescript
import { redirect } from 'next/navigation';
import { getAuthenticatedAppForUser } from '@/lib/auth/serverAuth';
import { CampaignList } from '@/lib/pages/profile/components/marketing/campaigns';

export default async function CampaignsPage() {
  const { currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser) {
    redirect('/login?redirect=/profile/marketing/campaigns');
  }

  return <CampaignList />;
}
```

### File: `app/profile/marketing/campaigns/[id]/page.tsx`

```typescript
import { redirect, notFound } from 'next/navigation';
import { getAuthenticatedAppForUser } from '@/lib/auth/serverAuth';
import { CampaignEditor } from '@/lib/pages/profile/components/marketing/campaigns';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CampaignEditorPage({ params }: Props) {
  const { id } = await params;
  const { currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser) {
    redirect('/login?redirect=/profile/marketing/campaigns/' + id);
  }

  return <CampaignEditor campaignId={id} />;
}
```

---

## 2. Campaign List Page

### File: `lib/pages/profile/components/marketing/campaigns/CampaignList.tsx`

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBrand } from '@/lib/hooks/useBrand';
import { useCampaigns } from '@/lib/features/crm/marketing/hooks';
import { Campaign, CampaignType } from '@/lib/features/crm/marketing/types';
import { StatusBadge } from '../shared/StatusBadge';
import { DateRangePicker } from '../dashboard/DateRangePicker';
import { CreateCampaignModal } from './CreateCampaignModal';
import { CampaignStatsHeader } from './CampaignStatsHeader';
import { formatDate } from '@/lib/utils/format';

type TabFilter = 'all' | 'email' | 'sms';

export function CampaignList() {
  const { brand } = useBrand();
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '', preset: 'last_30_days' });

  const { campaigns, loading } = useCampaigns(brand?.id || '');

  const filteredCampaigns = campaigns.filter(c => {
    if (activeTab === 'all') return true;
    return c.type === activeTab;
  });

  if (!brand) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Messaging</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {/* Open automation creator */}}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Create automation
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Create campaign
          </button>
        </div>
      </div>

      {/* Stats Header */}
      <CampaignStatsHeader brandId={brand.id} dateRange={dateRange} />

      {/* Recommendations Section */}
      <RecommendationsSection />

      {/* Tabs & Filters */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex space-x-6">
          {(['all', 'email', 'sms'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                pb-3 text-sm font-medium border-b-2 -mb-px
                ${activeTab === tab
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }
              `}
            >
              {tab === 'all' ? 'All' : tab.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="search"
            placeholder="Search campaigns..."
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg w-64"
          />
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Campaign Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Channel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Delivery rate</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Open rate</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Click rate</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sales</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4" colSpan={9}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : filteredCampaigns.length === 0 ? (
              <tr>
                <td className="px-6 py-12 text-center text-gray-500" colSpan={9}>
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="font-medium text-gray-900 mb-1">No campaigns yet</p>
                    <p className="text-sm">Create your first campaign to start reaching customers</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-4 px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                    >
                      Create campaign
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCampaigns.map((campaign) => (
                <CampaignRow key={campaign.id} campaign={campaign} brandId={brand.id} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <CreateCampaignModal
          brandId={brand.id}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}

function CampaignRow({ campaign, brandId }: { campaign: Campaign; brandId: string }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <Link
          href={`/profile/marketing/campaigns/${campaign.id}`}
          className="flex items-center space-x-3"
        >
          {/* Email thumbnail preview */}
          <div className="w-10 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-400">
            ✉️
          </div>
          <div>
            <div className="font-medium text-gray-900 hover:text-pink-600">{campaign.subject || campaign.name}</div>
            {campaign.status === 'draft' && (
              <div className="text-xs text-gray-500">Draft</div>
            )}
          </div>
        </Link>
      </td>
      <td className="px-6 py-4 text-gray-500 capitalize">{campaign.type}</td>
      <td className="px-6 py-4">
        <StatusBadge status={campaign.status} />
      </td>
      <td className="px-6 py-4 text-gray-500">
        {campaign.scheduledAt ? formatDate(campaign.scheduledAt) : '—'}
      </td>
      <td className="px-6 py-4 text-right text-gray-900">
        {campaign.metrics.deliveryRate > 0 ? `${campaign.metrics.deliveryRate}%` : '—'}
      </td>
      <td className="px-6 py-4 text-right text-gray-900">
        {campaign.metrics.openRate > 0 ? `${campaign.metrics.openRate}%` : '—'}
      </td>
      <td className="px-6 py-4 text-right text-gray-900">
        {campaign.metrics.clickRate > 0 ? `${campaign.metrics.clickRate}%` : '—'}
      </td>
      <td className="px-6 py-4 text-right text-gray-900">
        {campaign.metrics.revenue > 0 ? `$${campaign.metrics.revenue}` : '—'}
      </td>
      <td className="px-6 py-4">
        <button className="p-1 hover:bg-gray-100 rounded">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </td>
    </tr>
  );
}
```

### Recommendations Section

```typescript
function RecommendationsSection() {
  const recommendations = [
    {
      id: 'sms',
      title: 'SMS is now available',
      description: 'Pair SMS with email for bigger reach and better ROI',
      action: 'Create SMS',
      isNew: true,
    },
    {
      id: 'tos',
      title: 'Update your Terms of Service with SMS',
      description: 'Include SMS as a marketing channel in your Terms of Service',
      action: 'Update Terms of Service',
    },
    {
      id: 'consent',
      title: 'Capture marketing consent without friction',
      description: 'One-tap consent for SMS, built into checkout',
      action: 'Customize checkout',
    },
    {
      id: 'forms',
      title: 'Expand your audience with email and SMS',
      description: 'Use Shopify Forms to capture SMS and email opt-ins with pop-ups and drive repeat engagement',
      action: 'Install Shopify Forms',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <button className="text-sm font-medium text-pink-600">Recommendations</button>
        <button className="text-sm text-gray-500 hover:text-gray-700">Planner</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="h-24 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg mb-3 flex items-center justify-center">
              {/* Placeholder illustration */}
              <div className="w-16 h-16 bg-white/50 rounded-lg" />
            </div>
            <div className="flex items-start space-x-2 mb-2">
              <h3 className="font-medium text-gray-900 text-sm">{rec.title}</h3>
              {rec.isNew && (
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">New</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-3">{rec.description}</p>
            <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">
              {rec.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 3. Create Campaign Modal

### File: `lib/pages/profile/components/marketing/campaigns/CreateCampaignModal.tsx`

```typescript
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
        brandId,
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
                px-4 py-2 text-sm rounded-lg
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
```

---

## 4. Email Editor

### File: `lib/pages/profile/components/marketing/campaigns/CampaignEditor.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBrand } from '@/lib/hooks/useBrand';
import { useCampaign } from '@/lib/features/crm/marketing/hooks';
import { Campaign, EmailSection } from '@/lib/features/crm/marketing/types';
import { EmailBuilder } from './EmailBuilder';
import { EmailPreview } from './EmailBuilder/EmailPreview';
import { CampaignSidebar } from './CampaignSidebar';

interface CampaignEditorProps {
  campaignId: string;
}

export function CampaignEditor({ campaignId }: CampaignEditorProps) {
  const router = useRouter();
  const { brand } = useBrand();
  const { campaign, loading, updateCampaign, saveCampaign } = useCampaign(brand?.id || '', campaignId);

  const [localCampaign, setLocalCampaign] = useState<Campaign | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (campaign) {
      setLocalCampaign(campaign);
    }
  }, [campaign]);

  const handleChange = (updates: Partial<Campaign>) => {
    if (!localCampaign) return;
    setLocalCampaign({ ...localCampaign, ...updates });
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!localCampaign) return;
    await saveCampaign(localCampaign);
    setHasUnsavedChanges(false);
  };

  const handleSendTest = async () => {
    // TODO: Implement send test email
    alert('Send test email - not implemented');
  };

  const handleReview = () => {
    // TODO: Navigate to review/schedule page
  };

  if (loading || !localCampaign || !brand) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
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
                  value={localCampaign.subject || localCampaign.name}
                  onChange={(e) => handleChange({ subject: e.target.value })}
                  className="font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-pink-500 rounded px-1 -ml-1"
                />
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                  {localCampaign.status}
                </span>
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
      <div className="flex">
        {/* Left Sidebar - Settings */}
        <CampaignSidebar
          campaign={localCampaign}
          onChange={handleChange}
        />

        {/* Center - Email Preview */}
        <div className="flex-1 p-8">
          <EmailPreview
            campaign={localCampaign}
            selectedSectionId={selectedSectionId}
            onSelectSection={setSelectedSectionId}
          />
        </div>

        {/* Right - Section Editor (when section selected) */}
        {selectedSectionId && (
          <EmailBuilder
            campaign={localCampaign}
            selectedSectionId={selectedSectionId}
            onChange={handleChange}
            onClose={() => setSelectedSectionId(null)}
          />
        )}
      </div>

      {/* Add Section Button */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          onClick={() => {/* Add new section */}}
          className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg shadow-lg hover:bg-pink-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add section</span>
        </button>
      </div>
    </div>
  );
}
```

### Campaign Sidebar (Email Details)

```typescript
// lib/pages/profile/components/marketing/campaigns/CampaignSidebar.tsx

'use client';

import { Campaign } from '@/lib/features/crm/marketing/types';

interface CampaignSidebarProps {
  campaign: Campaign;
  onChange: (updates: Partial<Campaign>) => void;
}

export function CampaignSidebar({ campaign, onChange }: CampaignSidebarProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-64px)]">
      {/* Email Colors Section */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Email colors</h3>
        <div className="space-y-4">
          <ColorPicker
            label="Content background"
            value={campaign.content.colors?.contentBackground || '#ffffff'}
            onChange={(color) => onChange({
              content: {
                ...campaign.content,
                colors: { ...campaign.content.colors, contentBackground: color }
              }
            })}
          />
          <ColorPicker
            label="Border"
            value={campaign.content.colors?.border || '#dbdbdb'}
            onChange={(color) => onChange({
              content: {
                ...campaign.content,
                colors: { ...campaign.content.colors, border: color }
              }
            })}
          />
        </div>
      </div>

      {/* Email Details Section */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Email details</h3>
        <div className="space-y-4">
          {/* To */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">To:</label>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full flex items-center">
                All subscribers
                <button className="ml-1 text-gray-400 hover:text-gray-600">×</button>
              </span>
              <span className="text-sm text-gray-500">
                Subscriber count: {campaign.recipientCount}
              </span>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Subject:</label>
            <input
              type="text"
              value={campaign.subject || ''}
              onChange={(e) => onChange({ subject: e.target.value })}
              placeholder="Enter email subject..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Preview text */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Preview text:</label>
            <input
              type="text"
              value={campaign.previewText || ''}
              onChange={(e) => onChange({ previewText: e.target.value })}
              placeholder="Enter preview text..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* From */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">From:</label>
            <input
              type="text"
              value={campaign.content.fromName || ''}
              onChange={(e) => onChange({
                content: { ...campaign.content, fromName: e.target.value }
              })}
              placeholder="Brand name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <input
              type="email"
              value={campaign.content.fromEmail || ''}
              onChange={(e) => onChange({
                content: { ...campaign.content, fromEmail: e.target.value }
              })}
              placeholder="email@example.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center space-x-3">
      <div
        className="w-8 h-8 rounded-full border border-gray-200 cursor-pointer"
        style={{ backgroundColor: value }}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'color';
          input.value = value;
          input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
          input.click();
        }}
      />
      <div>
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-500 uppercase">{value}</div>
      </div>
    </div>
  );
}
```

---

## 5. Email Builder Components

### File: `lib/pages/profile/components/marketing/campaigns/EmailBuilder/EmailBuilder.tsx`

```typescript
'use client';

import { Campaign, EmailSection } from '@/lib/features/crm/marketing/types';
import { SectionEditor } from './SectionEditor';

interface EmailBuilderProps {
  campaign: Campaign;
  selectedSectionId: string;
  onChange: (updates: Partial<Campaign>) => void;
  onClose: () => void;
}

export function EmailBuilder({ campaign, selectedSectionId, onChange, onClose }: EmailBuilderProps) {
  const selectedSection = campaign.content.sections?.find(s => s.id === selectedSectionId);

  if (!selectedSection) return null;

  const handleSectionUpdate = (updates: Partial<EmailSection>) => {
    const updatedSections = campaign.content.sections?.map(s =>
      s.id === selectedSectionId ? { ...s, ...updates } : s
    );
    onChange({
      content: { ...campaign.content, sections: updatedSections }
    });
  };

  const handleDelete = () => {
    const updatedSections = campaign.content.sections?.filter(s => s.id !== selectedSectionId);
    onChange({
      content: { ...campaign.content, sections: updatedSections }
    });
    onClose();
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto max-h-[calc(100vh-64px)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-gray-900 capitalize">{selectedSection.type}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <SectionEditor
        section={selectedSection}
        onChange={handleSectionUpdate}
      />
    </div>
  );
}
```

### File: `lib/pages/profile/components/marketing/campaigns/EmailBuilder/SectionEditor.tsx`

```typescript
'use client';

import { EmailSection } from '@/lib/features/crm/marketing/types';

interface SectionEditorProps {
  section: EmailSection;
  onChange: (updates: Partial<EmailSection>) => void;
}

export function SectionEditor({ section, onChange }: SectionEditorProps) {
  const handleContentChange = (key: string, value: any) => {
    onChange({
      content: { ...section.content, [key]: value }
    });
  };

  switch (section.type) {
    case 'header':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Header Text</label>
            <input
              type="text"
              value={section.content.text || ''}
              onChange={(e) => handleContentChange('text', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <input
              type="url"
              value={section.content.logoUrl || ''}
              onChange={(e) => handleContentChange('logoUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={section.content.text || ''}
              onChange={(e) => handleContentChange('text', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
            <select
              value={section.content.align || 'left'}
              onChange={(e) => handleContentChange('align', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              value={section.content.src || ''}
              onChange={(e) => handleContentChange('src', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
            <input
              type="text"
              value={section.content.alt || ''}
              onChange={(e) => handleContentChange('alt', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
            <input
              type="url"
              value={section.content.href || ''}
              onChange={(e) => handleContentChange('href', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>
      );

    case 'button':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              value={section.content.text || ''}
              onChange={(e) => handleContentChange('text', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
            <input
              type="url"
              value={section.content.href || ''}
              onChange={(e) => handleContentChange('href', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <input
              type="color"
              value={section.content.backgroundColor || '#ec4899'}
              onChange={(e) => handleContentChange('backgroundColor', e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-200"
            />
          </div>
        </div>
      );

    case 'footer':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              value={section.content.companyName || ''}
              onChange={(e) => handleContentChange('companyName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={section.content.address || ''}
              onChange={(e) => handleContentChange('address', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showUnsubscribe"
              checked={section.content.showUnsubscribe !== false}
              onChange={(e) => handleContentChange('showUnsubscribe', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="showUnsubscribe" className="text-sm text-gray-700">
              Show unsubscribe link
            </label>
          </div>
        </div>
      );

    default:
      return <div className="text-gray-500">No editor available for this section type</div>;
  }
}
```

---

## 6. Email Preview

### File: `lib/pages/profile/components/marketing/campaigns/EmailBuilder/EmailPreview.tsx`

```typescript
'use client';

import { Campaign, EmailSection } from '@/lib/features/crm/marketing/types';

interface EmailPreviewProps {
  campaign: Campaign;
  selectedSectionId: string | null;
  onSelectSection: (id: string) => void;
}

export function EmailPreview({ campaign, selectedSectionId, onSelectSection }: EmailPreviewProps) {
  const { content } = campaign;
  const colors = content.colors || {};

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
        {content.sections?.map((section) => (
          <div
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            className={`
              relative cursor-pointer transition-all
              ${selectedSectionId === section.id
                ? 'ring-2 ring-pink-500 ring-offset-2'
                : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
              }
            `}
          >
            {/* Section type label */}
            {selectedSectionId === section.id && (
              <div className="absolute -top-3 left-2 px-2 py-0.5 bg-pink-500 text-white text-xs rounded">
                {section.type}
              </div>
            )}

            <SectionPreview section={section} colors={colors} />
          </div>
        ))}

        {(!content.sections || content.sections.length === 0) && (
          <div className="py-12 text-center text-gray-400">
            <p>Click "Add section" to start building your email</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionPreview({ section, colors }: { section: EmailSection; colors: any }) {
  switch (section.type) {
    case 'header':
      return (
        <div className="py-4 text-center border-b" style={{ borderColor: colors.border }}>
          {section.content.logoUrl ? (
            <img src={section.content.logoUrl} alt="Logo" className="h-8 mx-auto" />
          ) : (
            <h1 className="text-xl font-semibold" style={{ color: colors.text }}>
              {section.content.text || 'Your Brand'}
            </h1>
          )}
        </div>
      );

    case 'text':
      return (
        <div
          className="py-4"
          style={{ textAlign: section.content.align || 'left', color: colors.text }}
        >
          {section.content.text || 'Enter your text here...'}
        </div>
      );

    case 'image':
      return (
        <div className="py-4">
          {section.content.src ? (
            <img
              src={section.content.src}
              alt={section.content.alt || ''}
              className="max-w-full mx-auto rounded"
            />
          ) : (
            <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              Add an image
            </div>
          )}
        </div>
      );

    case 'button':
      return (
        <div className="py-4 text-center">
          <a
            href={section.content.href || '#'}
            className="inline-block px-6 py-3 rounded-lg font-medium text-white"
            style={{ backgroundColor: section.content.backgroundColor || '#ec4899' }}
          >
            {section.content.text || 'Click here'}
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
        <div className="py-4 text-center text-sm text-gray-500">
          <p>{section.content.companyName}</p>
          <p className="whitespace-pre-line">{section.content.address}</p>
          {section.content.showUnsubscribe !== false && (
            <a href="#" className="underline mt-2 inline-block" style={{ color: colors.link }}>
              Unsubscribe
            </a>
          )}
          <p className="mt-2">&copy; {new Date().getFullYear()} {section.content.companyName}</p>
        </div>
      );

    default:
      return <div className="py-4 text-gray-400">Unknown section type</div>;
  }
}
```

---

## 7. File Structure Summary

```
app/profile/marketing/campaigns/
├── page.tsx
├── new/
│   └── page.tsx
└── [id]/
    ├── page.tsx
    └── preview/
        └── page.tsx

lib/pages/profile/components/marketing/campaigns/
├── index.ts
├── CampaignList.tsx
├── CampaignEditor.tsx
├── CampaignSidebar.tsx
├── CreateCampaignModal.tsx
├── CampaignStatsHeader.tsx
└── EmailBuilder/
    ├── index.ts
    ├── EmailBuilder.tsx
    ├── SectionEditor.tsx
    ├── EmailPreview.tsx
    └── AddSectionMenu.tsx

lib/features/crm/marketing/hooks/
├── useCampaign.ts              # Single campaign operations
├── useCampaigns.ts             # Campaign list operations
└── useSubscribers.ts           # Subscriber management
```

---

## 8. Implementation Checklist

- [ ] Create campaign list page with filtering
- [ ] Build campaign stats header component
- [ ] Create campaign type selection modal
- [ ] Implement email editor container
- [ ] Build campaign sidebar (colors, details)
- [ ] Implement email preview component
- [ ] Build section editors for each type:
  - [ ] Header section
  - [ ] Text section
  - [ ] Image section
  - [ ] Button section
  - [ ] Divider section
  - [ ] Footer section
  - [ ] Product section (future)
- [ ] Add drag-and-drop section reordering
- [ ] Implement send test functionality
- [ ] Build review/schedule flow
- [ ] Add autosave functionality
- [ ] Create recipient targeting UI
- [ ] Add campaign duplication feature
- [ ] Implement campaign deletion with confirmation

---

## 9. Future Enhancements

- SMS campaign builder
- Email templates library
- A/B testing support
- Advanced segmentation builder
- Scheduled send with timezone support
- Campaign analytics deep dive
- Product block with dynamic data
- Personalization tokens ({{first_name}}, etc.)
