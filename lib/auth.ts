import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const baseUrl =
  process.env.NEXTAUTH_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

const googleWellKnown =
  process.env.GOOGLE_WELLKNOWN_URL ??
  ((process.env.USE_LOCAL_GOOGLE_WELLKNOWN === "1" ||
    baseUrl?.startsWith("http://localhost") ||
    baseUrl?.startsWith("http://127.0.0.1")) &&
  baseUrl
    ? new URL(
        "/api/auth/google/.well-known/openid-configuration",
        baseUrl,
      ).toString()
    : undefined);

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      httpOptions: {
        timeout: 30000,
      },
      // Prefer a local discovery doc to avoid a server-side fetch during OIDC discovery
      // (useful in restricted networks). Falls back to the provider default if we can't
      // determine a stable base URL.
      ...(googleWellKnown ? { wellKnown: googleWellKnown } : {}),
      // Make sure user sees Google auth UI again after logout.
      authorization: {
        params: {
          prompt: "consent select_account",
        },
      },
    }),
  ],
  // JWT keeps this setup stateless; no DB required.
  session: { strategy: "jwt" },
};
