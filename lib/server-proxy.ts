import https from "node:https";
import { HttpsProxyAgent } from "https-proxy-agent";

declare global {
  // eslint-disable-next-line no-var
  var __starPetProxyInstalled: boolean | undefined;
}

export function ensureHttpsProxyAgent() {
  if (globalThis.__starPetProxyInstalled) return;
  globalThis.__starPetProxyInstalled = true;

  const proxy =
    process.env.HTTPS_PROXY ?? process.env.HTTP_PROXY ?? process.env.ALL_PROXY;
  if (!proxy) return;

  https.globalAgent = new HttpsProxyAgent(proxy);
}

