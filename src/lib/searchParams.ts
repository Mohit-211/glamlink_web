/* Reading list parameters (?page=, ?category=, …) from a page's searchParams. */

export type SearchParams = Record<string, string | string[] | undefined>;

/** The first value of a parameter, trimmed; "" when absent. */
export function param(value: string | string[] | undefined): string {
  const first = Array.isArray(value) ? value[0] : value;
  return (first ?? "").trim();
}

/** A page number from 1 up; anything else is page 1. */
export function pageParam(value: string | string[] | undefined): number {
  const page = Number.parseInt(param(value), 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

/** A list URL with only the parameters that have a value (page 1 is left out). */
export function listHref(path: string, params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "" || (key === "page" && Number(value) <= 1)) continue;
    query.set(key, String(value));
  }
  const qs = query.toString();
  return qs ? `${path}?${qs}` : path;
}

/** Pages needed for `count` rows at `perPage` each. */
export const pageCountFor = (count: number, perPage: number) => Math.max(1, Math.ceil(count / perPage));
