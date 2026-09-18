// formDataSessionStorage.ts
// Converts a FormData instance into a plain, JSON-serializable object
// (File entries are summarized as {name, size, type} since actual file
// bytes can't go into sessionStorage), then saves/reads it.

const FORM_STORAGE_KEY = "glamcard_submit_payload";

// sessionStorage survives a page reload (F5) — it's only cleared when the
// tab/window itself closes. That means a payload saved on one visit could
// silently linger and get picked up again after a refresh, even though
// nothing about this module ties that payload to "we're intentionally
// resuming a submit" the way GlamCardForm's postLoginRedirect flag does
// for its own draft key.
//
// To keep this key from outliving a single page load, we clear it once,
// as a side effect, the moment this module is first evaluated in the
// browser. Since the JS module graph is re-executed fresh on every full
// reload, this effectively means: "whatever was saved before this reload
// is gone." Anything saved via saveFormDataToSession() *during* the
// current page's lifetime (e.g. right before an in-page redirect to
// /login) is unaffected, since that save happens after this module has
// already finished loading.
if (typeof window !== "undefined") {
  try {
    sessionStorage.removeItem(FORM_STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear stale formData payload on load:", err);
  }
}

/**
 * Turns a FormData into a plain object suitable for JSON.stringify.
 * If a key appears multiple times (e.g. "images" appended several times),
 * all values are collected into an array for that key.
 */
export function formDataToStorable(formData: FormData): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of formData.entries()) {
    const normalized =
      value instanceof File
        ? { __isFile: true, name: value.name, size: value.size, type: value.type }
        : value; // string values (JSON.stringify'd fields, primitives, etc.)

    if (key in result) {
      // Key already seen — turn into / push onto an array.
      if (Array.isArray(result[key])) {
        result[key].push(normalized);
      } else {
        result[key] = [result[key], normalized];
      }
    } else {
      result[key] = normalized;
    }
  }

  return result;
}

/** Saves the FormData payload to sessionStorage. */
export function saveFormDataToSession(formData: FormData) {
  try {
    const storable = formDataToStorable(formData);
    sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(storable));
  } catch (err) {
    console.error("Failed to save formData payload to sessionStorage:", err);
  }
}

/** Reads the saved payload back from sessionStorage (or null). */
export function getFormDataFromSession(): Record<string, any> | null {
  try {
    const raw = sessionStorage.getItem(FORM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Failed to read formData payload from sessionStorage:", err);
    return null;
  }
}

/** Removes the saved payload from sessionStorage. */
export function clearFormDataFromSession() {
  try {
    sessionStorage.removeItem(FORM_STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear formData payload from sessionStorage:", err);
  }
}

/** Reads + console.logs the payload in one call — handy for quick debugging. */
export function logFormDataFromSession() {
  const data = getFormDataFromSession();
  console.log("FormData payload from sessionStorage 👉", data);
  return data;
}