# Marketing Infrastructure Plan

> **Priority**: Foundation - Must be completed first
> **Dependencies**: Existing brand/user system, Firebase/Firestore
> **Estimated Scope**: Core data models, services, APIs, event tracking

---

## Overview

This plan establishes the foundational infrastructure for the marketing system including data models, services, APIs, and event tracking. All subsequent marketing features depend on this foundation.

---

## 1. Data Models & Types

### File: `lib/features/crm/marketing/types.ts`

```typescript
// ============================================
// CORE ENUMS & CONSTANTS
// ============================================

export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'active' | 'paused' | 'inactive';
export type CampaignType = 'email' | 'sms' | 'push' | 'social';
export type ChannelType = 'direct' | 'organic' | 'paid' | 'referral' | 'social' | 'email' | 'unknown';

export type AttributionModel =
  | 'last_non_direct_click'  // Default - ignores direct, credits last channel
  | 'last_click'             // 100% to last channel
  | 'first_click'            // 100% to first channel
  | 'any_click'              // 100% to each channel (can exceed 100%)
  | 'linear';                // Equal credit to all channels

export type AutomationStatus = 'active' | 'inactive' | 'draft';
export type AutomationTriggerType =
  | 'abandoned_checkout'
  | 'abandoned_cart'
  | 'abandoned_browse'
  | 'new_subscriber'
  | 'post_purchase'
  | 'customer_birthday'
  | 'customer_winback'
  | 'vip_status'
  | 'product_back_in_stock'
  | 'custom';

// ============================================
// MARKETING CHANNELS
// ============================================

export interface MarketingChannel {
  id: string;
  name: string;                    // e.g., "Google Search", "Facebook", "Direct"
  type: ChannelType;
  icon?: string;                   // Icon identifier or URL
  isActive: boolean;
  createdAt: string;
}

// ============================================
// SESSIONS & ATTRIBUTION
// ============================================

export interface MarketingSession {
  id: string;
  visitorId: string;               // Anonymous visitor identifier
  userId?: string;                 // If logged in
  brandId: string;

  // Source tracking
  channel: string;                 // Channel name
  channelType: ChannelType;
  source?: string;                 // e.g., "google", "facebook"
  medium?: string;                 // e.g., "cpc", "organic", "email"
  campaign?: string;               // UTM campaign
  content?: string;                // UTM content
  term?: string;                   // UTM term
  referrer?: string;               // Full referrer URL
  referrerDomain?: string;         // Extracted domain

  // Session data
  landingPage: string;
  startedAt: string;
  endedAt?: string;
  pageViews: number;
  duration?: number;               // In seconds

  // Conversion tracking
  converted: boolean;
  conversionType?: 'purchase' | 'signup' | 'booking' | 'inquiry';
  conversionValue?: number;
  orderId?: string;
}

export interface ChannelAttribution {
  channelId: string;
  channelName: string;
  channelType: ChannelType;

  // Metrics
  sessions: number;
  sales: number;
  orders: number;
  conversionRate: number;          // orders / sessions * 100

  // Cost metrics (if paid)
  cost?: number;
  roas?: number;                   // Return on ad spend
  cpa?: number;                    // Cost per acquisition
  ctr?: number;                    // Click-through rate

  // Order metrics
  aov?: number;                    // Average order value
  newCustomerOrders: number;
  returningCustomerOrders: number;
}

// ============================================
// CAMPAIGNS
// ============================================

export interface Campaign {
  id: string;
  brandId: string;

  // Basic info
  name: string;
  type: CampaignType;
  status: CampaignStatus;

  // Content (varies by type)
  subject?: string;                // Email subject
  previewText?: string;            // Email preview
  content: CampaignContent;

  // Targeting
  recipientType: 'all' | 'segment' | 'manual';
  recipientSegmentId?: string;
  recipientCount: number;

  // Scheduling
  scheduledAt?: string;
  sentAt?: string;

  // Metrics
  metrics: CampaignMetrics;

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CampaignContent {
  // Email specific
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;

  // Styling
  colors?: {
    background: string;
    contentBackground: string;
    border: string;
    text: string;
    link: string;
  };

  // Sections (for email builder)
  sections?: EmailSection[];

  // Raw HTML (alternative to sections)
  html?: string;
}

export interface EmailSection {
  id: string;
  type: 'header' | 'text' | 'image' | 'button' | 'divider' | 'product' | 'footer';
  content: Record<string, any>;    // Type-specific content
  order: number;
}

export interface CampaignMetrics {
  sent: number;
  delivered: number;
  deliveryRate: number;
  opened: number;
  openRate: number;
  clicked: number;
  clickRate: number;
  unsubscribed: number;
  bounced: number;
  complained: number;

  // Conversion
  conversions: number;
  conversionRate: number;
  revenue: number;
}

// ============================================
// AUTOMATIONS
// ============================================

export interface Automation {
  id: string;
  brandId: string;

  // Basic info
  name: string;
  description?: string;
  status: AutomationStatus;

  // Workflow
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];

  // Template reference
  templateId?: string;

  // Metrics
  metrics: AutomationMetrics;

  // Metadata
  createdAt: string;
  updatedAt: string;
  lastTriggeredAt?: string;
}

export interface AutomationTrigger {
  type: AutomationTriggerType;
  config: Record<string, any>;     // Type-specific config
}

export interface AutomationCondition {
  id: string;
  field: string;                   // e.g., "abandonmentType", "customerType"
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
  nextOnTrue?: string;             // Next node ID if true
  nextOnFalse?: string;            // Next node ID if false
}

export interface AutomationAction {
  id: string;
  type: 'wait' | 'send_email' | 'send_sms' | 'add_tag' | 'remove_tag' | 'webhook';
  config: Record<string, any>;
  nextId?: string;                 // Next node ID
}

export interface AutomationMetrics {
  triggered: number;
  completed: number;
  inProgress: number;
  failed: number;

  // By action type
  emailsSent: number;
  emailsOpened: number;
  emailsClicked: number;

  // Conversions
  conversions: number;
  revenue: number;
}

export interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;

  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];

  requiredApps: string[];
  createdBy: 'system' | 'brand';
  isPopular?: boolean;
}

// ============================================
// SUBSCRIBERS
// ============================================

export interface Subscriber {
  id: string;
  brandId: string;

  // Contact info
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;

  // Subscription status
  emailSubscribed: boolean;
  smsSubscribed: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;

  // Segments
  segmentIds: string[];
  tags: string[];

  // Engagement
  lastEmailOpenedAt?: string;
  lastEmailClickedAt?: string;
  lastPurchaseAt?: string;
  totalOrders: number;
  totalSpent: number;

  // Source
  source: 'checkout' | 'form' | 'import' | 'manual';
  sourceDetail?: string;

  createdAt: string;
  updatedAt: string;
}

export interface SubscriberSegment {
  id: string;
  brandId: string;
  name: string;
  description?: string;

  // Dynamic or static
  type: 'dynamic' | 'static';

  // For dynamic segments
  rules?: SegmentRule[];

  // For static segments
  subscriberIds?: string[];

  subscriberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SegmentRule {
  field: string;
  operator: string;
  value: any;
  connector?: 'and' | 'or';
}

// ============================================
// MARKETING STATS AGGREGATES
// ============================================

export interface MarketingStats {
  brandId: string;
  period: 'day' | 'week' | 'month' | 'year';
  date: string;                    // Period start date

  // Session metrics
  totalSessions: number;
  uniqueVisitors: number;

  // Attribution metrics
  salesAttributedToMarketing: number;
  ordersAttributedToMarketing: number;
  conversionRate: number;
  averageOrderValue: number;

  // Channel breakdown
  channelStats: ChannelAttribution[];

  // Campaign metrics
  emailsSent: number;
  emailOpenRate: number;
  emailClickRate: number;

  updatedAt: string;
}
```

### File: `lib/features/crm/marketing/constants.ts`

```typescript
export const ATTRIBUTION_MODELS = [
  {
    id: 'last_non_direct_click',
    name: 'Last non-direct click',
    description: 'Direct is ignored, 100% credit given to the last channel clicked',
    isDefault: true,
  },
  {
    id: 'last_click',
    name: 'Last click',
    description: '100% credit given to the last channel clicked',
  },
  {
    id: 'first_click',
    name: 'First click',
    description: '100% credit given to the first channel clicked',
  },
  {
    id: 'any_click',
    name: 'Any click',
    description: '100% credit given to each channel clicked',
  },
  {
    id: 'linear',
    name: 'Linear',
    description: 'Equal credit given to each click',
  },
] as const;

export const ATTRIBUTION_WINDOW_DAYS = 30;

export const DEFAULT_CHANNELS: MarketingChannel[] = [
  { id: 'direct', name: 'Direct', type: 'direct', isActive: true },
  { id: 'google_search', name: 'Google Search', type: 'organic', isActive: true },
  { id: 'google_ads', name: 'Google Ads', type: 'paid', isActive: true },
  { id: 'facebook', name: 'Facebook', type: 'social', isActive: true },
  { id: 'instagram', name: 'Instagram', type: 'social', isActive: true },
  { id: 'tiktok', name: 'TikTok', type: 'social', isActive: true },
  { id: 'email', name: 'Email', type: 'email', isActive: true },
  { id: 'referral', name: 'Referral', type: 'referral', isActive: true },
];

export const DATE_RANGE_PRESETS = [
  { id: 'today', label: 'Today', days: 0 },
  { id: 'yesterday', label: 'Yesterday', days: 1 },
  { id: 'last_7_days', label: 'Last 7 days', days: 7 },
  { id: 'last_30_days', label: 'Last 30 days', days: 30 },
  { id: 'last_90_days', label: 'Last 90 days', days: 90 },
  { id: 'last_365_days', label: 'Last 365 days', days: 365 },
  { id: 'last_month', label: 'Last month', days: -1 },
  { id: 'last_12_months', label: 'Last 12 months', days: -12 },
  { id: 'last_year', label: 'Last year', days: -365 },
] as const;

export const CAMPAIGN_STATUSES = {
  draft: { label: 'Draft', color: 'gray' },
  scheduled: { label: 'Scheduled', color: 'blue' },
  sending: { label: 'Sending', color: 'yellow' },
  sent: { label: 'Sent', color: 'gray' },
  active: { label: 'Active', color: 'green' },
  paused: { label: 'Paused', color: 'orange' },
  inactive: { label: 'Inactive', color: 'gray' },
} as const;
```

---

## 2. Database Schema Design

### Firestore Structure

Following Glamlink's nested document pattern for performance:

```
brands/
  └── {brandId}/
      ├── ...existing brand fields...
      │
      ├── marketing/                    # Subcollection for marketing data
      │   ├── stats/                    # Aggregated statistics
      │   │   └── {periodId}/          # e.g., "2024-01", "2024-01-15"
      │   │
      │   ├── campaigns/               # Email/SMS campaigns
      │   │   └── {campaignId}/
      │   │
      │   ├── automations/             # Marketing automations
      │   │   └── {automationId}/
      │   │
      │   ├── subscribers/             # Email/SMS subscribers
      │   │   └── {subscriberId}/
      │   │
      │   ├── segments/                # Subscriber segments
      │   │   └── {segmentId}/
      │   │
      │   └── sessions/                # Visitor sessions (for attribution)
      │       └── {sessionId}/
      │
      └── marketingConfig/             # Single doc for brand marketing settings
          ├── defaultFromEmail
          ├── defaultFromName
          ├── brandColors
          ├── enabledChannels
          └── attributionModel
```

### Alternative: Nested in Brand Document

For smaller datasets, can nest within brand document:

```typescript
// Within brand document
{
  // ...existing fields...

  marketingConfig: {
    defaultFromEmail: string;
    defaultFromName: string;
    brandColors: { ... };
    enabledChannels: string[];
    attributionModel: AttributionModel;
  };

  // Only for summary stats (detailed data in subcollections)
  marketingSummary: {
    totalSubscribers: number;
    totalCampaigns: number;
    totalAutomations: number;
    lastUpdated: string;
  };
}
```

---

## 3. Service Layer

### File: `lib/features/crm/marketing/services/marketingService.ts`

```typescript
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  Firestore
} from 'firebase/firestore';
import { Campaign, CampaignStatus, MarketingStats } from '../types';

export class MarketingService {
  constructor(private db: Firestore) {}

  // ============================================
  // CAMPAIGNS
  // ============================================

  async getCampaigns(brandId: string, filters?: {
    status?: CampaignStatus;
    type?: string;
    limit?: number;
  }): Promise<Campaign[]> {
    const campaignsRef = collection(this.db, `brands/${brandId}/marketing/campaigns`);
    let q = query(campaignsRef, orderBy('createdAt', 'desc'));

    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
  }

  async getCampaign(brandId: string, campaignId: string): Promise<Campaign | null> {
    const docRef = doc(this.db, `brands/${brandId}/marketing/campaigns/${campaignId}`);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as Campaign : null;
  }

  async createCampaign(brandId: string, campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> {
    const campaignsRef = collection(this.db, `brands/${brandId}/marketing/campaigns`);
    const newDocRef = doc(campaignsRef);

    const newCampaign: Campaign = {
      ...campaign,
      id: newDocRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(newDocRef, newCampaign);
    return newCampaign;
  }

  async updateCampaign(brandId: string, campaignId: string, updates: Partial<Campaign>): Promise<void> {
    const docRef = doc(this.db, `brands/${brandId}/marketing/campaigns/${campaignId}`);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  async deleteCampaign(brandId: string, campaignId: string): Promise<void> {
    const docRef = doc(this.db, `brands/${brandId}/marketing/campaigns/${campaignId}`);
    await deleteDoc(docRef);
  }

  // ============================================
  // STATS
  // ============================================

  async getMarketingStats(brandId: string, startDate: string, endDate: string): Promise<MarketingStats> {
    // Aggregate stats from sessions within date range
    // Implementation depends on how sessions are stored
    throw new Error('Not implemented');
  }

  async getChannelStats(brandId: string, startDate: string, endDate: string, attributionModel: AttributionModel): Promise<ChannelAttribution[]> {
    // Calculate channel attribution based on model
    throw new Error('Not implemented');
  }
}
```

### File: `lib/features/crm/marketing/services/sessionService.ts`

```typescript
export class SessionService {
  constructor(private db: Firestore) {}

  async trackSession(brandId: string, sessionData: Omit<MarketingSession, 'id'>): Promise<MarketingSession> {
    // Create or update session
  }

  async trackConversion(brandId: string, sessionId: string, conversionData: {
    type: string;
    value: number;
    orderId?: string;
  }): Promise<void> {
    // Mark session as converted
  }

  async getSessions(brandId: string, filters: {
    startDate: string;
    endDate: string;
    channel?: string;
    converted?: boolean;
  }): Promise<MarketingSession[]> {
    // Query sessions with filters
  }
}
```

### File: `lib/features/crm/marketing/services/subscriberService.ts`

```typescript
export class SubscriberService {
  constructor(private db: Firestore) {}

  async getSubscribers(brandId: string, filters?: {
    segmentId?: string;
    subscribed?: boolean;
    limit?: number;
  }): Promise<Subscriber[]> {}

  async getSubscriber(brandId: string, subscriberId: string): Promise<Subscriber | null> {}

  async createSubscriber(brandId: string, subscriber: Omit<Subscriber, 'id' | 'createdAt'>): Promise<Subscriber> {}

  async updateSubscriber(brandId: string, subscriberId: string, updates: Partial<Subscriber>): Promise<void> {}

  async unsubscribe(brandId: string, subscriberId: string, channel: 'email' | 'sms'): Promise<void> {}

  async getSubscriberCount(brandId: string, segmentId?: string): Promise<number> {}
}
```

### File: `lib/features/crm/marketing/services/index.ts`

```typescript
export { MarketingService } from './marketingService';
export { SessionService } from './sessionService';
export { SubscriberService } from './subscriberService';
export { AutomationService } from './automationService';
export { AttributionService } from './attributionService';
```

---

## 4. API Routes

### File: `app/api/marketing/campaigns/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/auth/serverAuth';
import { MarketingService } from '@/lib/features/crm/marketing/services';

export async function GET(request: NextRequest) {
  const { db, currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser || !db) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const brandId = request.nextUrl.searchParams.get('brandId');
  if (!brandId) {
    return NextResponse.json({ error: 'Brand ID required' }, { status: 400 });
  }

  const marketingService = new MarketingService(db);
  const campaigns = await marketingService.getCampaigns(brandId);

  return NextResponse.json({ campaigns });
}

export async function POST(request: NextRequest) {
  const { db, currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser || !db) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { brandId, ...campaignData } = body;

  const marketingService = new MarketingService(db);
  const campaign = await marketingService.createCampaign(brandId, {
    ...campaignData,
    createdBy: currentUser.uid,
  });

  return NextResponse.json({ campaign });
}
```

### Additional API Routes Needed:

```
app/api/marketing/
├── campaigns/
│   ├── route.ts                 # GET list, POST create
│   └── [id]/
│       └── route.ts             # GET, PUT, DELETE single campaign
├── stats/
│   └── route.ts                 # GET marketing stats
├── channels/
│   └── route.ts                 # GET channel attribution
├── subscribers/
│   ├── route.ts                 # GET list, POST create
│   └── [id]/
│       └── route.ts             # GET, PUT, DELETE
├── segments/
│   └── route.ts                 # CRUD for segments
├── automations/
│   ├── route.ts                 # CRUD for automations
│   └── templates/
│       └── route.ts             # GET automation templates
└── track/
    └── route.ts                 # POST session/conversion tracking
```

---

## 5. React Hooks

### File: `lib/features/crm/marketing/hooks/useMarketingStats.ts`

```typescript
import { useState, useEffect } from 'react';
import { MarketingStats, AttributionModel } from '../types';

interface UseMarketingStatsOptions {
  brandId: string;
  startDate: string;
  endDate: string;
  attributionModel?: AttributionModel;
}

export function useMarketingStats(options: UseMarketingStatsOptions) {
  const [stats, setStats] = useState<MarketingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          brandId: options.brandId,
          startDate: options.startDate,
          endDate: options.endDate,
          attributionModel: options.attributionModel || 'last_non_direct_click',
        });

        const response = await fetch(`/api/marketing/stats?${params}`, {
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch stats');

        const data = await response.json();
        setStats(data.stats);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [options.brandId, options.startDate, options.endDate, options.attributionModel]);

  return { stats, loading, error };
}
```

### File: `lib/features/crm/marketing/hooks/useCampaigns.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';
import { Campaign, CampaignStatus } from '../types';

export function useCampaigns(brandId: string) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCampaigns = useCallback(async (status?: CampaignStatus) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ brandId });
      if (status) params.append('status', status);

      const response = await fetch(`/api/marketing/campaigns?${params}`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch campaigns');

      const data = await response.json();
      setCampaigns(data.campaigns);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  const createCampaign = async (campaign: Partial<Campaign>) => {
    const response = await fetch('/api/marketing/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ brandId, ...campaign }),
    });

    if (!response.ok) throw new Error('Failed to create campaign');

    const data = await response.json();
    setCampaigns(prev => [data.campaign, ...prev]);
    return data.campaign;
  };

  const updateCampaign = async (campaignId: string, updates: Partial<Campaign>) => {
    const response = await fetch(`/api/marketing/campaigns/${campaignId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ brandId, ...updates }),
    });

    if (!response.ok) throw new Error('Failed to update campaign');

    setCampaigns(prev =>
      prev.map(c => c.id === campaignId ? { ...c, ...updates } : c)
    );
  };

  const deleteCampaign = async (campaignId: string) => {
    const response = await fetch(`/api/marketing/campaigns/${campaignId}`, {
      method: 'DELETE',
      credentials: 'include',
      body: JSON.stringify({ brandId }),
    });

    if (!response.ok) throw new Error('Failed to delete campaign');

    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
  };

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  };
}
```

### File: `lib/features/crm/marketing/hooks/index.ts`

```typescript
export { useMarketingStats } from './useMarketingStats';
export { useCampaigns } from './useCampaigns';
export { useChannelAttribution } from './useChannelAttribution';
export { useSubscribers } from './useSubscribers';
export { useAutomations } from './useAutomations';
```

---

## 6. Event Tracking Infrastructure

### Client-Side Tracking Script

```typescript
// lib/features/crm/marketing/tracking/tracker.ts

interface TrackingConfig {
  brandId: string;
  apiEndpoint: string;
}

class MarketingTracker {
  private config: TrackingConfig;
  private sessionId: string | null = null;
  private visitorId: string;

  constructor(config: TrackingConfig) {
    this.config = config;
    this.visitorId = this.getOrCreateVisitorId();
    this.initSession();
  }

  private getOrCreateVisitorId(): string {
    const stored = localStorage.getItem('glam_visitor_id');
    if (stored) return stored;

    const newId = crypto.randomUUID();
    localStorage.setItem('glam_visitor_id', newId);
    return newId;
  }

  private async initSession() {
    const urlParams = new URLSearchParams(window.location.search);

    const sessionData = {
      visitorId: this.visitorId,
      brandId: this.config.brandId,
      landingPage: window.location.pathname,
      referrer: document.referrer,

      // UTM parameters
      source: urlParams.get('utm_source'),
      medium: urlParams.get('utm_medium'),
      campaign: urlParams.get('utm_campaign'),
      content: urlParams.get('utm_content'),
      term: urlParams.get('utm_term'),
    };

    const response = await fetch(`${this.config.apiEndpoint}/api/marketing/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'session_start', data: sessionData }),
    });

    const result = await response.json();
    this.sessionId = result.sessionId;
  }

  async trackPageView(page: string) {
    if (!this.sessionId) return;

    await fetch(`${this.config.apiEndpoint}/api/marketing/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'page_view',
        sessionId: this.sessionId,
        data: { page },
      }),
    });
  }

  async trackConversion(type: string, value: number, orderId?: string) {
    if (!this.sessionId) return;

    await fetch(`${this.config.apiEndpoint}/api/marketing/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'conversion',
        sessionId: this.sessionId,
        data: { type, value, orderId },
      }),
    });
  }
}

export { MarketingTracker };
```

---

## 7. Integration Points

### With Existing Brand System

```typescript
// When brand is loaded, also load marketing config
async function loadBrandWithMarketing(brandId: string) {
  const brand = await getBrand(brandId);
  const marketingConfig = await getMarketingConfig(brandId);

  return {
    ...brand,
    marketingConfig,
  };
}
```

### With Existing User/Auth System

```typescript
// Link subscriber to user when they sign up
async function onUserSignup(userId: string, email: string, brandId: string) {
  // Check if subscriber exists
  const existing = await subscriberService.findByEmail(brandId, email);

  if (existing) {
    // Link existing subscriber to user
    await subscriberService.updateSubscriber(brandId, existing.id, { userId });
  } else {
    // Create new subscriber
    await subscriberService.createSubscriber(brandId, {
      email,
      userId,
      emailSubscribed: true,
      source: 'signup',
    });
  }
}
```

---

## 8. File Structure Summary

```
lib/features/crm/marketing/
├── index.ts
├── types.ts
├── constants.ts
├── services/
│   ├── index.ts
│   ├── marketingService.ts
│   ├── sessionService.ts
│   ├── subscriberService.ts
│   ├── automationService.ts
│   └── attributionService.ts
├── hooks/
│   ├── index.ts
│   ├── useMarketingStats.ts
│   ├── useCampaigns.ts
│   ├── useChannelAttribution.ts
│   ├── useSubscribers.ts
│   └── useAutomations.ts
├── utils/
│   ├── index.ts
│   ├── attributionCalculations.ts
│   ├── dateRangeHelpers.ts
│   └── channelDetection.ts
└── tracking/
    ├── index.ts
    └── tracker.ts

app/api/marketing/
├── campaigns/
│   ├── route.ts
│   └── [id]/route.ts
├── stats/route.ts
├── channels/route.ts
├── subscribers/
│   ├── route.ts
│   └── [id]/route.ts
├── segments/route.ts
├── automations/
│   ├── route.ts
│   └── templates/route.ts
└── track/route.ts
```

---

## 9. Implementation Checklist

- [ ] Create `types.ts` with all type definitions
- [ ] Create `constants.ts` with enums and default values
- [ ] Set up Firestore subcollection structure
- [ ] Implement `MarketingService` for campaigns
- [ ] Implement `SessionService` for tracking
- [ ] Implement `SubscriberService` for subscriber management
- [ ] Implement `AttributionService` for channel attribution
- [ ] Create API routes for all CRUD operations
- [ ] Implement React hooks for data fetching
- [ ] Create client-side tracking script
- [ ] Add integration points with existing brand/user system
- [ ] Write unit tests for services
- [ ] Write integration tests for API routes

---

## Notes

- All dates stored as ISO strings (YYYY-MM-DDTHH:mm:ss.sssZ)
- Use Firestore subcollections for scalability
- Session tracking should be lightweight and non-blocking
- Attribution calculations should be done server-side
- Consider rate limiting on tracking endpoints
