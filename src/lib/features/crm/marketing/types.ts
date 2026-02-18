/**
 * Marketing Infrastructure Types
 *
 * Comprehensive type definitions for the marketing system including
 * campaigns, attribution, sessions, subscribers, and automations.
 */

// ============================================
// CORE ENUMS & STATUS TYPES
// ============================================

export type CampaignStatus =
  | 'draft'
  | 'scheduled'
  | 'sending'
  | 'sent'
  | 'active'
  | 'paused'
  | 'inactive';

export type CampaignType =
  | 'email'
  | 'sms'
  | 'push'
  | 'social';

export type ChannelType =
  | 'direct'
  | 'organic'
  | 'paid'
  | 'referral'
  | 'social'
  | 'email'
  | 'unknown';

export type AttributionModel =
  | 'last_non_direct_click'  // Default - ignores direct, credits last channel
  | 'last_click'             // 100% to last channel
  | 'first_click'            // 100% to first channel
  | 'any_click'              // 100% to each channel (can exceed 100%)
  | 'linear';                // Equal credit to all channels

export type AutomationStatus =
  | 'active'
  | 'inactive'
  | 'draft';

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
  createdAt?: string;
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

export type EmailSectionType = 'header' | 'text' | 'image' | 'button' | 'divider' | 'product' | 'footer';

export interface EmailSection {
  id: string;
  type: EmailSectionType;
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

export interface AutomationStats {
  totalAutomations: number;
  activeAutomations: number;
  totalTriggered: number;
  totalCompleted: number;
  conversionRate: number;
  revenueGenerated: number;
}

export type CreateAutomationInput = Omit<Automation, 'id' | 'metrics' | 'createdAt' | 'updatedAt'>;

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

// ============================================
// HOOK RETURN TYPES
// ============================================

export interface UseCampaignsReturn {
  campaigns: Campaign[];
  loading: boolean;
  error: Error | null;
  fetchCampaigns: (status?: CampaignStatus) => Promise<void>;
  createCampaign: (data: Partial<Campaign>) => Promise<Campaign>;
  updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
}

export interface UseCampaignReturn {
  campaign: Campaign | null;
  loading: boolean;
  saving: boolean;
  error: Error | null;
  hasUnsavedChanges: boolean;
  updateCampaign: (updates: Partial<Campaign>) => void;
  saveCampaign: () => Promise<void>;
  refetch: () => Promise<void>;
}

export interface UseMarketingStatsReturn {
  stats: MarketingStats | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export interface UseChannelAttributionReturn {
  channels: ChannelAttribution[] | null;
  timeSeriesData: TimeSeriesDataPoint[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export interface TimeSeriesDataPoint {
  date: string;
  [channelId: string]: number | string;
}

export interface UseSubscribersReturn {
  subscribers: Subscriber[];
  loading: boolean;
  error: Error | null;
  fetchSubscribers: (filters?: SubscriberFilters) => Promise<void>;
  createSubscriber: (data: Partial<Subscriber>) => Promise<Subscriber>;
  updateSubscriber: (id: string, updates: Partial<Subscriber>) => Promise<void>;
  deleteSubscriber: (id: string) => Promise<void>;
  unsubscribe: (id: string, channel: 'email' | 'sms') => Promise<void>;
}

export interface SubscriberFilters {
  segmentId?: string;
  subscribed?: boolean;
  limit?: number;
}

export interface UseAutomationsReturn {
  automations: Automation[];
  loading: boolean;
  error: Error | null;
  fetchAutomations: () => Promise<void>;
  createAutomation: (data: Partial<Automation>) => Promise<Automation>;
  updateAutomation: (id: string, updates: Partial<Automation>) => Promise<void>;
  deleteAutomation: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface MarketingApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
