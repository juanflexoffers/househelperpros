// Captures and persists the FlexOffers ClickID (`?fobs=`) so it can be
// forwarded to Thumbtack as `utm_content` for lead attribution.

const PARAM = "fobs";
const STORAGE_KEY = "hhp_clickid";
const COOKIE_NAME = "hhp_clickid";
const COOKIE_MAX_AGE_DAYS = 90;

export function captureFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const value = params.get(PARAM)?.trim();
  if (!value) return null;
  persist(value);
  return value;
}

export function getClickId(): string {
  if (typeof window === "undefined") return "";
  try {
    const fromSession = window.sessionStorage.getItem(STORAGE_KEY);
    if (fromSession) return fromSession;
  } catch {
    // sessionStorage may be unavailable (Safari private mode, etc.)
  }
  return readCookie(COOKIE_NAME);
}

function persist(value: string): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, value);
  } catch {
    // ignore; cookie below is the fallback
  }
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    value
  )}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function readCookie(name: string): string {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}
