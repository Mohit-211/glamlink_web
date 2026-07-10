// formDataSessionStorage.ts
// Converts a FormData instance into a plain, JSON-serializable object
// (File entries are summarized as {name, size, type} since actual file
// bytes can't go into sessionStorage), then saves/reads it.

const FORM_STORAGE_KEY = "glamcard_submit_payload";

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