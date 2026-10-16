"use client";

import { useSyncExternalStore } from "react";
import { getSessionState, subscribe, type SessionState } from "@/lib/session";

const serverState: SessionState = { status: "loading", user: null };

/** The session for React components: `loading` until the first refresh answers. */
export function useSession(): SessionState {
  return useSyncExternalStore(subscribe, getSessionState, () => serverState);
}
