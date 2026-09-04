# Pindrop

A free, fast, privacy-conscious Pinterest video downloader.

Paste any Pinterest Pin link — Pindrop finds the video, shows you a preview, and lets you download the MP4 directly to your device. No account required. No extensions. No redirects.

---

## What it does

- Resolves public Pinterest Pin URLs and short `pin.it` share links
- Fetches the highest-quality video source available from Pinterest's CDN
- Streams the video directly to the user's browser — no copy is stored server-side
- Provides a preview before download
- Protects against SSRF by validating all resolved URLs against an allowlist and blocking private/local IP ranges

---

## Technology stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, wouter (routing), TanStack Query |
| Backend | Node.js, Express 5, TypeScript, pino (logging) |
| API contract | OpenAPI 3 (Orval-generated React hooks + Zod schemas) |
| Monorepo | pnpm workspaces |
| Package manager | pnpm |

---

## Project structure

```
pindrop/
├── artifacts/
│   ├── api-server/          # Express backend — Pinterest resolver, download registry
│   │   ├── src/
│   │   │   ├── app.ts       # Express app, CORS, security headers
│   │   │   ├── index.ts     # Server entry point
│   │   │   ├── pinterest/   # resolver.ts, security.ts
│   │   │   ├── routes/      # health.ts, pinterest.ts, index.ts
│   │   │   └── services/    # download-registry.ts
│   │   ├── .env.example
│   │   └── package.json
│   │
│   ├── pinterest-video-downloader/  # React frontend application
│   │   ├── src/
│   │   │   ├── App.tsx      # Root — routing, homepage
│   │   │   ├── pages/       # about, contact, privacy, terms, how-to, pvd
│   │   │   ├── components/  # layout, page-head, UI components
│   │   │   └── lib/         # seo.ts, utils.ts
│   │   ├── public/          # sitemap.xml, robots.txt, favicon
│   │   ├── .env.example
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── mockup-sandbox/      # Isolated UI development sandbox (not deployed)
│
├── lib/
│   ├── api-spec/            # openapi.yaml — single source of truth
│   ├── api-client-react/    # Orval-generated React Query hooks
│   ├── api-zod/             # Orval-generated Zod schemas
│   └── db/                  # Drizzle ORM setup (schema is empty — not used)
│
├── docs/
│   ├── local-environment.md
│   ├── replit-cleanup-audit.md
│   ├── seo-audit.md
│   └── competitor-seo-analysis.md
│
├── pnpm-workspace.yaml
└── package.json
```

---

## Requirements

| Tool | Minimum version |
|---|---|
| Node.js | 18.x or newer (tested on 24.x) |
| pnpm | 9.x or newer |

Install pnpm globally if not already installed:

```bash
npm install -g pnpm
```

---

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd pindrop

# Install all workspace dependencies
pnpm install
```

---

## Environment variables

### API server

Copy `.env.example` and configure:

```bash
cp artifacts/api-server/.env.example artifacts/api-server/.env
```

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port the API server listens on |
| `NODE_ENV` | `development` | `development` or `production` |
| `FRONTEND_ORIGIN` | *(auto in dev)* | Exact frontend origin for CORS (required in production) |
| `LOG_LEVEL` | `info` | Pino log level |
| `MAX_DOWNLOAD_SIZE` | `52428800` | Max video stream size in bytes (50 MB) |

### Frontend

Copy `.env.example` and configure:

```bash
cp artifacts/pinterest-video-downloader/.env.example artifacts/pinterest-video-downloader/.env
```

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5000` | API server URL (dev proxy is used if left as-is) |
| `VITE_CONTACT_EMAIL` | `hello@pindrop.app` | Email displayed on the `/contact` page |

---

## Local development

Start the API server and frontend in separate terminals:

**Terminal 1 — API server:**
```bash
cd artifacts/api-server
pnpm dev
# Server starts at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd artifacts/pinterest-video-downloader
pnpm dev
# Dev server starts at http://localhost:5173
```

Vite proxies all `/api` requests to `http://localhost:5000` automatically — no manual CORS configuration needed during development.

Open `http://localhost:5173` in your browser.

### Health check

```bash
curl http://localhost:5000/api/healthz
# → {"status":"ok"}
```

---

## TypeScript checks

```bash
# Check all packages
pnpm typecheck

# Check frontend only
pnpm --filter @workspace/pinterest-video-downloader run typecheck

# Check api-server only
pnpm --filter @workspace/api-server run typecheck
```

---

## Production build

```bash
# Build frontend (outputs to artifacts/pinterest-video-downloader/dist/public/)
PORT=5173 pnpm --filter @workspace/pinterest-video-downloader run build

# Build API server (outputs to artifacts/api-server/dist/)
pnpm --filter @workspace/api-server run build

# Or build everything at once
pnpm build
```

---

## Running the production build locally

**API server:**
```bash
PORT=5000 NODE_ENV=production node --enable-source-maps artifacts/api-server/dist/index.mjs
```

**Frontend:**
Serve the static `artifacts/pinterest-video-downloader/dist/public/` directory with any static file server. For a quick local test:
```bash
npx serve artifacts/pinterest-video-downloader/dist/public
```

---

## Deployment preparation

Before deploying:

1. **Set `FRONTEND_ORIGIN`** in the API server environment to your exact frontend URL (e.g. `https://pindrop.app`).
2. **Update `SITE_URL`** in [`artifacts/pinterest-video-downloader/src/lib/seo.ts`](artifacts/pinterest-video-downloader/src/lib/seo.ts) to your production domain.
3. **Update `sitemap.xml`** at [`artifacts/pinterest-video-downloader/public/sitemap.xml`](artifacts/pinterest-video-downloader/public/sitemap.xml) with your production domain.
4. **Update `robots.txt`** Sitemap directive with your production domain.
5. **Set `VITE_CONTACT_EMAIL`** to a real address before building.
6. Never commit `.env` files.

---

## Security architecture

The following protections are in place and must not be weakened:

- **SSRF protection**: DNS resolution + private IP range blocklist in `artifacts/api-server/src/pinterest/security.ts`
- **Domain allowlist**: Only `*.pinterest.com` and `*.pinimg.com` URLs are processed
- **URL validation**: Zod schema on every API request; no user-supplied strings passed unsanitized
- **Download tokens**: Short-lived `crypto.randomBytes(24)` tokens expire in 15 minutes
- **Rate limiting**: 10 req/min/IP (in-memory; no Redis required)
- **Max download size**: 50 MB limit on streamed responses
- **Security headers**: `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Permissions-Policy`
- **CORS**: Strict origin allowlist in production

---

## Responsible use

Pindrop processes publicly accessible Pinterest links. Only download content you own, have created, or are otherwise authorized or legally permitted to save. This tool is not affiliated with, endorsed by, or connected to Pinterest, Inc. in any way.

---

## Legal pages

- `/privacy` — Privacy policy
- `/terms` — Terms of service
- `/about` — About Pindrop
- `/contact` — Contact information
