import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Minimal proxy to fetch Pros + widgets.requestFlowURL.
// IMPORTANT: Do not log or persist any lead data. This endpoint only returns Pro metadata.

const THUMBTACK_BASE_URL = process.env.THUMBTACK_BASE_URL || "https://developers.thumbtack.com";

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v || v.trim() === "") throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function GET(request: Request) {
  try {
    const clientId = requireEnv("THUMBTACK_CLIENT_ID");
    const clientSecret = requireEnv("THUMBTACK_CLIENT_SECRET");

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
    // We pass through query params; exact schema may vary by Thumbtack account.
    const url = new URL("/api/v1/businesses/search", THUMBTACK_BASE_URL);
    if (query) url.searchParams.set("query", query);
    if (zip) url.searchParams.set("zip_code", zip);

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const resp = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
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
