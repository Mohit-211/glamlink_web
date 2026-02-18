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
