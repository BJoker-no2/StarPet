import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import https from "node:https";
import { HttpsProxyAgent } from "https-proxy-agent";

export const runtime = "nodejs";

// On Vercel, `VERCEL_URL` is available after deployment (no protocol).
// This lets us avoid hardcoding NEXTAUTH_URL for preview/prod deployments.
if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}

declare global {
  // eslint-disable-next-line no-var
  var __proxyAgentInstalled: boolean | undefined;
}

function ensureServerProxyAgent() {
  if (globalThis.__proxyAgentInstalled) return;
  globalThis.__proxyAgentInstalled = true;

  const proxy =
    process.env.HTTPS_PROXY ?? process.env.HTTP_PROXY ?? process.env.ALL_PROXY;
  if (!proxy) return;

  // NextAuth/openid-client uses node:https under the hood. Setting the globalAgent
  // ensures all outgoing HTTPS requests go through the proxy.
  https.globalAgent = new HttpsProxyAgent(proxy);
}

ensureServerProxyAgent();

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
