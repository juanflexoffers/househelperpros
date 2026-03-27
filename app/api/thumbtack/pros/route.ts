import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Minimal proxy to fetch Pros + widgets.requestFlowURL.
// IMPORTANT: Do not log or persist any lead data. This endpoint only returns Pro metadata.

// NOTE: developers.thumbtack.com is the docs site (not the API host). A 404 HTML page usually means
// we're hitting the wrong host/path.
const THUMBTACK_API_BASE_URL =
  process.env.THUMBTACK_API_BASE_URL || process.env.THUMBTACK_BASE_URL || "";

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v || v.trim() === "") throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function GET(request: Request) {
  try {
    if (!THUMBTACK_API_BASE_URL) {
      throw new Error(
        "Missing THUMBTACK_API_BASE_URL (Thumbtack API host). developers.thumbtack.com is docs-only."
      );
    }

    // Preferred auth (if Thumbtack provided an access token)
    const accessToken = (process.env.THUMBTACK_ACCESS_TOKEN || "").trim();

    // Back-compat: if only client credentials were provided, we *may* still be able to use Basic.
    const clientId = (process.env.THUMBTACK_CLIENT_ID || "").trim();
    const clientSecret = (process.env.THUMBTACK_CLIENT_SECRET || "").trim();

    if (!accessToken && (!clientId || !clientSecret)) {
      throw new Error(
        "Missing auth. Set THUMBTACK_ACCESS_TOKEN (preferred) or THUMBTACK_CLIENT_ID + THUMBTACK_CLIENT_SECRET."
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const zip = searchParams.get("zip") || "";

    if (!query && !zip) {
      return NextResponse.json(
        { ok: false, error: "Provide query or zip" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    // Thumbtack docs call out /businesses/search returning widgets.requestFlowURL.
    // Exact path/version may vary by account; we keep it configurable via base URL.
    const url = new URL("/businesses/search", THUMBTACK_API_BASE_URL);
    if (query) url.searchParams.set("query", query);
    if (zip) url.searchParams.set("zip_code", zip);

    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    } else {
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
      headers.Authorization = `Basic ${auth}`;
    }

    const resp = await fetch(url.toString(), {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const text = await resp.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      // leave as text
    }

    if (!resp.ok) {
      return NextResponse.json(
        {
          ok: false,
          status: resp.status,
          error: "Thumbtack request failed",
          body: data ?? text,
        },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
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
