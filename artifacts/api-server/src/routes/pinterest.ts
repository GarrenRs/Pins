import { Router, type IRouter } from "express";
import { DownloadPinterestVideoParams, ResolvePinterestPinBody, ResolvePinterestPinResponse } from "@workspace/api-zod";
import { logger } from "../lib/logger";
import { PinterestResolver, ResolverError } from "../pinterest/resolver";
import { DownloadRegistry, streamVideoDownload } from "../services/download-registry";

const router: IRouter = Router();
const registry = new DownloadRegistry();
const resolver = new PinterestResolver(Number(process.env.REQUEST_TIMEOUT_MS ?? 15000));
const maxDownloadSize = Number(process.env.MAX_DOWNLOAD_SIZE ?? 50 * 1024 * 1024);
const buckets = new Map<string, number[]>();

/* ── Rate-limiter with periodic cleanup ────────────────────────────── */
const RATE_WINDOW_MS = 60_000;
const CLEANUP_INTERVAL_MS = 5 * 60_000; // sweep every 5 minutes

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const values = (buckets.get(ip) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  if (values.length >= Number(process.env.RATE_LIMIT ?? 10)) {
    buckets.set(ip, values);
    return true;
  }
  values.push(now);
  buckets.set(ip, values);
  return false;
}

// Prevent unbounded memory growth: periodically purge expired entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of buckets) {
    const active = timestamps.filter((t) => now - t < RATE_WINDOW_MS);
    if (active.length === 0) buckets.delete(ip);
    else buckets.set(ip, active);
  }
}, CLEANUP_INTERVAL_MS).unref();

const publicErrors: Record<string, { status: number; message: string }> = {
  invalid_url: { status: 400, message: "Enter a valid Pinterest URL." },
  pin_not_found: { status: 422, message: "We couldn't find that Pin." },
  no_video: { status: 422, message: "We couldn't find a downloadable video in this Pin." },
  temporary_error: { status: 503, message: "Pinterest is temporarily unavailable. Please try again." },
  resolve_failed: { status: 422, message: "That Pinterest link could not be resolved." },
};

router.post("/resolve", async (req, res) => {
  const ip = req.ip || "unknown";
  if (rateLimited(ip)) return res.status(429).json({ error: { code: "rate_limit", message: "Too many requests. Please try again shortly." } });
  const parsed = ResolvePinterestPinBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: { code: "invalid_request", message: "Enter a valid Pinterest URL." } });
  const started = Date.now();
  try {
    const result = await resolver.resolve(parsed.data.url);
    const token = registry.issue(result.candidate);
    const response = ResolvePinterestPinResponse.parse({
      success: true,
      pin: { id: result.pinId, title: result.title },
      media: {
        type: "video",
        format: result.candidate.format,
        quality: result.candidate.height ? `${result.candidate.height}p` : null,
        width: result.candidate.width,
        height: result.candidate.height,
        size: result.candidate.size,
        download_url: `/api/download/${token}`,
      },
    });
    req.log.info({ durationMs: Date.now() - started, success: true }, "Pinterest resolve completed");
    return res.json(response);
  } catch (error) {
    const code = error instanceof ResolverError ? error.code : "temporary_error";
    req.log.info({ durationMs: Date.now() - started, code }, "Pinterest resolve failed");
    const publicError = publicErrors[code] ?? publicErrors.temporary_error;
    return res.status(publicError.status).json({ error: { code, message: publicError.message } });
  }
});

router.get("/download/:token", async (req, res) => {
  const parsed = DownloadPinterestVideoParams.safeParse(req.params);
  const entry = parsed.success ? registry.get(parsed.data.token) : null;
  if (!entry) return res.status(404).json({ error: { code: "download_expired", message: "This download is no longer available." } });
  try {
    await streamVideoDownload(entry, res, maxDownloadSize, Number(process.env.REQUEST_TIMEOUT_MS ?? 15000));
    return;
  } catch (error) {
    logger.info({ error: error instanceof Error ? error.message : "unknown" }, "Pinterest download failed");
    if (!res.headersSent) {
      const code = error instanceof Error && error.message === "too_large" ? "too_large" : "download_unavailable";
      return res.status(code === "too_large" ? 413 : 502).json({ error: { code, message: code === "too_large" ? "This video is too large to download." : "The video is temporarily unavailable." } });
    }
    return;
  }
});

export default router;