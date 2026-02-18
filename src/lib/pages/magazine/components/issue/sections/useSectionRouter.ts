/**
 * Normalize image fields from objects to strings
 * Preserves the object if objectFit, originalUrl, or cropData is present
 * Also preserves link-action fields (objects with 'action' property)
 *
 * @param content - Any content object that may contain image fields
 * @returns Normalized content with image URLs extracted where appropriate
 */
export const normalizeImageFields = (content: any): any => {
  if (!content) return content;

  // Handle primitive values
  if (typeof content !== "object") return content;

  // Handle arrays
  if (Array.isArray(content)) {
    return content.map((item) => normalizeImageFields(item));
  }

  // Handle objects
  const normalized = { ...content };
  Object.keys(normalized).forEach((key) => {
    const value = normalized[key];

    // If it's an image object with url property (but not a link-action field)
    if (value && typeof value === "object" && "url" in value && !Array.isArray(value) && typeof value.url === "string") {
      // Check if this is a link-action field (has 'action' property)
      if ("action" in value) {
        // This is a link-action field, preserve the full object
        normalized[key] = value;
      } else if ("objectFit" in value || "originalUrl" in value || "cropData" in value) {
        // Keep the full object to preserve objectFit and crop data
        normalized[key] = value;
      } else {
        // Extract just the URL for backward compatibility
        normalized[key] = value.url || "";
      }
    } else if (Array.isArray(value)) {
      // Recursively handle arrays
      normalized[key] = value.map((item) => normalizeImageFields(item));
    } else if (value && typeof value === "object" && value !== null) {
      // Recursively handle nested objects
      normalized[key] = normalizeImageFields(value);
    }
  });

  return normalized;
};
