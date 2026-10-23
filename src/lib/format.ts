/* Display formats shared by cards and pages. */

/** "$12.50"; null when there is no price. */
export function formatPrice(price: string | number | null | undefined): string | null {
  if (price === null || price === undefined || price === "") return null;
  const value = Number(price);
  if (!Number.isFinite(value) || value <= 0) return null;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

/**
 * "Oct 5, 2026". API dates are ISO strings at midnight UTC, so they are shown
 * in UTC to keep the day the editor picked.
 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

/** "12:34" or "1:02:03". */
export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return `${h > 0 ? `${h}:` : ""}${mm}:${String(s).padStart(2, "0")}`;
}

/** "Miami, FL", "Miami" or "". */
export function formatPlace(city: string | null | undefined, state: string | null | undefined): string {
  return [city, state].filter(Boolean).join(", ");
}
