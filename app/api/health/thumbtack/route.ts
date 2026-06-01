import { NextResponse } from "next/server";
import { getAccessToken } from "../../../lib/thumbtack-auth";

export const runtime = "nodejs";

// GET /api/health/thumbtack         → checks env vars only (cheap)
// GET /api/health/thumbtack?probe=1 → also performs an OAuth token-exchange
//                                     dry-run to confirm credentials work
//                                     end-to-end. Hits the auth host, not the
//                                     business endpoints.

export async function GET(request: Request) {
  const hasBaseUrl = !!(process.env.THUMBTACK_API_BASE_URL || "").trim();
  const hasAccessToken = !!(process.env.THUMBTACK_ACCESS_TOKEN || "").trim();
  const hasClientCreds =
    !!(process.env.THUMBTACK_CLIENT_ID || "").trim() &&
    !!(process.env.THUMBTACK_CLIENT_SECRET || "").trim();
  const hasScopes = !!(process.env.THUMBTACK_OAUTH_SCOPES || "").trim();

  const missing: string[] = [];
  if (!hasBaseUrl) missing.push("THUMBTACK_API_BASE_URL");
  if (!hasAccessToken && !hasClientCreds) {
    missing.push(
      "THUMBTACK_ACCESS_TOKEN (override) OR THUMBTACK_CLIENT_ID+THUMBTACK_CLIENT_SECRET"
    );
  }

  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, missing },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  const { searchParams } = new URL(request.url);
  const shouldProbe = searchParams.get("probe") === "1";

  if (!shouldProbe) {
    return NextResponse.json(
      { ok: true, hasAccessToken, hasClientCreds, hasScopes },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }

  // Dry-run the OAuth exchange to confirm credentials work. This intentionally
  // does NOT return the access_token in the response — only success/failure.
  try {
    await getAccessToken();
    return NextResponse.json(
      { ok: true, probed: true, hasScopes },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, probed: true, error: e?.message || "Token exchange failed" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
