import crypto from "node:crypto";
import { Transform } from "node:stream";
import type { Response } from "express";
import { assertSafeMediaUrl } from "../pinterest/security";
import type { VideoCandidate } from "../pinterest/resolver";

type Entry = { candidate: VideoCandidate; expiresAt: number };

export class DownloadRegistry {
  private readonly entries = new Map<string, Entry>();

  issue(candidate: VideoCandidate): string {
    this.prune();
    const token = crypto.randomBytes(24).toString("base64url");
    this.entries.set(token, { candidate, expiresAt: Date.now() + 15 * 60 * 1000 });
    return token;
  }

  get(token: string): Entry | null {
    this.prune();
    const entry = this.entries.get(token);
    return entry && entry.expiresAt > Date.now() ? entry : null;
  }

  private prune(): void {
    for (const [token, entry] of this.entries) if (entry.expiresAt <= Date.now()) this.entries.delete(token);
  }
}

export async function streamVideoDownload(entry: Entry, response: Response, maxBytes: number, timeoutMs: number): Promise<void> {
  const url = await assertSafeMediaUrl(entry.candidate.url);
  const upstream = await fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(timeoutMs),
    headers: { "User-Agent": "PinSave/1.0", Accept: "video/*,application/vnd.apple.mpegurl,*/*;q=0.8" },
  });
  if (!upstream.ok || !upstream.body) throw new Error("upstream_unavailable");
  const contentType = upstream.headers.get("content-type")?.split(";")[0].toLowerCase() ?? "";
  if (entry.candidate.format === "mp4" && !["video/mp4", "application/octet-stream"].includes(contentType) && !contentType.startsWith("video/")) {
    throw new Error("unsupported_format");
  }
  const contentLength = Number(upstream.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) throw new Error("too_large");

  response.status(200);
  response.setHeader("Content-Type", entry.candidate.format === "mp4" ? "video/mp4" : "application/vnd.apple.mpegurl");
  response.setHeader("Content-Disposition", `attachment; filename="pinterest-video.${entry.candidate.format}"`);
  response.setHeader("X-Content-Type-Options", "nosniff");

  let total = 0;
  const limiter = new Transform({
    transform(chunk: Buffer, _encoding, callback) {
      total += chunk.length;
      if (total > maxBytes) callback(new Error("too_large"));
      else callback(null, chunk);
    },
  });
  limiter.on("error", () => response.destroy());
  // Node's fetch body is a Web stream; the response body is converted without buffering.
  const { Readable } = await import("node:stream");
  Readable.fromWeb(upstream.body as import("node:stream/web").ReadableStream).pipe(limiter).pipe(response);
}