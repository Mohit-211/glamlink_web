"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/features/auth/useAuth";

export interface AnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  totalClicks: number;
  engagementRate: number;
  clickBreakdown: {
    book: number;
    call: number;
    text: number;
    website: number;
    instagram: number;
    tiktok: number;
    save: number;
    copyUrl: number;
  };
}

export type DateRangeOption = "7d" | "30d" | "90d";

const DEFAULT_ANALYTICS: AnalyticsSummary = {
  totalViews: 0,
  uniqueVisitors: 0,
  totalClicks: 0,
  engagementRate: 0,
  clickBreakdown: {
    book: 0,
    call: 0,
    text: 0,
    website: 0,
    instagram: 0,
    tiktok: 0,
    save: 0,
    copyUrl: 0,
  },
};

interface UseProfileAnalyticsTabReturn {
  isLoading: boolean;
  dateRange: DateRangeOption;
  setDateRange: (range: DateRangeOption) => void;
  hasProfessional: boolean;
  displayAnalytics: AnalyticsSummary;
}

export function useProfileAnalyticsTab(): UseProfileAnalyticsTabReturn {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRangeOption>("30d");
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [hasProfessional, setHasProfessional] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/profile/analytics?range=${dateRange}`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.analytics) {
            setAnalytics(data.analytics);
            setHasProfessional(true);
          } else {
            setHasProfessional(false);
          }
        } else if (response.status === 404) {
          setHasProfessional(false);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [user?.uid, dateRange]);

  const displayAnalytics = analytics || DEFAULT_ANALYTICS;

  return {
    isLoading,
    dateRange,
    setDateRange,
    hasProfessional,
    displayAnalytics,
  };
}

export default useProfileAnalyticsTab;
