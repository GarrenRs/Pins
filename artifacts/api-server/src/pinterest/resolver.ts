import { URL } from "node:url";
import { isAllowedMediaHost, assertSafeMediaUrl, assertSafePinterestUrl, normalizePinterestUrl } from "./security";

const MAX_HTML_BYTES = 3 * 1024 * 1024;
const MAX_CANDIDATES = 16;
const PIN_ID_RE = /\/pin\/([0-9]{4,30})(?:\/|$)/i;
const MEDIA_URL_RE = /https?:\\?\/\\?\/[^"'<>\\\s]+?\.(?:mp4|m3u8)(?:\?[^"'<>\\\s]*)?/gi;

export type VideoCandidate = {
  url: string;
  format: "mp4" | "m3u8";
  width: number | null;
  height: number | null;
  size: number | null;
  source: string;
};

export class ResolverError extends Error {
  constructor(public readonly code: "invalid_url" | "pin_not_found" | "no_video" | "temporary_error" | "resolve_failed") {
    super(code);
  }
}

function decodeUrl(value: string): string {
  return value.replace(/\\\//g, "/").replace(/\\u0026/gi, "&").replace(/&amp;/g, "&").replace(/[),.]+$/, "");
}

function inferFormat(value: string): "mp4" | "m3u8" {
  return /\.m3u8(?:$|\?)/i.test(value) ? "m3u8" : "mp4";
}

function dimensions(value: unknown): { width: number | null; height: number | null } {
  if (!value || typeof value !== "object") return { width: null, height: null };
  const item = value as Record<string, unknown>;
  const number = (...keys: string[]) => {
    for (const key of keys) {
      const candidate = item[key];
      if (typeof candidate === "number" && Number.isFinite(candidate) && candidate > 0) return Math.round(candidate);
      if (typeof candidate === "string" && /^\d+$/.test(candidate)) return Number(candidate);
    }
    return null;
  };
  return { width: number("width", "pixelWidth"), height: number("height", "pixelHeight") };
}

function addCandidate(list: VideoCandidate[], seen: Set<string>, value: unknown, meta: unknown, source: string): void {
  if (typeof value !== "string") return;
  const url = decodeUrl(value);
  if (!/^https?:\/\//i.test(url) || !/\.(?:mp4|m3u8)(?:$|\?)/i.test(url) || seen.has(url)) return;
  const size = dimensions(meta);
  list.push({ url, format: inferFormat(url), width: size.width, height: size.height, size: null, source });
  seen.add(url);
}

function walk(value: unknown, path: string[], list: VideoCandidate[], seen: Set<string>, source: string): void {
  if (typeof value === "string") {
    if (path.some((part) => /video|media|source|contenturl/i.test(part))) addCandidate(list, seen, value, null, source);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((child) => walk(child, path, list, seen, source));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (typeof child === "string" && /(?:mp4|m3u8)/i.test(child)) addCandidate(list, seen, child, value, source);
    walk(child, [...path, key], list, seen, source);
  }
}

export function extractCandidates(html: string, pageUrl: string): VideoCandidate[] {
  const candidates: VideoCandidate[] = [];
  const seen = new Set<string>();
  const metaRe = /<meta\b[^>]*(?:property|name)=["'](?:og:video(?::url)?|twitter:player:stream)["'][^>]*content=["']([^"']+)/gi;
  for (const match of html.matchAll(metaRe)) addCandidate(candidates, seen, new URL(decodeUrl(match[1]), pageUrl).toString(), null, "opengraph");

  const scriptRe = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(scriptRe)) {
    const script = match[1];
    for (const media of script.matchAll(MEDIA_URL_RE)) addCandidate(candidates, seen, decodeUrl(media[0]), null, "embedded-json");
    try {
      const parsed = JSON.parse(script);
      walk(parsed, [], candidates, seen, "json");
    } catch {
      // Pinterest frequently wraps state in JavaScript assignment syntax.
    }
  }
  for (const media of html.replace(/\\\//g, "/").matchAll(MEDIA_URL_RE)) addCandidate(candidates, seen, media[0], null, "page");
  return candidates.slice(0, MAX_CANDIDATES);
}

function candidateRank(candidate: VideoCandidate): number[] {
  return [candidate.format === "mp4" ? 1 : 0, candidate.height ?? 0, candidate.width ?? 0, candidate.size ?? 0];
}

export class PinterestResolver {
  constructor(private readonly timeoutMs = 15000) {}

  async resolve(submittedUrl: string): Promise<{ pinId: string | null; title: string | null; candidate: VideoCandidate }> {
    let normalized: string;
    try {
      normalized = normalizePinterestUrl(submittedUrl);
      await assertSafePinterestUrl(normalized);
    } catch {
      throw new ResolverError("invalid_url");
    }

    const { html, finalUrl } = await this.fetchPinterestPage(normalized);
    const pinId = finalUrl.match(PIN_ID_RE)?.[1] ?? normalized.match(PIN_ID_RE)?.[1] ?? null;
    if (!pinId && !new URL(normalized).hostname.endsWith("pin.it")) throw new ResolverError("pin_not_found");
    const title = html.match(/<meta\b[^>]*(?:property|name)=["']og:title["'][^>]*content=["']([^"']+)/i)?.[1] ?? null;
    const candidates = extractCandidates(html, finalUrl);
    const valid: VideoCandidate[] = [];
    for (const candidate of candidates) {
      if (!isAllowedMediaHost(new URL(candidate.url).hostname)) continue;
      try {
        await assertSafeMediaUrl(candidate.url);
        const probed = await this.probe(candidate);
        if (probed) valid.push(probed);
      } catch {
        // One inaccessible media candidate should not hide other formats.
      }
    }
    valid.sort((a, b) => {
      const left = candidateRank(a);
      const right = candidateRank(b);
      for (let i = 0; i < left.length; i++) if (left[i] !== right[i]) return right[i] - left[i];
      return 0;
    });
    if (!valid[0]) throw new ResolverError("no_video");
    return { pinId, title, candidate: valid[0] };
  }

  private async fetchPinterestPage(startUrl: string): Promise<{ html: string; finalUrl: string }> {
    let current = startUrl;
    for (let attempt = 0; attempt < 4; attempt++) {
      const url = await assertSafePinterestUrl(current);
      const response = await fetch(url, {
        redirect: "manual",
        signal: AbortSignal.timeout(this.timeoutMs),
        headers: { "User-Agent": "PinSave/1.0 (+https://www.pinterest.com/)", Accept: "text/html,application/xhtml+xml" },
      });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        if (!location) throw new ResolverError("resolve_failed");
        current = new URL(location, url).toString();
        continue;
      }
      if (response.status === 404) throw new ResolverError("pin_not_found");
      if (response.status >= 500) throw new ResolverError("temporary_error");
      if (!response.ok) throw new ResolverError("resolve_failed");
      const buffer = await response.arrayBuffer();
      if (buffer.byteLength > MAX_HTML_BYTES) throw new ResolverError("resolve_failed");
      return { html: new TextDecoder().decode(buffer), finalUrl: url.toString() };
    }
    throw new ResolverError("resolve_failed");
  }

  private async probe(candidate: VideoCandidate): Promise<VideoCandidate | null> {
    const response = await fetch(candidate.url, {
      method: "HEAD",
      redirect: "manual",
      signal: AbortSignal.timeout(this.timeoutMs),
      headers: { "User-Agent": "PinSave/1.0", Accept: "video/*,application/vnd.apple.mpegurl,*/*;q=0.8" },
    });
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    const length = Number(response.headers.get("content-length"));
    const isVideo = candidate.format === "m3u8" || contentType.startsWith("video/") || contentType.includes("mpegurl") || contentType === "application/octet-stream";
    if (response.ok && isVideo) return { ...candidate, size: Number.isFinite(length) && length > 0 ? length : null };
    return null;
  }
}