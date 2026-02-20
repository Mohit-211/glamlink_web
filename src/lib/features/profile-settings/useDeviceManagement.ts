"use client";

/**
 * useDeviceManagement - Hook for managing logged-in devices/sessions
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/features/auth/useAuth";
import type { Device, UseDeviceManagementReturn } from "./types";

export function useDeviceManagement(): UseDeviceManagementReturn {
  const { user } = useAuth();

  // State
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevoking, setIsRevoking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch devices
  const fetchDevices = useCallback(async () => {
    if (!user?.uid) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/profile/devices", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch devices");
      }

      const data = await response.json();
      if (data.success && data.data) {
        setDevices(data.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch devices";
      setError(errorMessage);
      console.error("Error fetching devices:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Revoke a specific device
  const revokeDevice = async (deviceId: string) => {
    if (!user?.uid) {
      setError("You must be logged in to revoke devices");
      return;
    }

    setIsRevoking(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/profile/devices/${deviceId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to revoke device");
      }

      // Remove device from local state
      setDevices((prev) => prev.filter((d) => d.id !== deviceId));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to revoke device";
      setError(errorMessage);
    } finally {
      setIsRevoking(false);
    }
  };

  // Revoke all other devices except current
  const revokeAllOtherDevices = async () => {
    if (!user?.uid) {
      setError("You must be logged in to revoke devices");
      return;
    }

    setIsRevoking(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/profile/devices/revoke-all", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to revoke devices");
      }

      // Keep only current device
      setDevices((prev) => prev.filter((d) => d.current));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to revoke devices";
      setError(errorMessage);
    } finally {
      setIsRevoking(false);
    }
  };

  return {
    // State
    devices,

    // Status
    isLoading,
    isRevoking,
    error,
    success,

    // Handlers
    fetchDevices,
    revokeDevice,
    revokeAllOtherDevices,
  };
}
