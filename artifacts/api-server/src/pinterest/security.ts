import dns from "node:dns/promises";
import net from "node:net";
import { URL } from "node:url";

const PINTEREST_HOSTS = new Set([
  "pinterest.com",
  "www.pinterest.com",
  "pin.it",
  "pinterest.co.uk",
  "pinterest.ca",
  "pinterest.de",
  "pinterest.fr",
  "pinterest.com.au",
]);

const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "igshid",
]);

export function normalizePinterestUrl(value: string): string {
  const url = new URL(value.trim());
  if (url.protocol !== "https:" || !isPinterestHost(url.hostname)) {
    throw new Error("invalid_url");
  }
  for (const key of [...url.searchParams.keys()]) {
    if (TRACKING_PARAMS.has(key.toLowerCase())) url.searchParams.delete(key);
  }
  url.hash = "";
  return url.toString();
}

export function isPinterestHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  return PINTEREST_HOSTS.has(host) || host.endsWith(".pinterest.com");
}

export function isAllowedMediaHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  return host.endsWith(".pinimg.com") || host.endsWith(".pinterest.com");
}

function isPublicIp(address: string): boolean {
  if (net.isIPv4(address)) {
    const [a, b] = address.split(".").map(Number);
    return !(
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a === 0
    );
  }
  if (net.isIPv6(address)) {
    const normalized = address.toLowerCase();
    return normalized !== "::1" && !normalized.startsWith("fe80:") && !normalized.startsWith("fc") && !normalized.startsWith("fd");
  }
  return false;
}

export async function assertPublicHost(hostname: string): Promise<void> {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (!host || host === "localhost" || host === "metadata.google.internal") throw new Error("blocked_host");
  if (net.isIP(host)) {
    if (!isPublicIp(host)) throw new Error("blocked_host");
    return;
  }
  const records = await dns.lookup(host, { all: true, verbatim: true });
  if (!records.length || records.some(({ address }) => !isPublicIp(address))) throw new Error("blocked_host");
}

export async function assertSafePinterestUrl(value: string): Promise<URL> {
  const url = new URL(value);
  if (url.protocol !== "https:" || !isPinterestHost(url.hostname)) throw new Error("invalid_url");
  await assertPublicHost(url.hostname);
  return url;
}

export async function assertSafeMediaUrl(value: string): Promise<URL> {
  const url = new URL(value);
  if (url.protocol !== "https:" || !isAllowedMediaHost(url.hostname)) throw new Error("blocked_media");
  await assertPublicHost(url.hostname);
  return url;
}