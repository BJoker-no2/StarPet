import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Local mirror of Google's OIDC discovery document.
// This prevents NextAuth's server-side discovery request from timing out
// on networks that can't reach `accounts.google.com`.
export function GET() {
  return NextResponse.json({
    issuer: "https://accounts.google.com",
    authorization_endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    token_endpoint: "https://oauth2.googleapis.com/token",
    userinfo_endpoint: "https://openidconnect.googleapis.com/v1/userinfo",
    jwks_uri: "https://www.googleapis.com/oauth2/v3/certs",
    // Optional but commonly present fields (kept minimal).
    response_types_supported: ["code"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
  });
}
