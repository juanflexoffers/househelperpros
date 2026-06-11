// OAuth2 client_credentials token exchange for the Thumbtack Partner API.
// Per Thumbtack docs: Basic-auth POST to the env-specific /oauth2/token
// endpoint with grant_type=client_credentials + audience=urn:partner-api
// returns an access_token (TTL ~3600s) that we then use as a Bearer for
// API calls like /api/v4/businesses/search.
//
// Tokens are cached in module-scope memory. Vercel reuses warm Lambda
// instances across requests, so a cached token survives between calls
// until the instance recycles or the TTL expires.

let cached: { token: string; expiresAt: number } | null = null;

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === "") throw new Error(`Missing env var: ${name}`);
  return v.trim();
}

function defaultTokenUrl(): string {
  const env = (process.env.THUMBTACK_ENV || "").trim().toLowerCase();
  const isProd = env === "production" || env === "prod";
  return isProd
    ? "https://auth.thumbtack.com/oauth2/token"
    : "https://staging-auth.thumbtack.com/oauth2/token";
}

export async function getAccessToken(): Promise<string> {
  // Escape hatch: a manually set access token always wins, useful for
  // local debugging or pinning a known-good token from the partner portal.
  const override = (process.env.THUMBTACK_ACCESS_TOKEN || "").trim();
  if (override) return override;

  const now = Date.now();
  if (cached && cached.expiresAt > now + 60_000) return cached.token;

  const tokenUrl =
    (process.env.THUMBTACK_OAUTH_TOKEN_URL || "").trim() || defaultTokenUrl();
  const clientId = requireEnv("THUMBTACK_CLIENT_ID");
  const clientSecret = requireEnv("THUMBTACK_CLIENT_SECRET");
  const audience = (process.env.THUMBTACK_OAUTH_AUDIENCE || "urn:partner-api").trim();
  const scopes = (process.env.THUMBTACK_OAUTH_SCOPES || "").trim();

  const form = new URLSearchParams({
    grant_type: "client_credentials",
    audience,
  });
  if (scopes) form.set("scope", scopes);

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const resp = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: form.toString(),
    cache: "no-store",
  });

  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(
      `OAuth token exchange failed (${resp.status}) at ${tokenUrl}: ${text}`
    );
  }

  let json: { access_token?: string; expires_in?: number };
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(
      `OAuth token endpoint returned non-JSON: ${text.slice(0, 200)}`
    );
  }

  if (!json.access_token) {
    throw new Error("OAuth token endpoint returned no access_token");
  }

  const ttlSec = typeof json.expires_in === "number" ? json.expires_in : 3600;
  cached = {
    token: json.access_token,
    expiresAt: Date.now() + ttlSec * 1000,
  };
  return json.access_token;
}
