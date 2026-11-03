"use client";

import { useCallback, useRef, useState } from "react";
import {
  directoryProvider,
  type DirectoryBusiness,
  type DirectoryLocation,
  type DirectorySearchParams,
  type FeaturedProfile,
} from "@/lib/directory";

export type DirectoryResultsState =
  | {
      /** Before a search: Google's listings around the default place, fetched with the page. */
      mode: "popular";
      status: "success";
      businesses: DirectoryBusiness[];
      profiles: FeaturedProfile[];
      params: null;
      location: null;
    }
  | {
      /** The visitor's search: Google's listings and Glamlink's own professionals near the place. */
      mode: "search";
      status: DirectoryResultsStatus;
      businesses: DirectoryBusiness[];
      profiles: FeaturedProfile[];
      params: DirectorySearchParams;
      location: DirectoryLocation | null;
    };

export type DirectoryResultsStatus = "loading" | "success" | "error";

const popularState = (businesses: DirectoryBusiness[]): DirectoryResultsState => ({
  mode: "popular",
  status: "success",
  businesses,
  profiles: [],
  params: null,
  location: null,
});

/**
 * Runs directory searches against the active provider and ignores stale responses when a newer request has
 * started. `popular` is what the page shows before (and after clearing) a search.
 */
export function useDirectorySearch(popular: DirectoryBusiness[]) {
  const [state, setState] = useState<DirectoryResultsState>(() => popularState(popular));
  const requestId = useRef(0);

  const clear = useCallback(() => {
    ++requestId.current;
    setState(popularState(popular));
  }, [popular]);

  const search = useCallback(async (params: DirectorySearchParams) => {
    const id = ++requestId.current;
    setState((prev) => ({
      mode: "search",
      status: "loading",
      params,
      businesses: prev.mode === "search" ? prev.businesses : [],
      profiles: prev.profiles,
      location: prev.mode === "search" ? prev.location : null,
    }));

    try {
      const result = await directoryProvider.searchBusinesses(params);
      if (id !== requestId.current) return;
      setState({
        status: "success",
        mode: "search",
        params,
        businesses: result.businesses,
        profiles: result.profiles,
        location: result.location,
      });
    } catch {
      if (id !== requestId.current) return;
      setState({ mode: "search", status: "error", params, businesses: [], profiles: [], location: null });
    }
  }, []);

  return { state, search, clear };
}
