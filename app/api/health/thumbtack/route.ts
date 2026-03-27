import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const required = ["THUMBTACK_CLIENT_ID", "THUMBTACK_CLIENT_SECRET"] as const;
  const missing = required.filter((k) => !process.env[k] || process.env[k]?.trim() === "");

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
