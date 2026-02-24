import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
      // Avoid server-side fetch to `accounts.google.com` for OIDC discovery in restricted networks.
      // NOTE: If your network also blocks Google token/jwks/userinfo endpoints, the callback step will still fail.
      wellKnown: `${process.env.NEXTAUTH_URL}/api/auth/google/.well-known/openid-configuration`,
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
