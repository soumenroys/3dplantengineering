// app/lib/client/country.ts

// Small cookie helpers (safe on server because they only touch document inside functions)
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]+)")
  );
  return m ? decodeURIComponent(m[1]) : undefined;
}

const ALLOWED = new Set([
  "US", "UK", "DE", "BR", "CA", "AU", "FR", "MX", "ES", "IT", "NL", "JP", "IN", "PL", "SE",
]);

export function getCookieCountry(): string | undefined {
  const cc = getCookie("country");
  if (cc && ALLOWED.has(cc)) return cc;
  return undefined;
}

export function setCookieCountry(cc: string): void {
  if (typeof document === "undefined") return;
  if (!ALLOWED.has(cc)) return;
  const maxAge = 60 * 60 * 24 * 365; // 1 year
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `country=${cc}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}
