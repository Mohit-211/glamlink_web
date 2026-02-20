# Communication Feature Implementation Plan

## Overview
Implement communication settings that allow beauty professionals to manage contact methods, booking availability, and auto-reply messages. This is Phase 1, Order 6 of the profile settings features.

## Context

### Current State
- Profile settings page exists at `/app/profile/settings/` using `ProfileSettingsPage` component
- Settings organized in two-column layout
- **Completed features**: Privacy (1), Professional (2), Preferences (3), Brand (4), Notifications (5)
- **Current task**: Communication (6)
- Brand data stored in `brands/{brandId}` Firestore documents
- Pattern: Professional Settings (complex hook + multiple sub-routes)

### Pattern Decision: Professional Settings (Complex)

**Why this pattern?**
- Multiple distinct configuration areas (contact methods, booking, auto-reply)
- Array management for contact methods (add/remove/set primary)
- Each section has different validation rules
- Specialized methods per operation (not generic update)

**Key patterns from completed features:**
1. Optimistic updates with rollback on error
2. `credentials: 'include'` in ALL fetch calls
3. Brand ID: `brand_${currentUser.uid}` (NOT `currentUser.brandId`)
4. Specialized methods per operation type
5. Sub-routes per section
6. Three-layer validation (Component → Hook → Server)

## Architecture

### Directory Structure
```
lib/features/profile-settings/communication/
├── types.ts                         # All TypeScript interfaces
├── config.ts                        # Defaults, validation patterns, constants
├── components/
│   ├── CommunicationSection.tsx     # Main section (summary cards)
│   ├── ContactPreferences.tsx       # Contact methods table
│   ├── BookingSettings.tsx          # Booking configuration
│   └── AutoReply.tsx                # Auto-reply message editor
├── hooks/
│   ├── useCommunication.ts          # Main hook with specialized methods
│   └── index.ts                     # Hook exports
└── index.ts                         # Barrel exports

app/api/profile/communication/
├── route.ts                         # GET all settings
├── contact/
│   ├── route.ts                     # POST/PATCH/DELETE contact methods
│   └── primary/
│       └── route.ts                 # PATCH set primary contact
├── booking/
│   └── route.ts                     # PATCH booking settings
└── auto-reply/
    └── route.ts                     # PATCH auto-reply settings
```

## Implementation Steps

### Phase 1: Types and Configuration

**File**: `lib/features/profile-settings/communication/types.ts`

```typescript
export type ContactMethod = 'email' | 'phone' | 'whatsapp' | 'instagram' | 'platform_message';
export type BookingStatus = 'accepting' | 'paused' | 'by_request';
export type AutoReplyTrigger = 'always' | 'outside_hours' | 'when_busy' | 'disabled';
export type CancellationPolicy = 'flexible' | 'moderate' | 'strict' | 'custom';

export interface ContactMethodConfig {
  method: ContactMethod;
  enabled: boolean;
  value: string;                      // Email address, phone number, handle
  isPrimary: boolean;                 // Primary contact method
  displayOnProfile: boolean;          // Show on public profile
}

export interface BookingSettings {
  status: BookingStatus;
  pausedUntil?: string;               // ISO date for temporary pause
  pauseReason?: string;               // Optional reason shown to customers
  leadTime: number;                   // Minimum hours before booking (0-168)
  maxAdvanceBooking: number;          // Maximum days in advance (1-365)
  requireDeposit: boolean;            // Require deposit for bookings
  depositAmount?: number;             // Deposit percentage or fixed amount
  depositType?: 'percentage' | 'fixed';
  instantBooking: boolean;            // Allow instant booking vs. request only
  cancellationPolicy: CancellationPolicy;
}

export interface AutoReplySettings {
  enabled: boolean;
  trigger: AutoReplyTrigger;
  message: string;                    // Custom auto-reply message
  includeAvailability: boolean;       // Include next available time
  includeBookingLink: boolean;        // Include link to book
  excludeExistingClients: boolean;    // Don't auto-reply to existing clients
}

export interface CommunicationSettings {
  contactMethods: ContactMethodConfig[];
  booking: BookingSettings;
  autoReply: AutoReplySettings;
}

export interface UseCommunicationReturn {
  settings: CommunicationSettings;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Contact Methods
  updateContactMethod: (method: ContactMethod, updates: Partial<ContactMethodConfig>) => Promise<void>;
  addContactMethod: (config: ContactMethodConfig) => Promise<void>;
  removeContactMethod: (method: ContactMethod) => Promise<void>;
  setPrimaryContact: (method: ContactMethod) => Promise<void>;

  // Booking Settings
  updateBookingSettings: (updates: Partial<BookingSettings>) => Promise<void>;
  pauseBookings: (until?: string, reason?: string) => Promise<void>;
  resumeBookings: () => Promise<void>;

  // Auto Reply
  updateAutoReply: (updates: Partial<AutoReplySettings>) => Promise<void>;
}
```

**File**: `lib/features/profile-settings/communication/config.ts`

```typescript
import type { ContactMethod, BookingStatus, CancellationPolicy, AutoReplyTrigger, CommunicationSettings } from './types';

export const CONTACT_METHOD_OPTIONS: {
  method: ContactMethod;
  label: string;
  icon: string;
  placeholder: string;
  validation: RegExp;
}[] = [
  {
    method: 'email',
    label: 'Email',
    icon: 'Mail',
    placeholder: 'your@email.com',
    validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  {
    method: 'phone',
    label: 'Phone',
    icon: 'Phone',
    placeholder: '+1 (555) 123-4567',
    validation: /^\+?[\d\s\-\(\)]+$/,
  },
  {
    method: 'whatsapp',
    label: 'WhatsApp',
    icon: 'MessageCircle',
    placeholder: '+1 555 123 4567',
    validation: /^\+?[\d\s]+$/,
  },
  {
    method: 'instagram',
    label: 'Instagram',
    icon: 'Instagram',
    placeholder: '@yourusername',
    validation: /^@?[\w.]+$/,
  },
  {
    method: 'platform_message',
    label: 'Platform Messages',
    icon: 'MessageSquare',
    placeholder: 'Enabled by default',
    validation: /.*/,
  },
];

export const BOOKING_STATUS_OPTIONS: {
  value: BookingStatus;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: 'accepting',
    label: 'Accepting Bookings',
    description: 'Customers can book appointments',
    icon: 'CheckCircle',
  },
  {
    value: 'paused',
    label: 'Paused',
    description: 'Temporarily not accepting new bookings',
    icon: 'PauseCircle',
  },
  {
    value: 'by_request',
    label: 'By Request Only',
    description: 'Customers must request and you approve',
    icon: 'HelpCircle',
  },
];

export const CANCELLATION_POLICIES: {
  value: CancellationPolicy;
  label: string;
  description: string;
}[] = [
  {
    value: 'flexible',
    label: 'Flexible',
    description: 'Free cancellation up to 24 hours before',
  },
  {
    value: 'moderate',
    label: 'Moderate',
    description: 'Free cancellation up to 48 hours before',
  },
  {
    value: 'strict',
    label: 'Strict',
    description: 'Free cancellation up to 7 days before',
  },
  {
    value: 'custom',
    label: 'Custom',
    description: 'Set your own cancellation policy',
  },
];

export const AUTO_REPLY_TRIGGERS: {
  value: AutoReplyTrigger;
  label: string;
  description: string;
}[] = [
  {
    value: 'disabled',
    label: 'Disabled',
    description: 'No automatic replies',
  },
  {
    value: 'always',
    label: 'Always',
    description: 'Reply to all new messages',
  },
  {
    value: 'outside_hours',
    label: 'Outside Business Hours',
    description: 'Reply when outside your set hours',
  },
  {
    value: 'when_busy',
    label: 'When Busy',
    description: 'Reply when bookings are paused',
  },
];

export const DEFAULT_AUTO_REPLY_MESSAGE = `Thanks for reaching out! I've received your message and will get back to you as soon as possible.

In the meantime, feel free to check my availability and book an appointment through my profile.

Best,
{{brand_name}}`;

export const DEFAULT_COMMUNICATION_SETTINGS: CommunicationSettings = {
  contactMethods: [
    {
      method: 'platform_message',
      enabled: true,
      value: '',
      isPrimary: true,
      displayOnProfile: true,
    },
  ],
  booking: {
    status: 'accepting',
    leadTime: 24,
    maxAdvanceBooking: 60,
    requireDeposit: false,
    instantBooking: true,
    cancellationPolicy: 'moderate',
  },
  autoReply: {
    enabled: false,
    trigger: 'disabled',
    message: DEFAULT_AUTO_REPLY_MESSAGE,
    includeAvailability: true,
    includeBookingLink: true,
    excludeExistingClients: true,
  },
};
```

### Phase 2: Hook Implementation

**File**: `lib/features/profile-settings/communication/hooks/useCommunication.ts`

Follow Professional pattern with specialized methods:

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/features/auth/useAuth";
import { DEFAULT_COMMUNICATION_SETTINGS, CONTACT_METHOD_OPTIONS } from "../config";
import type {
  ContactMethod,
  ContactMethodConfig,
  CommunicationSettings,
  UseCommunicationReturn,
  BookingSettings,
  AutoReplySettings,
} from "../types";

export function useCommunication(): UseCommunicationReturn {
  const { user } = useAuth();
  const [settings, setSettings] = useState<CommunicationSettings>(
    DEFAULT_COMMUNICATION_SETTINGS
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!user?.uid) {
      setSettings(DEFAULT_COMMUNICATION_SETTINGS);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profile/communication", {
        method: "GET",
        credentials: "include",  // CRITICAL for auth
      });

      if (!response.ok) {
        throw new Error("Failed to fetch communication settings");
      }

      const data = await response.json();

      if (data.success) {
        setSettings(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch settings");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch settings");
      setSettings(DEFAULT_COMMUNICATION_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // === CONTACT METHODS ===

  const updateContactMethod = async (
    method: ContactMethod,
    updates: Partial<ContactMethodConfig>
  ) => {
    if (!user?.uid) {
      setError("You must be logged in");
      return;
    }

    // Validate value if changed
    if (updates.value !== undefined) {
      const methodConfig = CONTACT_METHOD_OPTIONS.find(m => m.method === method);
      if (methodConfig && !methodConfig.validation.test(updates.value)) {
        setError(`Invalid ${methodConfig.label} format`);
        return;
      }
    }

    setIsSaving(true);
    setError(null);

    // Optimistic update
    const previousSettings = { ...settings };
    const methods = [...settings.contactMethods];
    const index = methods.findIndex(m => m.method === method);
    if (index !== -1) {
      methods[index] = { ...methods[index], ...updates };
      setSettings({ ...settings, contactMethods: methods });
    }

    try {
      const response = await fetch("/api/profile/communication/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ method, updates }),
      });

      if (!response.ok) {
        throw new Error("Failed to update contact method");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update contact method");
      }
    } catch (err) {
      // Revert on error
      setSettings(previousSettings);
      setError(err instanceof Error ? err.message : "Failed to update contact method");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const addContactMethod = async (config: ContactMethodConfig) => {
    if (!user?.uid) {
      setError("You must be logged in");
      return;
    }

    // Validate format
    const methodConfig = CONTACT_METHOD_OPTIONS.find(m => m.method === config.method);
    if (methodConfig && !methodConfig.validation.test(config.value)) {
      setError(`Invalid ${methodConfig.label} format`);
      return;
    }

    // Check duplicates
    if (settings.contactMethods.some(m => m.method === config.method)) {
      setError("This contact method is already added");
      return;
    }

    setIsSaving(true);
    setError(null);

    // Optimistic update
    const previousSettings = { ...settings };
    const newMethod = { ...config, isPrimary: false };
    setSettings({
      ...settings,
      contactMethods: [...settings.contactMethods, newMethod],
    });

    try {
      const response = await fetch("/api/profile/communication/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newMethod),
      });

      if (!response.ok) {
        throw new Error("Failed to add contact method");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to add contact method");
      }
    } catch (err) {
      // Revert on error
      setSettings(previousSettings);
      setError(err instanceof Error ? err.message : "Failed to add contact method");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const removeContactMethod = async (method: ContactMethod) => {
    if (!user?.uid) {
      setError("You must be logged in");
      return;
    }

    // Cannot remove platform_message
    if (method === 'platform_message') {
      setError("Platform messages cannot be removed");
      return;
    }

    setIsSaving(true);
    setError(null);

    // Optimistic update
    const previousSettings = { ...settings };
    const methods = settings.contactMethods.filter(m => m.method !== method);
    setSettings({ ...settings, contactMethods: methods });

    try {
      const response = await fetch("/api/profile/communication/contact", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ method }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove contact method");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to remove contact method");
      }
    } catch (err) {
      // Revert on error
      setSettings(previousSettings);
      setError(err instanceof Error ? err.message : "Failed to remove contact method");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const setPrimaryContact = async (method: ContactMethod) => {
    if (!user?.uid) {
      setError("You must be logged in");
      return;
    }

    setIsSaving(true);
    setError(null);

    // Optimistic update: set one true, others false
    const previousSettings = { ...settings };
    const methods = settings.contactMethods.map(m => ({
      ...m,
      isPrimary: m.method === method,
    }));
    setSettings({ ...settings, contactMethods: methods });

    try {
      const response = await fetch("/api/profile/communication/contact/primary", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ method }),
      });

      if (!response.ok) {
        throw new Error("Failed to set primary contact");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to set primary contact");
      }
    } catch (err) {
      // Revert on error
      setSettings(previousSettings);
      setError(err instanceof Error ? err.message : "Failed to set primary contact");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // === BOOKING SETTINGS ===

  const updateBookingSettings = async (updates: Partial<BookingSettings>) => {
    if (!user?.uid) {
      setError("You must be logged in");
      return;
    }

    setIsSaving(true);
    setError(null);

    // Optimistic update
    const previousSettings = { ...settings };
    setSettings({
      ...settings,
      booking: { ...settings.booking, ...updates },
    });

    try {
      const response = await fetch("/api/profile/communication/booking", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking settings");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update booking settings");
      }
    } catch (err) {
      // Revert on error
      setSettings(previousSettings);
      setError(err instanceof Error ? err.message : "Failed to update booking settings");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const pauseBookings = async (until?: string, reason?: string) => {
    await updateBookingSettings({
      status: 'paused',
      pausedUntil: until,
      pauseReason: reason,
    });
  };

  const resumeBookings = async () => {
    await updateBookingSettings({
      status: 'accepting',
      pausedUntil: undefined,
      pauseReason: undefined,
    });
  };

  // === AUTO REPLY ===

  const updateAutoReply = async (updates: Partial<AutoReplySettings>) => {
    if (!user?.uid) {
      setError("You must be logged in");
      return;
    }

    setIsSaving(true);
    setError(null);

    // Optimistic update
    const previousSettings = { ...settings };
    setSettings({
      ...settings,
      autoReply: { ...settings.autoReply, ...updates },
    });

    try {
      const response = await fetch("/api/profile/communication/auto-reply", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update auto-reply settings");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update auto-reply settings");
      }
    } catch (err) {
      // Revert on error
      setSettings(previousSettings);
      setError(err instanceof Error ? err.message : "Failed to update auto-reply settings");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings,
    isLoading,
    isSaving,
    error,
    updateContactMethod,
    addContactMethod,
    removeContactMethod,
    setPrimaryContact,
    updateBookingSettings,
    pauseBookings,
    resumeBookings,
    updateAutoReply,
  };
}
```

**File**: `lib/features/profile-settings/communication/hooks/index.ts`

```typescript
export { useCommunication } from './useCommunication';
```

### Phase 3: API Routes

**File**: `app/api/profile/communication/route.ts` (GET all settings)

```typescript
import { NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc } from 'firebase/firestore';
import { DEFAULT_COMMUNICATION_SETTINGS } from '@/lib/features/profile-settings/communication/config';

// GET /api/profile/communication - Get all communication settings
export async function GET() {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404 }
      );
    }

    // Return communicationSettings or default
    const brandData = brandSnap.data();
    const settings = brandData?.communicationSettings || DEFAULT_COMMUNICATION_SETTINGS;

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching communication settings:', error);
    return NextResponse.json(
      { error: "Failed to fetch communication settings" },
      { status: 500 }
    );
  }
}
```

**File**: `app/api/profile/communication/contact/route.ts` (POST/PATCH/DELETE)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { DEFAULT_COMMUNICATION_SETTINGS, CONTACT_METHOD_OPTIONS } from '@/lib/features/profile-settings/communication/config';
import type { ContactMethodConfig, ContactMethod } from '@/lib/features/profile-settings/communication/types';

// POST - Add contact method
export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const newMethod: ContactMethodConfig = await request.json();

    // Validate format
    const methodConfig = CONTACT_METHOD_OPTIONS.find(m => m.method === newMethod.method);
    if (!methodConfig) {
      return NextResponse.json({ error: "Invalid contact method" }, { status: 400 });
    }

    if (!methodConfig.validation.test(newMethod.value)) {
      return NextResponse.json({ error: `Invalid ${methodConfig.label} format` }, { status: 400 });
    }

    // Get current methods
    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brandData = brandSnap.data();
    const currentMethods = brandData?.communicationSettings?.contactMethods || DEFAULT_COMMUNICATION_SETTINGS.contactMethods;

    // Check duplicates
    if (currentMethods.some((m: ContactMethodConfig) => m.method === newMethod.method)) {
      return NextResponse.json({ error: "Contact method already exists" }, { status: 400 });
    }

    // Add method (never primary on creation)
    const updatedMethods = [...currentMethods, { ...newMethod, isPrimary: false }];

    await updateDoc(brandRef, {
      'communicationSettings.contactMethods': updatedMethods,
      'updatedAt': new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: updatedMethods });
  } catch (error) {
    console.error('Error adding contact method:', error);
    return NextResponse.json(
      { error: "Failed to add contact method" },
      { status: 500 }
    );
  }
}

// PATCH - Update contact method
export async function PATCH(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const { method, updates } = await request.json();

    // Validate if value changed
    if (updates.value !== undefined) {
      const methodConfig = CONTACT_METHOD_OPTIONS.find(m => m.method === method);
      if (methodConfig && !methodConfig.validation.test(updates.value)) {
        return NextResponse.json({ error: `Invalid ${methodConfig.label} format` }, { status: 400 });
      }
    }

    // Get current methods
    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brandData = brandSnap.data();
    const currentMethods = brandData?.communicationSettings?.contactMethods || DEFAULT_COMMUNICATION_SETTINGS.contactMethods;

    // Find and update
    const index = currentMethods.findIndex((m: ContactMethodConfig) => m.method === method);
    if (index === -1) {
      return NextResponse.json({ error: "Contact method not found" }, { status: 404 });
    }

    currentMethods[index] = { ...currentMethods[index], ...updates };

    await updateDoc(brandRef, {
      'communicationSettings.contactMethods': currentMethods,
      'updatedAt': new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: currentMethods });
  } catch (error) {
    console.error('Error updating contact method:', error);
    return NextResponse.json(
      { error: "Failed to update contact method" },
      { status: 500 }
    );
  }
}

// DELETE - Remove contact method
export async function DELETE(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const { method }: { method: ContactMethod } = await request.json();

    // Cannot remove platform_message
    if (method === 'platform_message') {
      return NextResponse.json(
        { error: "Platform messages cannot be removed" },
        { status: 400 }
      );
    }

    // Get current methods
    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brandData = brandSnap.data();
    const currentMethods: ContactMethodConfig[] = brandData?.communicationSettings?.contactMethods || DEFAULT_COMMUNICATION_SETTINGS.contactMethods;

    const methodToRemove = currentMethods.find(m => m.method === method);
    if (!methodToRemove) {
      return NextResponse.json({ error: "Contact method not found" }, { status: 404 });
    }

    // Remove method
    let updatedMethods = currentMethods.filter(m => m.method !== method);

    // If removing primary, assign to platform_message
    if (methodToRemove.isPrimary && updatedMethods.length > 0) {
      const platformMsg = updatedMethods.find(m => m.method === 'platform_message');
      if (platformMsg) {
        platformMsg.isPrimary = true;
      } else {
        updatedMethods[0].isPrimary = true;  // Fallback
      }
    }

    await updateDoc(brandRef, {
      'communicationSettings.contactMethods': updatedMethods,
      'updatedAt': new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: updatedMethods });
  } catch (error) {
    console.error('Error removing contact method:', error);
    return NextResponse.json(
      { error: "Failed to remove contact method" },
      { status: 500 }
    );
  }
}
```

**File**: `app/api/profile/communication/contact/primary/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { DEFAULT_COMMUNICATION_SETTINGS } from '@/lib/features/profile-settings/communication/config';
import type { ContactMethodConfig, ContactMethod } from '@/lib/features/profile-settings/communication/types';

// PATCH - Set primary contact method
export async function PATCH(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const { method }: { method: ContactMethod } = await request.json();

    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brandData = brandSnap.data();
    const currentMethods: ContactMethodConfig[] = brandData?.communicationSettings?.contactMethods || DEFAULT_COMMUNICATION_SETTINGS.contactMethods;

    // Set all to false except specified
    const updatedMethods = currentMethods.map(m => ({
      ...m,
      isPrimary: m.method === method,
    }));

    await updateDoc(brandRef, {
      'communicationSettings.contactMethods': updatedMethods,
      'updatedAt': new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: updatedMethods });
  } catch (error) {
    console.error('Error setting primary contact:', error);
    return NextResponse.json(
      { error: "Failed to set primary contact" },
      { status: 500 }
    );
  }
}
```

**File**: `app/api/profile/communication/booking/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { DEFAULT_COMMUNICATION_SETTINGS } from '@/lib/features/profile-settings/communication/config';
import type { BookingSettings } from '@/lib/features/profile-settings/communication/types';

// PATCH - Update booking settings
export async function PATCH(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const updates: Partial<BookingSettings> = await request.json();

    // Validate pausedUntil is in future if provided
    if (updates.pausedUntil) {
      const pauseDate = new Date(updates.pausedUntil);
      if (pauseDate <= new Date()) {
        return NextResponse.json(
          { error: "Pause date must be in the future" },
          { status: 400 }
        );
      }
    }

    // Get current settings
    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brandData = brandSnap.data();
    const currentBooking = brandData?.communicationSettings?.booking || DEFAULT_COMMUNICATION_SETTINGS.booking;

    // Merge updates
    const updatedBooking: BookingSettings = {
      ...currentBooking,
      ...updates,
    };

    await updateDoc(brandRef, {
      'communicationSettings.booking': updatedBooking,
      'updatedAt': new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error('Error updating booking settings:', error);
    return NextResponse.json(
      { error: "Failed to update booking settings" },
      { status: 500 }
    );
  }
}
```

**File**: `app/api/profile/communication/auto-reply/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { DEFAULT_COMMUNICATION_SETTINGS } from '@/lib/features/profile-settings/communication/config';
import type { AutoReplySettings } from '@/lib/features/profile-settings/communication/types';

// PATCH - Update auto-reply settings
export async function PATCH(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const updates: Partial<AutoReplySettings> = await request.json();

    // Get current settings
    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brandData = brandSnap.data();
    const currentAutoReply = brandData?.communicationSettings?.autoReply || DEFAULT_COMMUNICATION_SETTINGS.autoReply;

    // Merge updates
    const updatedAutoReply: AutoReplySettings = {
      ...currentAutoReply,
      ...updates,
    };

    await updateDoc(brandRef, {
      'communicationSettings.autoReply': updatedAutoReply,
      'updatedAt': new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: updatedAutoReply });
  } catch (error) {
    console.error('Error updating auto-reply settings:', error);
    return NextResponse.json(
      { error: "Failed to update auto-reply settings" },
      { status: 500 }
    );
  }
}
```

### Phase 4: Components

Components will follow the same pattern as Professional and Notifications sections.

**File**: `lib/features/profile-settings/communication/components/CommunicationSection.tsx` - Main section with summary overview

**File**: `lib/features/profile-settings/communication/components/ContactPreferences.tsx` - Table showing contact methods with add/edit/remove

**File**: `lib/features/profile-settings/communication/components/BookingSettings.tsx` - Form for booking configuration

**File**: `lib/features/profile-settings/communication/components/AutoReply.tsx` - Form for auto-reply message

### Phase 5: Barrel Exports

**File**: `lib/features/profile-settings/communication/index.ts`

```typescript
/**
 * Communication Feature - Barrel exports
 */

// Types
export type * from './types';

// Config
export * from './config';

// Hook
export { useCommunication } from './hooks';

// Components
export { default as CommunicationSection } from './components/CommunicationSection';
export { default as ContactPreferences } from './components/ContactPreferences';
export { default as BookingSettings } from './components/BookingSettings';
export { default as AutoReply } from './components/AutoReply';
```

### Phase 6: Integration

**Update**: `lib/features/profile-settings/components/CommunicationSection.tsx` (re-export wrapper)

```typescript
/**
 * CommunicationSection - Re-export from communication module
 */

export { default } from "../communication/components/CommunicationSection";
```

**Update**: `lib/features/profile-settings/components/index.ts` - Add export

**Update**: `lib/features/profile-settings/components/ProfileSettingsPage.tsx` - Add CommunicationSection after Notifications

**Update**: `lib/features/profile-settings/index.ts` - Add communication exports

## Database Schema

### Firestore Structure
```typescript
brands/{brandId}
{
  // ... existing fields

  communicationSettings: {
    contactMethods: [
      {
        method: 'platform_message',
        enabled: true,
        value: '',
        isPrimary: true,
        displayOnProfile: true,
      },
      // ... more methods
    ],
    booking: {
      status: 'accepting',
      pausedUntil: null,
      pauseReason: null,
      leadTime: 24,
      maxAdvanceBooking: 60,
      requireDeposit: false,
      depositAmount: null,
      depositType: null,
      instantBooking: true,
      cancellationPolicy: 'moderate',
    },
    autoReply: {
      enabled: false,
      trigger: 'disabled',
      message: '...',
      includeAvailability: true,
      includeBookingLink: true,
      excludeExistingClients: true,
    },
    updatedAt: Timestamp,
  }
}
```

## Critical Files to Create/Modify

### New Files (14 files)
1. `lib/features/profile-settings/communication/types.ts`
2. `lib/features/profile-settings/communication/config.ts`
3. `lib/features/profile-settings/communication/hooks/useCommunication.ts`
4. `lib/features/profile-settings/communication/hooks/index.ts`
5. `lib/features/profile-settings/communication/components/CommunicationSection.tsx`
6. `lib/features/profile-settings/communication/components/ContactPreferences.tsx`
7. `lib/features/profile-settings/communication/components/BookingSettings.tsx`
8. `lib/features/profile-settings/communication/components/AutoReply.tsx`
9. `lib/features/profile-settings/communication/index.ts`
10. `app/api/profile/communication/route.ts`
11. `app/api/profile/communication/contact/route.ts`
12. `app/api/profile/communication/contact/primary/route.ts`
13. `app/api/profile/communication/booking/route.ts`
14. `app/api/profile/communication/auto-reply/route.ts`

### Modified Files (4 files)
1. `lib/features/profile-settings/components/CommunicationSection.tsx` (re-export wrapper)
2. `lib/features/profile-settings/components/index.ts` (add export)
3. `lib/features/profile-settings/components/ProfileSettingsPage.tsx` (add CommunicationSection)
4. `lib/features/profile-settings/index.ts` (add communication exports)

## Important Implementation Details

1. **Brand ID Pattern**: Always use `brand_${currentUser.uid}`, NOT `currentUser.brandId`
2. **Auth Credentials**: Always include `credentials: 'include'` in fetch calls
3. **Platform Message Enforcement**: Cannot be removed, always enabled
4. **Primary Contact**: Only one method can be primary at a time
5. **Array Operations**: Server validates and reconstructs entire array
6. **Optimistic Updates**: Update UI immediately, rollback on error
7. **Validation**: Three layers (component HTML5, hook business rules, server security)
8. **Default Values**: Return defaults if no settings exist

## Verification & Testing

- [ ] Add/update/remove contact methods
- [ ] Set primary contact (one at a time)
- [ ] Toggle visibility and enabled states
- [ ] Validate email/phone/Instagram formats
- [ ] Try removing platform_message (should fail)
- [ ] Change booking status (accepting/paused/by_request)
- [ ] Pause bookings with future date
- [ ] Try pause with past date (should fail)
- [ ] Resume bookings
- [ ] Update lead time and max advance
- [ ] Configure deposit settings
- [ ] Select cancellation policies
- [ ] Enable/disable auto-reply
- [ ] Change auto-reply trigger
- [ ] Edit auto-reply message
- [ ] Toggle auto-reply options
- [ ] Error handling and rollback
