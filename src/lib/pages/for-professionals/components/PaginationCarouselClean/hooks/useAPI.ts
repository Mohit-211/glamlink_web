import { useState, useEffect, useCallback } from "react";
import { Professional } from "../../../types/professional";
import { generateCompleteMockPros } from "../mockData";

export interface UseAPIReturn {
  allPros: Professional[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching professional data from the API
 * Falls back to mock data if API fails or returns empty
 *
 * @param enablePagination - Whether pagination is enabled (affects mock data generation)
 * @returns Object containing professionals array, loading state, error, and refetch function
 */
export function useAPI(enablePagination: boolean): UseAPIReturn {
  const [allPros, setAllPros] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfessionals = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("=% FETCH START: Starting to fetch professionals");

      const response = await fetch('/api/professionals', {
        credentials: 'include'
      });

      console.log("=% FETCH RESPONSE: Response status:", response.status);

      if (!response.ok) {
        throw new Error('Failed to fetch professionals');
      }

      const result = await response.json();
      console.log("=% FETCH RESULT: Full API response:", result);
      console.log("=% FETCH DATA LENGTH: Number of professionals from API:", result.data?.length || 0);
      console.log("=% FETCH DATA: Professional data from API:", result.data);

      const apiData = result.data || [];

      // If API returns no data, fall back to mock data
      if (apiData.length === 0) {
        console.log("=% FALLBACK: No professionals from API, using mock data");
        const mockData = generateCompleteMockPros(enablePagination);
        console.log("=% FALLBACK: Mock data generated:", mockData.length, "professionals");
        console.log("=% FALLBACK: Mock data sample:", mockData.slice(0, 2));
        setAllPros(mockData);
      } else {
        console.log("=% SUCCESS: Setting", apiData.length, "professionals from API");
        console.log("=% SUCCESS: Sample of API data:", apiData.slice(0, 2));
        setAllPros(apiData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("=% ERROR: Error fetching professionals:", err);
      setError(errorMessage);

      // Fallback to mock data on error
      console.log("=% ERROR FALLBACK: API error, using mock data");
      const mockData = generateCompleteMockPros(enablePagination);
      console.log("=% ERROR FALLBACK: Mock data generated:", mockData.length, "professionals");
      setAllPros(mockData);
    } finally {
      console.log("=% FETCH END: Loading complete");
      setIsLoading(false);
    }
  }, [enablePagination]);

  // Fetch on mount
  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  return {
    allPros,
    isLoading,
    error,
    refetch: fetchProfessionals,
  };
}
