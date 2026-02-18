# Marketing Automations Plan

> **Priority**: Workflows - Build last (most complex)
> **Dependencies**: All previous marketing plans
> **Estimated Scope**: Automation templates, visual workflow builder, trigger system

---

## Overview

The Marketing Automations system enables professionals to create automated marketing workflows that trigger based on customer behavior. It includes a template gallery, visual workflow builder, and performance tracking for each automation.

---

## 1. Route Structure

```
app/profile/marketing/automations/
├── page.tsx                    # Automations list & overview
├── new/
│   └── page.tsx               # Create from template or blank
├── templates/
│   └── page.tsx               # Template gallery
└── [id]/
    ├── page.tsx               # Automation editor
    └── analytics/
        └── page.tsx           # Automation performance
```

### File: `app/profile/marketing/automations/page.tsx`

```typescript
import { redirect } from 'next/navigation';
import { getAuthenticatedAppForUser } from '@/lib/auth/serverAuth';
import { AutomationsDashboard } from '@/lib/pages/profile/components/marketing/automations';

export default async function AutomationsPage() {
  const { currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser) {
    redirect('/login?redirect=/profile/marketing/automations');
  }

  return <AutomationsDashboard />;
}
```

### File: `app/profile/marketing/automations/templates/page.tsx`

```typescript
import { redirect } from 'next/navigation';
import { getAuthenticatedAppForUser } from '@/lib/auth/serverAuth';
import { TemplateGallery } from '@/lib/pages/profile/components/marketing/automations';

export default async function TemplatesPage() {
  const { currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser) {
    redirect('/login?redirect=/profile/marketing/automations/templates');
  }

  return <TemplateGallery />;
}
```

---

## 2. Automations Dashboard

### File: `lib/pages/profile/components/marketing/automations/AutomationsDashboard.tsx`

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBrand } from '@/lib/hooks/useBrand';
import { useAutomations } from '@/lib/features/crm/marketing/hooks';
import { Automation } from '@/lib/features/crm/marketing/types';
import { DateRangePicker } from '../dashboard/DateRangePicker';
import { AutomationStatsCards } from './AutomationStatsCards';
import { AutomationsList } from './AutomationsList';
import { EssentialTemplates } from './EssentialTemplates';
import { getDateRange } from '@/lib/features/crm/marketing/utils';

export function AutomationsDashboard() {
  const { brand } = useBrand();
  const [dateRange, setDateRange] = useState(() => getDateRange('last_30_days'));
  const [comparisonRange, setComparisonRange] = useState(() => getDateRange('previous_30_days'));

  const { automations, loading } = useAutomations(brand?.id || '');

  if (!brand) return null;

  const activeAutomations = automations.filter(a => a.status === 'active');
  const inactiveAutomations = automations.filter(a => a.status === 'inactive');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Automations</h1>
        <Link
          href="/profile/marketing/automations/templates"
          className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700"
        >
          View templates
        </Link>
      </div>

      {/* Date Range Selectors */}
      <div className="flex items-center space-x-3">
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
        />
        <DateRangePicker
          value={comparisonRange}
          onChange={setComparisonRange}
        />
      </div>

      {/* Stats Overview */}
      <AutomationStatsCards
        brandId={brand.id}
        dateRange={dateRange}
        comparisonRange={comparisonRange}
      />

      {/* Automations List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button className="text-sm font-medium text-pink-600">All</button>
          </div>
        </div>

        <AutomationsList
          automations={automations}
          loading={loading}
        />
      </div>

      {/* Shopify Flow Integration */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Manage automations in Flow</h3>
            <p className="text-sm text-gray-500 mt-1">
              View, edit, import, export, and duplicate automations by installing Flow.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-medium text-gray-900">Glamlink Flow</span>
            <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
              Install
            </button>
          </div>
        </div>
      </div>

      {/* Essential Templates */}
      <EssentialTemplates brandId={brand.id} />

      {/* Footer Link */}
      <div className="text-center">
        <a href="#" className="text-sm text-pink-600 hover:underline">
          Learn more about automations
        </a>
      </div>
    </div>
  );
}
```

---

## 3. Automations Stats Cards

### File: `lib/pages/profile/components/marketing/automations/AutomationStatsCards.tsx`

```typescript
'use client';

import { useAutomationStats } from '@/lib/features/crm/marketing/hooks';
import { MetricCard } from '../shared/MetricCard';

interface AutomationStatsCardsProps {
  brandId: string;
  dateRange: { start: string; end: string };
  comparisonRange?: { start: string; end: string };
}

export function AutomationStatsCards({ brandId, dateRange, comparisonRange }: AutomationStatsCardsProps) {
  const { stats, loading } = useAutomationStats({
    brandId,
    startDate: dateRange.start,
    endDate: dateRange.end,
  });

  const metrics = [
    { label: 'Reach', value: stats?.reach || 0, format: 'number' as const },
    { label: 'Sessions', value: stats?.sessions || 0, format: 'number' as const },
    { label: 'Orders', value: stats?.orders || 0, format: 'number' as const },
    { label: 'Conversion rate', value: stats?.conversionRate || 0, format: 'percent' as const },
    { label: 'Sales', value: stats?.sales || 0, format: 'currency' as const },
    { label: 'Average order value', value: stats?.averageOrderValue || 0, format: 'currency' as const },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          format={metric.format}
          loading={loading}
        />
      ))}
    </div>
  );
}
```

---

## 4. Automations List

### File: `lib/pages/profile/components/marketing/automations/AutomationsList.tsx`

```typescript
'use client';

import Link from 'next/link';
import { Automation } from '@/lib/features/crm/marketing/types';
import { StatusBadge } from '../shared/StatusBadge';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/utils/format';

interface AutomationsListProps {
  automations: Automation[];
  loading: boolean;
}

export function AutomationsList({ automations, loading }: AutomationsListProps) {
  if (loading) {
    return (
      <div className="p-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded animate-pulse mb-2" />
        ))}
      </div>
    );
  }

  if (automations.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500">
        <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <p className="font-medium text-gray-900">No automations yet</p>
        <p className="text-sm mt-1">Create your first automation from a template</p>
        <Link
          href="/profile/marketing/automations/templates"
          className="inline-block mt-4 px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700"
        >
          Browse templates
        </Link>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marketing automation</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Reach</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sessions</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Orders</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Conversion rate</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sales</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Average order value</th>
          <th className="px-6 py-3"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {automations.map((automation) => (
          <tr key={automation.id} className="hover:bg-gray-50">
            <td className="px-6 py-4">
              <Link
                href={`/profile/marketing/automations/${automation.id}`}
                className="font-medium text-gray-900 hover:text-pink-600"
              >
                {automation.name}
              </Link>
            </td>
            <td className="px-6 py-4">
              <StatusBadge status={automation.status} />
            </td>
            <td className="px-6 py-4 text-right text-gray-900">
              {formatNumber(automation.metrics.triggered)}
            </td>
            <td className="px-6 py-4 text-right text-gray-900">
              {formatNumber(automation.metrics.emailsOpened)}
            </td>
            <td className="px-6 py-4 text-right text-gray-900">
              {formatNumber(automation.metrics.conversions)}
            </td>
            <td className="px-6 py-4 text-right text-gray-900">
              {automation.metrics.triggered > 0
                ? formatPercent((automation.metrics.conversions / automation.metrics.triggered) * 100)
                : '—'
              }
            </td>
            <td className="px-6 py-4 text-right text-gray-900">
              {formatCurrency(automation.metrics.revenue)}
            </td>
            <td className="px-6 py-4 text-right text-gray-900">
              {automation.metrics.conversions > 0
                ? formatCurrency(automation.metrics.revenue / automation.metrics.conversions)
                : '—'
              }
            </td>
            <td className="px-6 py-4">
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## 5. Essential Templates Section

### File: `lib/pages/profile/components/marketing/automations/EssentialTemplates.tsx`

```typescript
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
    description: 'Send an email 10 hours after a customer gets to checkout but doesn\'t place an order to recover lost sales.',
    icon: '🛒',
  },
  {
    id: 'recover_abandoned_cart',
    name: 'Recover abandoned cart',
    description: 'Convert motivated customers who have added products to their cart but haven\'t proceeded to checkout.',
    icon: '🛍️',
  },
  {
    id: 'convert_abandoned_browse',
    name: 'Convert abandoned product browse',
    description: 'Send a marketing email to customers who viewed a product but didn\'t add it to their cart.',
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
  const implementedTemplates = new Set(
    automations.map(a => a.templateId).filter(Boolean)
  );

  const completedCount = ESSENTIAL_TEMPLATES.filter(
    t => implementedTemplates.has(t.id)
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
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                isCompleted ? 'bg-green-500' : 'border-2 border-gray-300'
              }`}>
                {isCompleted && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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
```

---

## 6. Template Gallery

### File: `lib/pages/profile/components/marketing/automations/TemplateGallery.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBrand } from '@/lib/hooks/useBrand';
import { useAutomationTemplates } from '@/lib/features/crm/marketing/hooks';
import { AutomationTemplate } from '@/lib/features/crm/marketing/types';
import { TemplatePreviewModal } from './TemplatePreviewModal';

export function TemplateGallery() {
  const router = useRouter();
  const { brand } = useBrand();
  const [searchQuery, setSearchQuery] = useState('');
  const [requiredAppsFilter, setRequiredAppsFilter] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const { templates, loading } = useAutomationTemplates();

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesApp = requiredAppsFilter === 'all' ||
      t.requiredApps.includes(requiredAppsFilter);
    return matchesSearch && matchesApp;
  });

  // Group templates by category
  const templatesByCategory = filteredTemplates.reduce((acc, template) => {
    const category = template.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(template);
    return acc;
  }, {} as Record<string, AutomationTemplate[]>);

  if (!brand) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Automation templates</h1>
        <button
          onClick={() => router.push('/profile/marketing/automations/new')}
          className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700"
        >
          Create custom automation
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Searching all templates"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
          />
        </div>

        <select
          value={requiredAppsFilter}
          onChange={(e) => setRequiredAppsFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
        >
          <option value="all">Required apps</option>
          <option value="messaging">Messaging</option>
          <option value="flow">Flow</option>
        </select>

        <select className="px-3 py-2 border border-gray-200 rounded-lg bg-white">
          <option value="all">App status</option>
          <option value="installed">Installed</option>
          <option value="not_installed">Not installed</option>
        </select>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onClick={() => setSelectedTemplate(template.id)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No templates found matching your search</p>
        </div>
      )}

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <TemplatePreviewModal
          templateId={selectedTemplate}
          brandId={brand.id}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </div>
  );
}

interface TemplateCardProps {
  template: AutomationTemplate;
  onClick: () => void;
}

function TemplateCard({ template, onClick }: TemplateCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
    >
      <h3 className="font-medium text-gray-900 mb-2">{template.name}</h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{template.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Created by {template.createdBy === 'system' ? 'Glamlink' : 'You'}
        </span>

        {template.requiredApps.length > 0 && (
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">Required app</span>
            <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 7. Template Preview Modal

### File: `lib/pages/profile/components/marketing/automations/TemplatePreviewModal.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAutomationTemplate, useAutomations } from '@/lib/features/crm/marketing/hooks';
import { WorkflowPreview } from './WorkflowBuilder/WorkflowPreview';

interface TemplatePreviewModalProps {
  templateId: string;
  brandId: string;
  onClose: () => void;
}

export function TemplatePreviewModal({ templateId, brandId, onClose }: TemplatePreviewModalProps) {
  const router = useRouter();
  const { template, loading } = useAutomationTemplate(templateId);
  const { createAutomation } = useAutomations(brandId);
  const [creating, setCreating] = useState(false);

  const handleTurnOn = async () => {
    if (!template) return;

    setCreating(true);
    try {
      const automation = await createAutomation({
        name: template.name,
        description: template.description,
        status: 'active',
        brandId,
        templateId: template.id,
        trigger: template.trigger,
        conditions: template.conditions,
        actions: template.actions,
        metrics: {
          triggered: 0,
          completed: 0,
          inProgress: 0,
          failed: 0,
          emailsSent: 0,
          emailsOpened: 0,
          emailsClicked: 0,
          conversions: 0,
          revenue: 0,
        },
      });

      router.push(`/profile/marketing/automations/${automation.id}`);
    } catch (error) {
      console.error('Failed to create automation:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async () => {
    if (!template) return;

    setCreating(true);
    try {
      const automation = await createAutomation({
        name: template.name,
        description: template.description,
        status: 'draft',
        brandId,
        templateId: template.id,
        trigger: template.trigger,
        conditions: template.conditions,
        actions: template.actions,
        metrics: {
          triggered: 0,
          completed: 0,
          inProgress: 0,
          failed: 0,
          emailsSent: 0,
          emailsOpened: 0,
          emailsClicked: 0,
          conversions: 0,
          revenue: 0,
        },
      });

      router.push(`/profile/marketing/automations/${automation.id}`);
    } catch (error) {
      console.error('Failed to create automation:', error);
    } finally {
      setCreating(false);
    }
  };

  if (loading || !template) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{template.name}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Workflow Preview */}
        <div className="p-6 bg-gray-50">
          <WorkflowPreview
            trigger={template.trigger}
            conditions={template.conditions}
            actions={template.actions}
          />
        </div>

        {/* About Section */}
        <div className="px-6 py-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">About this template</h3>
          <p className="text-sm text-gray-500">{template.description}</p>

          {/* Required Apps */}
          {template.requiredApps.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Required apps</h4>
              <div className="flex items-center space-x-2">
                {template.requiredApps.map((app) => (
                  <div
                    key={app}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700 capitalize">{app}</span>
                    <button className="text-xs text-pink-600 hover:underline">Open</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-500">
            Created by {template.createdBy === 'system' ? 'Glamlink' : 'You'}
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleEdit}
              disabled={creating}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50"
            >
              Edit
            </button>
            <button
              onClick={handleTurnOn}
              disabled={creating}
              className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Turn on automation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 8. Visual Workflow Builder

### File: `lib/pages/profile/components/marketing/automations/WorkflowBuilder/WorkflowBuilder.tsx`

```typescript
'use client';

import { useState, useCallback } from 'react';
import {
  Automation,
  AutomationTrigger,
  AutomationCondition,
  AutomationAction
} from '@/lib/features/crm/marketing/types';
import { TriggerNode } from './TriggerNode';
import { ConditionNode } from './ConditionNode';
import { ActionNode } from './ActionNode';
import { AddNodeButton } from './AddNodeButton';

interface WorkflowBuilderProps {
  automation: Automation;
  onChange: (updates: Partial<Automation>) => void;
  readOnly?: boolean;
}

export function WorkflowBuilder({ automation, onChange, readOnly = false }: WorkflowBuilderProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleTriggerChange = (trigger: AutomationTrigger) => {
    onChange({ trigger });
  };

  const handleConditionChange = (conditionId: string, updates: Partial<AutomationCondition>) => {
    const updatedConditions = automation.conditions.map(c =>
      c.id === conditionId ? { ...c, ...updates } : c
    );
    onChange({ conditions: updatedConditions });
  };

  const handleActionChange = (actionId: string, updates: Partial<AutomationAction>) => {
    const updatedActions = automation.actions.map(a =>
      a.id === actionId ? { ...a, ...updates } : a
    );
    onChange({ actions: updatedActions });
  };

  const handleAddCondition = () => {
    const newCondition: AutomationCondition = {
      id: `condition_${Date.now()}`,
      field: '',
      operator: 'equals',
      value: '',
    };
    onChange({ conditions: [...automation.conditions, newCondition] });
  };

  const handleAddAction = (type: AutomationAction['type']) => {
    const newAction: AutomationAction = {
      id: `action_${Date.now()}`,
      type,
      config: getDefaultActionConfig(type),
    };
    onChange({ actions: [...automation.actions, newAction] });
  };

  const handleDeleteCondition = (conditionId: string) => {
    onChange({ conditions: automation.conditions.filter(c => c.id !== conditionId) });
  };

  const handleDeleteAction = (actionId: string) => {
    onChange({ actions: automation.actions.filter(a => a.id !== actionId) });
  };

  return (
    <div className="workflow-builder p-8 bg-gray-50 rounded-xl min-h-[400px]">
      {/* Workflow Canvas */}
      <div className="flex flex-col items-center space-y-4">
        {/* Trigger Node */}
        <TriggerNode
          trigger={automation.trigger}
          onChange={handleTriggerChange}
          readOnly={readOnly}
          isSelected={selectedNodeId === 'trigger'}
          onSelect={() => setSelectedNodeId('trigger')}
        />

        {/* Connector Line */}
        <div className="w-0.5 h-8 bg-gray-300" />

        {/* Conditions */}
        {automation.conditions.map((condition, index) => (
          <div key={condition.id} className="flex flex-col items-center">
            <ConditionNode
              condition={condition}
              onChange={(updates) => handleConditionChange(condition.id, updates)}
              onDelete={() => handleDeleteCondition(condition.id)}
              readOnly={readOnly}
              isSelected={selectedNodeId === condition.id}
              onSelect={() => setSelectedNodeId(condition.id)}
            />
            <div className="w-0.5 h-8 bg-gray-300" />
          </div>
        ))}

        {/* Actions */}
        {automation.actions.map((action, index) => (
          <div key={action.id} className="flex flex-col items-center">
            <ActionNode
              action={action}
              onChange={(updates) => handleActionChange(action.id, updates)}
              onDelete={() => handleDeleteAction(action.id)}
              readOnly={readOnly}
              isSelected={selectedNodeId === action.id}
              onSelect={() => setSelectedNodeId(action.id)}
            />
            {index < automation.actions.length - 1 && (
              <div className="w-0.5 h-8 bg-gray-300" />
            )}
          </div>
        ))}

        {/* Add Node Buttons */}
        {!readOnly && (
          <div className="flex items-center space-x-4 pt-4">
            <AddNodeButton
              label="Add condition"
              onClick={handleAddCondition}
              icon="⚡"
            />
            <AddNodeButton
              label="Add action"
              onClick={() => handleAddAction('send_email')}
              icon="📧"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function getDefaultActionConfig(type: AutomationAction['type']): Record<string, any> {
  switch (type) {
    case 'wait':
      return { duration: 4, unit: 'hours' };
    case 'send_email':
      return { templateId: '', subject: '', content: '' };
    case 'send_sms':
      return { message: '' };
    case 'add_tag':
      return { tag: '' };
    case 'remove_tag':
      return { tag: '' };
    case 'webhook':
      return { url: '', method: 'POST' };
    default:
      return {};
  }
}
```

### File: `lib/pages/profile/components/marketing/automations/WorkflowBuilder/TriggerNode.tsx`

```typescript
'use client';

import { AutomationTrigger, AutomationTriggerType } from '@/lib/features/crm/marketing/types';

interface TriggerNodeProps {
  trigger: AutomationTrigger;
  onChange: (trigger: AutomationTrigger) => void;
  readOnly?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

const TRIGGER_TYPES: { type: AutomationTriggerType; label: string; description: string }[] = [
  {
    type: 'abandoned_checkout',
    label: 'Customer left online store without making a purchase',
    description: 'Triggers when a customer views products but doesn\'t complete checkout',
  },
  {
    type: 'abandoned_cart',
    label: 'Customer abandoned cart',
    description: 'Triggers when products are added to cart but not purchased',
  },
  {
    type: 'new_subscriber',
    label: 'New subscriber joined',
    description: 'Triggers when someone subscribes to your mailing list',
  },
  {
    type: 'post_purchase',
    label: 'Customer completed a purchase',
    description: 'Triggers after a successful order',
  },
  {
    type: 'customer_birthday',
    label: 'Customer birthday',
    description: 'Triggers on customer\'s birthday',
  },
];

export function TriggerNode({ trigger, onChange, readOnly, isSelected, onSelect }: TriggerNodeProps) {
  const triggerInfo = TRIGGER_TYPES.find(t => t.type === trigger.type);

  return (
    <div
      onClick={onSelect}
      className={`
        bg-white rounded-xl border-2 p-4 w-80 cursor-pointer transition-all
        ${isSelected ? 'border-pink-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 uppercase font-medium mb-1">Trigger</div>
          <div className="font-medium text-gray-900 text-sm">{triggerInfo?.label || trigger.type}</div>
          <p className="text-xs text-gray-500 mt-1">{triggerInfo?.description}</p>
        </div>
      </div>
    </div>
  );
}
```

### File: `lib/pages/profile/components/marketing/automations/WorkflowBuilder/ConditionNode.tsx`

```typescript
'use client';

import { AutomationCondition } from '@/lib/features/crm/marketing/types';

interface ConditionNodeProps {
  condition: AutomationCondition;
  onChange: (updates: Partial<AutomationCondition>) => void;
  onDelete: () => void;
  readOnly?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function ConditionNode({ condition, onChange, onDelete, readOnly, isSelected, onSelect }: ConditionNodeProps) {
  return (
    <div
      onClick={onSelect}
      className={`
        bg-white rounded-xl border-2 p-4 w-80 cursor-pointer transition-all
        ${isSelected ? 'border-pink-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 uppercase font-medium mb-1">Condition</div>
          <div className="font-medium text-gray-900 text-sm">
            {condition.field || 'Select condition'}
          </div>
          <div className="flex items-center space-x-4 mt-2 text-xs">
            <span className="flex items-center text-green-600">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              True
            </span>
            <span className="flex items-center text-red-600">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              False
            </span>
          </div>
        </div>
        {!readOnly && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 text-gray-400 hover:text-red-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
```

### File: `lib/pages/profile/components/marketing/automations/WorkflowBuilder/ActionNode.tsx`

```typescript
'use client';

import { AutomationAction } from '@/lib/features/crm/marketing/types';

interface ActionNodeProps {
  action: AutomationAction;
  onChange: (updates: Partial<AutomationAction>) => void;
  onDelete: () => void;
  readOnly?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

const ACTION_LABELS: Record<AutomationAction['type'], { label: string; icon: string; color: string }> = {
  wait: { label: 'Wait', icon: '⏱️', color: 'gray' },
  send_email: { label: 'Send email', icon: '📧', color: 'green' },
  send_sms: { label: 'Send SMS', icon: '📱', color: 'blue' },
  add_tag: { label: 'Add tag', icon: '🏷️', color: 'purple' },
  remove_tag: { label: 'Remove tag', icon: '🏷️', color: 'orange' },
  webhook: { label: 'Webhook', icon: '🔗', color: 'indigo' },
};

export function ActionNode({ action, onChange, onDelete, readOnly, isSelected, onSelect }: ActionNodeProps) {
  const actionInfo = ACTION_LABELS[action.type];
  const bgColor = `bg-${actionInfo.color}-100`;
  const textColor = `text-${actionInfo.color}-600`;

  const getActionDescription = () => {
    switch (action.type) {
      case 'wait':
        return `Wait for ${action.config.duration} ${action.config.unit}`;
      case 'send_email':
        return action.config.subject || 'Configure email';
      case 'send_sms':
        return action.config.message ? 'SMS configured' : 'Configure SMS';
      default:
        return 'Configure action';
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`
        bg-white rounded-xl border-2 p-4 w-80 cursor-pointer transition-all
        ${isSelected ? 'border-pink-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <span>{actionInfo.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 uppercase font-medium mb-1">Action</div>
          <div className="font-medium text-gray-900 text-sm">{actionInfo.label}</div>
          <p className="text-xs text-gray-500 mt-1">{getActionDescription()}</p>
        </div>
        {!readOnly && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 text-gray-400 hover:text-red-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
```

### File: `lib/pages/profile/components/marketing/automations/WorkflowBuilder/WorkflowPreview.tsx`

```typescript
'use client';

import {
  AutomationTrigger,
  AutomationCondition,
  AutomationAction
} from '@/lib/features/crm/marketing/types';
import { TriggerNode } from './TriggerNode';
import { ConditionNode } from './ConditionNode';
import { ActionNode } from './ActionNode';

interface WorkflowPreviewProps {
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
}

export function WorkflowPreview({ trigger, conditions, actions }: WorkflowPreviewProps) {
  return (
    <div className="workflow-preview p-4 overflow-x-auto">
      <div className="flex items-center space-x-4 min-w-max">
        {/* Trigger */}
        <TriggerNode
          trigger={trigger}
          onChange={() => {}}
          readOnly
        />

        {/* Arrow */}
        <ArrowConnector />

        {/* Conditions */}
        {conditions.map((condition, index) => (
          <div key={condition.id} className="flex items-center">
            <ConditionNode
              condition={condition}
              onChange={() => {}}
              onDelete={() => {}}
              readOnly
            />
            <ArrowConnector />
          </div>
        ))}

        {/* Actions */}
        {actions.map((action, index) => (
          <div key={action.id} className="flex items-center">
            <ActionNode
              action={action}
              onChange={() => {}}
              onDelete={() => {}}
              readOnly
            />
            {index < actions.length - 1 && <ArrowConnector />}
          </div>
        ))}
      </div>
    </div>
  );
}

function ArrowConnector() {
  return (
    <div className="flex items-center px-2">
      <div className="w-8 h-0.5 bg-gray-300" />
      <svg className="w-4 h-4 text-gray-400 -ml-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </div>
  );
}
```

---

## 9. Automation Editor Page

### File: `app/profile/marketing/automations/[id]/page.tsx`

```typescript
import { redirect, notFound } from 'next/navigation';
import { getAuthenticatedAppForUser } from '@/lib/auth/serverAuth';
import { AutomationEditor } from '@/lib/pages/profile/components/marketing/automations';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AutomationEditorPage({ params }: Props) {
  const { id } = await params;
  const { currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser) {
    redirect('/login?redirect=/profile/marketing/automations/' + id);
  }

  return <AutomationEditor automationId={id} />;
}
```

### File: `lib/pages/profile/components/marketing/automations/AutomationEditor.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBrand } from '@/lib/hooks/useBrand';
import { useAutomation } from '@/lib/features/crm/marketing/hooks';
import { Automation } from '@/lib/features/crm/marketing/types';
import { WorkflowBuilder } from './WorkflowBuilder/WorkflowBuilder';
import { StatusBadge } from '../shared/StatusBadge';

interface AutomationEditorProps {
  automationId: string;
}

export function AutomationEditor({ automationId }: AutomationEditorProps) {
  const router = useRouter();
  const { brand } = useBrand();
  const { automation, loading, updateAutomation, saveAutomation } = useAutomation(
    brand?.id || '',
    automationId
  );

  const [localAutomation, setLocalAutomation] = useState<Automation | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (automation) {
      setLocalAutomation(automation);
    }
  }, [automation]);

  const handleChange = (updates: Partial<Automation>) => {
    if (!localAutomation) return;
    setLocalAutomation({ ...localAutomation, ...updates });
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!localAutomation) return;
    await saveAutomation(localAutomation);
    setHasUnsavedChanges(false);
  };

  const handleToggleStatus = async () => {
    if (!localAutomation) return;
    const newStatus = localAutomation.status === 'active' ? 'inactive' : 'active';
    await updateAutomation({ status: newStatus });
    setLocalAutomation({ ...localAutomation, status: newStatus });
  };

  if (loading || !localAutomation || !brand) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/profile/marketing/automations')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            <div>
              <input
                type="text"
                value={localAutomation.name}
                onChange={(e) => handleChange({ name: e.target.value })}
                className="text-xl font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-pink-500 rounded px-2 -ml-2"
              />
              <div className="flex items-center space-x-2 mt-1">
                <StatusBadge status={localAutomation.status} />
                {hasUnsavedChanges && (
                  <span className="text-xs text-orange-500">Unsaved changes</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={handleToggleStatus}
              className={`px-4 py-2 text-sm rounded-lg ${
                localAutomation.status === 'active'
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {localAutomation.status === 'active' ? 'Turn off' : 'Turn on'}
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Builder */}
      <div className="p-6">
        <WorkflowBuilder
          automation={localAutomation}
          onChange={handleChange}
        />
      </div>

      {/* Performance Stats */}
      {localAutomation.status === 'active' && (
        <div className="mx-6 mb-6 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 mb-4">Performance</h3>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {localAutomation.metrics.triggered}
              </div>
              <div className="text-sm text-gray-500">Triggered</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {localAutomation.metrics.emailsSent}
              </div>
              <div className="text-sm text-gray-500">Emails sent</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {localAutomation.metrics.conversions}
              </div>
              <div className="text-sm text-gray-500">Conversions</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                ${localAutomation.metrics.revenue.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">Revenue</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 10. File Structure Summary

```
app/profile/marketing/automations/
├── page.tsx
├── new/
│   └── page.tsx
├── templates/
│   └── page.tsx
└── [id]/
    ├── page.tsx
    └── analytics/
        └── page.tsx

lib/pages/profile/components/marketing/automations/
├── index.ts
├── AutomationsDashboard.tsx
├── AutomationStatsCards.tsx
├── AutomationsList.tsx
├── EssentialTemplates.tsx
├── TemplateGallery.tsx
├── TemplatePreviewModal.tsx
├── AutomationEditor.tsx
└── WorkflowBuilder/
    ├── index.ts
    ├── WorkflowBuilder.tsx
    ├── WorkflowPreview.tsx
    ├── TriggerNode.tsx
    ├── ConditionNode.tsx
    ├── ActionNode.tsx
    └── AddNodeButton.tsx

lib/features/crm/marketing/hooks/
├── useAutomations.ts
├── useAutomation.ts
├── useAutomationStats.ts
└── useAutomationTemplates.ts
```

---

## 11. Implementation Checklist

- [ ] Create automations dashboard page
- [ ] Build automation stats cards
- [ ] Implement automations list with sorting/filtering
- [ ] Create essential templates section with progress
- [ ] Build template gallery page
- [ ] Implement template preview modal
- [ ] Create automation editor page
- [ ] Build visual workflow builder:
  - [ ] Canvas component
  - [ ] Trigger node
  - [ ] Condition node (with branching)
  - [ ] Action nodes (wait, email, sms, etc.)
  - [ ] Connector lines
  - [ ] Add node buttons
- [ ] Implement node configuration panels
- [ ] Add drag-and-drop node reordering
- [ ] Create automation hooks
- [ ] Build automation service
- [ ] Implement automation execution engine (backend)
- [ ] Add performance tracking
- [ ] Test workflow builder interactions

---

## 12. Pre-built Templates to Include

1. **Recover abandoned checkout** - Email 10 hours after checkout abandonment
2. **Recover abandoned cart** - Email when cart is abandoned
3. **Convert abandoned product browse** - Email after product view without add-to-cart
4. **Welcome new subscribers (single)** - Welcome email with discount
5. **Welcome new subscribers (series)** - 4-email welcome sequence
6. **Thank customers after purchase** - Post-purchase thank you (varies by order count)
7. **Celebrate customer birthday** - Birthday discount email
8. **Win back customers** - Re-engagement for dormant customers
9. **Upsell after first purchase** - Cross-sell featured products
10. **Share brand story** - Introduce brand to new subscribers
11. **Welcome VIP customers** - Special welcome for high-value segment
12. **Product back in stock** - Notify waitlisted customers
13. **Drive online to retail** - Invite local customers to store
14. **Notify about new products** - Push notification for new arrivals

---

## 13. Future Enhancements

- A/B testing for automation paths
- Advanced branching logic
- Time delay variations
- Conditional splits based on engagement
- Integration with third-party apps
- Automation analytics deep dive
- Template sharing between brands
- Custom code actions
- SMS automation support
- Push notification support
