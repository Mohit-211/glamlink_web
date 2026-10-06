import { mockDirectoryProvider } from "./mockProvider";
import type { DirectoryProvider } from "./types";

/**
 * The active directory data source.
 *
 * To go live with Google Places, implement `DirectoryProvider` (ideally
 * calling a Next.js route handler so the API key stays server-side),
 * map Places results into `DirectoryBusiness`, and swap it in here.
 */
export const directoryProvider: DirectoryProvider = mockDirectoryProvider;

export * from "./types";
export * from "./categories";
