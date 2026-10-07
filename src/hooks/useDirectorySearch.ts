"use client";

import { useCallback, useRef, useState } from "react";
import {
  directoryProvider,
  type DirectoryBusiness,
  type DirectoryLocation,
  type DirectorySearchParams,
} from "@/lib/directory";

export type DirectoryResultsStatus = "loading" | "success" | "error";

export interface DirectoryResultsState {
  status: DirectoryResultsStatus;
  /** "popular" = nationwide picks before a search; "search" = user query. */
  mode: "popular" | "search";
  businesses: DirectoryBusiness[];
  params: DirectorySearchParams | null;
  location: DirectoryLocation | null;
}

const INITIAL_STATE: DirectoryResultsState = {
  status: "loading",
  mode: "popular",
  businesses: [],
  params: null,
  location: null,
};

/**
 * Runs directory searches against the active provider and ignores
 * stale responses when a newer request has started.
 */
export function useDirectorySearch() {
  const [state, setState] = useState<DirectoryResultsState>(INITIAL_STATE);
  const requestId = useRef(0);

  const loadPopular = useCallback(async () => {
    const id = ++requestId.current;
    setState({ ...INITIAL_STATE, status: "loading" });

    try {
      const businesses = await directoryProvider.getPopularBusinesses();
      if (id !== requestId.current) return;
      setState({ ...INITIAL_STATE, status: "success", businesses });
    } catch {
      if (id !== requestId.current) return;
      setState({ ...INITIAL_STATE, status: "error" });
    }
  }, []);

  const search = useCallback(async (params: DirectorySearchParams) => {
    const id = ++requestId.current;
    setState((prev) => ({ ...prev, status: "loading", mode: "search", params }));

    try {
      const result = await directoryProvider.searchBusinesses(params);
      if (id !== requestId.current) return;
      setState({
        status: "success",
        mode: "search",
        params,
        businesses: result.businesses,
        location: result.location,
      });
    } catch {
      if (id !== requestId.current) return;
      setState((prev) => ({ ...prev, status: "error", businesses: [] }));
    }
  }, []);

  return { state, search, loadPopular };
}
