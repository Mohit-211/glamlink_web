// URL-safe base64 encode/decode for ids used in shareable links (e.g. /journal/shop/[id]).
export function encodeId(id: string | number): string {
  const base64 =
    typeof window !== "undefined"
      ? window.btoa(String(id))
      : Buffer.from(String(id)).toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeId(encoded: string): string {
  let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  try {
    return typeof window !== "undefined"
      ? window.atob(base64)
      : Buffer.from(base64, "base64").toString("utf-8");
  } catch {
    return encoded;
  }
}
