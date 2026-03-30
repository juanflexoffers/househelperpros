import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const required = [
    "THUMBTACK_API_BASE_URL",
    // auth: prefer access token; fall back to client creds
    "THUMBTACK_ACCESS_TOKEN",
    "THUMBTACK_CLIENT_ID",
    "THUMBTACK_CLIENT_SECRET",
  ] as const;

  const hasBaseUrl = !!(process.env.THUMBTACK_API_BASE_URL || "").trim();
  const hasAccessToken = !!(process.env.THUMBTACK_ACCESS_TOKEN || "").trim();
  const hasClientCreds =
    !!(process.env.THUMBTACK_CLIENT_ID || "").trim() &&
    !!(process.env.THUMBTACK_CLIENT_SECRET || "").trim();

  const missing: string[] = [];
  if (!hasBaseUrl) missing.push("THUMBTACK_API_BASE_URL");
  if (!hasAccessToken && !hasClientCreds) {
    missing.push("THUMBTACK_ACCESS_TOKEN (preferred) OR THUMBTACK_CLIENT_ID+THUMBTACK_CLIENT_SECRET");
  }

  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, missing },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  return NextResponse.json(
    { ok: true },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
