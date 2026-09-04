# Production ground truth

## Architecture

- Frontend: React 19, Vite 7, Tailwind CSS 4, wouter, TanStack Query,
  react-hook-form and Zod.
- Backend: Node.js/TypeScript, Express 5, pino/pino-http, native `fetch` and
  Node streams.
- Contract: `lib/api-zod` validates the API; `lib/api-client-react` supplies
  generated client hooks.
- Package manager/workspace: pnpm, lockfile retained.

`POST /api/resolve` validates a public Pinterest URL, follows at most three
Pinterest-only redirects, fetches at most 3 MiB of HTML, extracts MP4/M3U8
candidates, validates Pinterest media hosts and DNS addresses, probes the
candidates, and ranks MP4 first then reported height, width, and size.
`GET /api/download/:token` retrieves a 15-minute in-memory token and relays
the selected upstream response through a size-counting stream; it does not
buffer a video in application memory or persist media.

Accepted source hosts are `pin.it`, listed Pinterest country domains,
`pinterest.com`, and `*.pinterest.com`; media is limited to
`*.pinimg.com` and `*.pinterest.com`. Both URLs must be HTTPS and resolve only
to public IPs. Loopback, private IPv4 ranges, link-local IPv4, IPv6 loopback,
IPv6 link-local and ULA ranges, localhost, and Google metadata are rejected.

## Direct dependencies

- API runtime: `express`, `cors`, `pino`, `pino-http`, `@workspace/api-zod`.
- API build/development: `esbuild`, `esbuild-plugin-pino`, Pino formatting and
  TypeScript type packages.
- Frontend build/runtime: React, React DOM, Vite, Tailwind, Radix UI,
  React Query, wouter, react-hook-form, Zod, lucide, and workspace API client.
- Root build tooling: TypeScript and Prettier.

No direct dependency was proven unused, so none was removed.

## Environment variables

| Variable | Use | Default | Production requirement |
| --- | --- | --- | --- |
| `NODE_ENV` | API CORS behavior/logging | non-production behavior | Set by Vercel |
| `FRONTEND_ORIGIN` | Explicit CORS allow origin | blocks cross-origin production requests when absent | Optional for same-origin deployment; required only for a separate browser origin |
| `LOG_LEVEL` | Pino level | `info` | Optional |
| `MAX_DOWNLOAD_SIZE` | API relay ceiling, bytes | `52428800` | Optional; incompatible with Vercel responses above 4.5 MB |
| `RATE_LIMIT` | Resolve requests/IP/60 s/instance | `10` | Optional |
| `REQUEST_TIMEOUT_MS` | Upstream page/probe/download timeout | `15000` | Optional |
| `PORT` | Local API listener only | `5000` | Not used by Vercel Function |
| `VITE_API_BASE_URL` | Local Vite proxy target only | `http://localhost:5000` | Not a browser production setting |
| `VITE_CONTACT_EMAIL` | Contact page value | `hello@example.com` | Optional |
| `VITE_SITE_URL` | Canonical/structured-data origin, baked at build | `https://example.com` | Required; also replace `example.com` in `robots.txt` and `sitemap.xml` |

## SEO and security

All seven routes are present: `/`, `/pinterest-video-downloader`,
`/how-to-download-pinterest-videos`, `/about`, `/contact`, `/privacy`, and
`/terms`. Page metadata, canonical tags, Open Graph tags and JSON-LD are
implemented in `PageHead`; robots and sitemap are static public assets. The
homepage and tool page have distinct content. Claims that the implementation
could not substantiate (fixed resolutions, audio inspection, bitrate selection,
and timing guarantees) were removed.

The service has host allowlists, DNS/IP SSRF checks, manual redirect handling,
short-lived random tokens, size-limited streaming, request validation,
production CORS fallback, headers, reduced log request data, and an in-memory
per-IP resolver limit. It is not a distributed rate limiter. Vercel proxy IPs
are trusted only when `VERCEL` is set.
