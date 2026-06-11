import { NextResponse } from "next/server";
import { getAccessToken } from "../../../lib/thumbtack-auth";

export const runtime = "nodejs";

// Minimal proxy to fetch Pros + widgets.requestFlowURL.
// IMPORTANT: Do not log or persist any lead data. This endpoint only returns Pro metadata.

// NOTE: developers.thumbtack.com is the docs site (not the API host). A 404 HTML page usually means
// we're hitting the wrong host/path.
const THUMBTACK_API_BASE_URL_RAW =
  process.env.THUMBTACK_API_BASE_URL || process.env.THUMBTACK_BASE_URL || "";

function normalizeBaseUrl(raw: string) {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "";
  // Avoid surprises when building URLs with `new URL(path, base)`.
  return trimmed.replace(/\/+$/, "");
}

function assertNoDoubleApiPrefix(baseUrl: string) {
  // If we keep the base URL to the host (recommended), code appends /api/v4.
  // If someone sets base URL including /api/v4, we should fail loudly instead of
  // making calls to /api/v4/api/v4/... and getting confusing 404s.
  const u = new URL(baseUrl);
  const p = u.pathname.replace(/\/+$/, "");
  if (p.endsWith("/api/v4")) {
    throw new Error(
      "THUMBTACK_API_BASE_URL should be the host only (e.g. https://staging-pro-api.thumbtack.com). Do not include /api/v4."
    );
  }
}

const THUMBTACK_API_BASE_URL = normalizeBaseUrl(THUMBTACK_API_BASE_URL_RAW);

export async function GET(request: Request) {
  try {
    if (!THUMBTACK_API_BASE_URL) {
      throw new Error(
        "Missing THUMBTACK_API_BASE_URL (Thumbtack API host). developers.thumbtack.com is docs-only."
      );
    }

    assertNoDoubleApiPrefix(THUMBTACK_API_BASE_URL);

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const zip = searchParams.get("zip") || "";
    const clickId = (searchParams.get("clickId") || "").trim();

    if (!query && !zip) {
      return NextResponse.json(
        { ok: false, error: "Provide query or zip" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    // OAuth2 client_credentials exchange. getAccessToken caches in memory
    // until the token's TTL (typically 3600s) minus a 60s buffer.
    const accessToken = await getAccessToken();

    // Thumbtack docs call out /businesses/search returning widgets.requestFlowURL.
    // Their current Partner Platform is versioned under /api/v4.
    // Note: this endpoint is **POST** on the Partner Platform (GET returns 405).
    const url = new URL("/api/v4/businesses/search", THUMBTACK_API_BASE_URL);

    // Thumbtack validates camelCase fields: zipCode (not zip_code) and a
    // required utmData object. utmData is also how the FlexOffers ClickID is
    // attributed back in Thumbtack reports (utmContent carries the ClickID).
    const utmCampaign = query || "general";
    // Thumbtack quirk: the top-level fields are camelCase (zipCode, utmData)
    // but the keys *inside* utmData are snake_case (utm_source, ...).
    // utm_source must match Thumbtack's partner-source pattern
    // ^cma-[a-zA-Z0-9-_]+$ — Thumbtack assigns this code. Override the value
    // via THUMBTACK_UTM_SOURCE once Thumbtack provides the real one.
    const utmSource = (process.env.THUMBTACK_UTM_SOURCE || "cma-househelperpros").trim();
    const utmData: Record<string, string> = {
      utm_source: utmSource,
      utm_medium: "flexoffers",
      utm_campaign: utmCampaign,
    };
    if (clickId) utmData.utm_content = clickId;

    const body = JSON.stringify({
      ...(query ? { searchQuery: query } : {}),
      ...(zip ? { zipCode: zip } : {}),
      utmData,
    });

    const resp = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
      cache: "no-store",
    });

    const contentType = resp.headers.get("content-type") || "";

    const text = await resp.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      // leave as text
    }

    if (!resp.ok) {
      // Guardrail: if we ever get HTML back, we likely hit the docs site or wrong host.
      const looksLikeHtml =
        contentType.toLowerCase().includes("text/html") ||
        /^\s*</.test(text);

      // Safe to log request metadata only (no lead data).
      console.warn("[thumbtack] non-2xx", {
        status: resp.status,
        url: url.toString(),
        contentType,
        looksLikeHtml,
      });

      // Prefer surfacing the upstream HTTP status to the client.
      // (We still include the upstream status in JSON for convenience.)
      return NextResponse.json(
        {
          ok: false,
          status: resp.status,
          error: "Thumbtack request failed",
          contentType,
          looksLikeHtml,
          body: data ?? text,
        },
        { status: resp.status, headers: { "Cache-Control": "no-store" } }
      );
    }

    // Decorate each pro's Request Flow URL with attribution params so Thumbtack
    // reports back the FlexOffers ClickID for each lead. utm_content carries
    // the ClickID; utm_campaign carries the category (or "general").
    if (data && Array.isArray(data.data)) {
      for (const pro of data.data) {
        const raw = pro?.widgets?.requestFlowURL;
        if (typeof raw !== "string" || !raw) continue;
        try {
          const u = new URL(raw);
          u.searchParams.set("utm_source", "househelperpros");
          u.searchParams.set("utm_medium", "flexoffers");
          u.searchParams.set("utm_campaign", utmCampaign);
          if (clickId) u.searchParams.set("utm_content", clickId);
          pro.widgets.requestFlowURL = u.toString();
        } catch {
          // Leave URL untouched if Thumbtack ever returns a non-URL value.
        }
      }
    }

    // Do not log response body; return to client.
    return NextResponse.json({ ok: true, ...data }, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Unknown error" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
