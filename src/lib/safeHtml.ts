/*
 * A second line of defence for rich text the API has already cleaned (a page's
 * "about", cleaned on save like the card bio). It drops what can run script:
 * script-bearing elements, event-handler and style attributes, and links that
 * are not web, mail or phone links. The API's sanitizer stays the real guard.
 */

const BLOCKED = "script|style|iframe|frame|frameset|object|embed|svg|math|template|noscript|form|input|textarea|button|select|option|link|meta|base";

const BLOCKED_WITH_CONTENT = new RegExp(`<(${BLOCKED})\\b[^>]*>[\\s\\S]*?<\\/\\1\\s*>`, "gi");
const BLOCKED_TAG = new RegExp(`<\\/?(?:${BLOCKED})\\b[^>]*>`, "gi");
const EVENT_OR_STYLE_ATTR = /\s+(?:on[a-z]+|style|srcdoc|formaction)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const URL_ATTR = /\s+(href|src|xlink:href)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
const SAFE_URL = /^(?:https?:|mailto:|tel:|\/(?!\/)|#)/i;

/** Decodes the entities a browser would decode before reading a URL (`&#106;avascript:`). */
function decodeEntities(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);?/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);?/g, (_, dec) => String.fromCodePoint(Number.parseInt(dec, 10)))
    .replace(/&colon;/gi, ":")
    .replace(/&tab;|&newline;/gi, "");
}

export function stripUnsafeHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(BLOCKED_WITH_CONTENT, "")
    .replace(BLOCKED_TAG, "")
    .replace(EVENT_OR_STYLE_ATTR, "")
    .replace(URL_ATTR, (match, _name, dq, sq, bare) => {
      // Control characters and spaces are ignored by browsers inside a URL scheme
      const url = decodeEntities(String(dq ?? sq ?? bare ?? "")).replace(/[\u0000- ]/g, "");
      return SAFE_URL.test(url) ? match : "";
    });
}

/** Plain text from rich text, for descriptions and previews. */
export function htmlToText(html: string | null | undefined): string {
  if (!html) return "";
  return decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
