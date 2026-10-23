import { apiDirectoryProvider } from "./apiProvider";
import type { DirectoryProvider } from "./types";

/** The directory's data: the API's Google listings and Glamlink's own professionals. */
export const directoryProvider: DirectoryProvider = apiDirectoryProvider;

export * from "./types";
export * from "./categories";
