/**
 * Customer Types for CRM Module
 *
 * Customers are stored as a nested array within each brand document,
 * following the existing pattern used for products, providers, etc.
 */

// ============================================
// ADDRESS TYPES
// ============================================

export interface CustomerAddress {
  id: string;
  type: 'shipping' | 'billing' | 'default';
  isDefault: boolean;

  // Contact info for this address
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  phoneCountryCode?: string;

  // Address fields
  address1: string;
  address2?: string; // Apartment, suite, etc.
  city: string;
  state: string;
  stateCode?: string;
  postalCode: string;
  country: string;
  countryCode: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface AddressFormData {
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  phoneCountryCode?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  countryCode: string;
}

// ============================================
// TAX TYPES
// ============================================

export type TaxCollectionSetting =
  | 'collect_tax'
  | 'collect_tax_unless_exempt'
  | 'do_not_collect_tax';

export interface CustomerTaxSettings {
  collectionSetting: TaxCollectionSetting;
  exemptionType?: 'resale' | 'government' | 'nonprofit' | 'other';
  exemptionNumber?: string;
  exemptionExpiry?: string;
  exemptionDocumentUrl?: string;
}

// ============================================
// MARKETING & COMMUNICATION TYPES
// ============================================

export interface MarketingPreferences {
  emailSubscribed: boolean;
  emailSubscribedAt?: string;
  emailUnsubscribedAt?: string;

  smsSubscribed: boolean;
  smsSubscribedAt?: string;
  smsUnsubscribedAt?: string;

  // Consent tracking for compliance
  emailConsentSource?: 'checkout' | 'signup' | 'manual' | 'import';
  smsConsentSource?: 'checkout' | 'signup' | 'manual' | 'import';
}

export type EmailSubscriptionStatus =
  | 'subscribed'
  | 'not_subscribed'
  | 'unsubscribed'
  | 'pending';

// ============================================
// MAIN CUSTOMER TYPES
// ============================================

export interface CustomerNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string; // User ID who created the note
  updatedAt?: string;
}

export interface Customer {
  id: string;
  brandId: string;

  // Basic info
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  phoneCountryCode?: string;

  // Preferences
  language: string;
  locale?: string;
  currency?: string;

  // Addresses
  addresses: CustomerAddress[];
  defaultAddressId?: string;

  // Marketing
  marketing: MarketingPreferences;

  // Tax
  taxSettings: CustomerTaxSettings;

  // Organization
  tags: string[];
  notes: CustomerNote[];

  // Analytics (computed/cached values)
  analytics: CustomerAnalytics;

  // Metadata
  status: 'active' | 'disabled' | 'archived';
  source: 'manual' | 'checkout' | 'import' | 'api';
  createdAt: string;
  updatedAt: string;
  lastOrderAt?: string;
  lastContactedAt?: string;
}

export interface CustomerAnalytics {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  firstOrderAt?: string;
  lastOrderAt?: string;

  // Location derived from default address
  location?: {
    city?: string;
    state?: string;
    country?: string;
    countryCode?: string;
  };
}

// ============================================
// FORM & INPUT TYPES
// ============================================

export interface CreateCustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  phoneCountryCode?: string;
  language?: string;

  // Optional initial address
  address?: AddressFormData;

  // Marketing consent
  emailMarketingConsent?: boolean;
  smsMarketingConsent?: boolean;

  // Tax settings
  taxCollectionSetting?: TaxCollectionSetting;

  // Organization
  tags?: string[];
  notes?: string;
}

export interface UpdateCustomerInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  phoneCountryCode?: string;
  language?: string;

  emailMarketingConsent?: boolean;
  smsMarketingConsent?: boolean;

  taxCollectionSetting?: TaxCollectionSetting;

  tags?: string[];
  status?: 'active' | 'disabled' | 'archived';
}

// ============================================
// LIST & FILTER TYPES
// ============================================

export interface CustomerListFilters {
  search?: string;
  emailSubscription?: EmailSubscriptionStatus;
  tags?: string[];
  location?: {
    country?: string;
    state?: string;
    city?: string;
  };
  hasOrders?: boolean;
  minSpent?: number;
  maxSpent?: number;
  createdAfter?: string;
  createdBefore?: string;
  status?: Customer['status'];
}

export interface CustomerListSort {
  field: 'name' | 'email' | 'createdAt' | 'updatedAt' | 'totalOrders' | 'totalSpent' | 'lastOrderAt';
  direction: 'asc' | 'desc';
}

export interface CustomerListParams {
  filters?: CustomerListFilters;
  sort?: CustomerListSort;
  page?: number;
  limit?: number;
}

export interface CustomerListResponse {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================================
// EXPORT/IMPORT TYPES
// ============================================

export interface CustomerExportRow {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emailSubscribed: 'yes' | 'no';
  smsSubscribed: 'yes' | 'no';
  totalOrders: number;
  totalSpent: number;
  tags: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  createdAt: string;
}

export interface CustomerImportRow {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  emailSubscribed?: 'yes' | 'no' | 'true' | 'false';
  smsSubscribed?: 'yes' | 'no' | 'true' | 'false';
  tags?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    email: string;
    error: string;
  }>;
}
