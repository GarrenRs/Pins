# Pindrop — Local Development & Environment Guide

This document describes how to configure, run, test, and build Pindrop on a local machine without any cloud or platform-specific dependencies.

---

## 1. Directory Structure

```
pindrop/
├── artifacts/
│   ├── api-server/                     # Backend Express 5 server
│   │   ├── src/
│   │   │   ├── app.ts                  # Express application, CORS, security headers
│   │   │   ├── index.ts                # Server entrypoint (listens on PORT)
│   │   │   ├── lib/
│   │   │   │   └── logger.ts           # Pino logger configuration
│   │   │   ├── pinterest/
│   │   │   │   ├── resolver.ts         # Pinterest page fetch & video URL extraction
│   │   │   │   └── security.ts         # SSRF protection, DNS validation, domain allowlist
│   │   │   ├── routes/
│   │   │   │   ├── health.ts           # /healthz and /health endpoints
│   │   │   │   ├── pinterest.ts        # /resolve and /download/:token endpoints
│   │   │   │   └── index.ts            # Route aggregation
│   │   │   └── services/
│   │   │       └── download-registry.ts # 15-minute token storage & streaming proxy
│   │   ├── .env.example                # Example backend environment variables
│   │   ├── build.mjs                   # esbuild production bundler
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── pinterest-video-downloader/     # Frontend React 19 + Vite application
│   │   ├── src/
│   │   │   ├── App.tsx                 # Client routing, homepage, downloader UI
│   │   │   ├── components/
│   │   │   │   ├── layout.tsx          # SiteHeader, SiteFooter, Breadcrumb
│   │   │   │   ├── page-head.tsx       # Dynamic document metadata & JSON-LD
│   │   │   │   └── ui/                 # Accessible UI components (Shadcn/Radix)
│   │   │   ├── lib/
│   │   │   │   ├── seo.ts              # Canonical paths, page meta dictionary
│   │   │   │   └── utils.ts            # Class merging helpers
│   │   │   ├── pages/                  # About, Contact, How-to, Privacy, Terms, PVD
│   │   │   ├── index.css               # Tailwind CSS v4 design tokens
│   │   │   └── main.tsx                # React root mount
│   │   ├── public/                     # Static assets (robots.txt, sitemap.xml)
│   │   ├── .env.example                # Example frontend environment variables
│   │   ├── vite.config.ts              # Vite configuration with local /api proxy
│   │   └── package.json
│   │
│   └── mockup-sandbox/                 # UI prototype sandbox (optional dev tool)
│
├── lib/
│   ├── api-spec/                       # openapi.yaml (API contract)
│   ├── api-client-react/               # Orval-generated React Query hooks
│   ├── api-zod/                        # Orval-generated Zod schemas
│   └── db/                             # Template ORM setup (not active/required)
│
├── docs/
│   ├── local-environment.md            # This document
│   ├── replit-cleanup-audit.md         # Full audit of removed Replit dependencies
│   ├── seo-audit.md                    # Technical SEO verification report
│   └── competitor-seo-analysis.md      # Structural competitor benchmark
│
├── .gitignore                          # Standard git exclusions
├── pnpm-workspace.yaml                 # Monorepo workspace configuration
├── package.json                        # Root monorepo scripts & dependencies
└── README.md                           # Main project documentation
```

---

## 2. Ports and Network Architecture

| Service | Protocol | Local Port | Environment Variable | Notes |
|---|---|---|---|---|
| **API Server** | HTTP | `5000` | `PORT` | Listens on `0.0.0.0` or `127.0.0.1` |
| **Frontend Dev** | HTTP | `5173` | `PORT` | Vite development server with Hot Module Replacement |
| **Mockup Sandbox** | HTTP | `5174` | `PORT` | Optional isolated sandbox |

### Local Communication
During local development, the frontend dev server at `http://localhost:5173` automatically proxies all `/api/*` requests directly to `http://localhost:5000/api/*` via Vite's built-in development proxy. No CORS errors occur locally.

---

## 3. Environment Variables Reference

### Backend (`artifacts/api-server/.env`)

```env
# Port to listen on (default: 5000)
PORT=5000

# Environment mode (development | production | test)
NODE_ENV=development

# Frontend origin for CORS.
# In development: leave empty to automatically allow localhost origins.
# In production: must match the exact frontend origin (e.g. https://pindrop.app).
FRONTEND_ORIGIN=

# Logger verbosity (trace | debug | info | warn | error | fatal)
LOG_LEVEL=info

# Maximum streaming video size in bytes (default: 52428800 = 50 MB)
MAX_DOWNLOAD_SIZE=52428800
```

### Frontend (`artifacts/pinterest-video-downloader/.env`)

```env
# API Server base URL.
# In development: http://localhost:5000 (or leave empty when using Vite proxy)
VITE_API_BASE_URL=http://localhost:5000

# Contact email displayed on the /contact page
VITE_CONTACT_EMAIL=hello@pindrop.app
```

---

## 4. Local Execution Commands

### Prerequisites
- Node.js >= 18.0.0 (Node 24.x tested)
- pnpm >= 9.0.0

### Step 1: Install Dependencies
From the repository root:
```bash
pnpm install
```

### Step 2: Start the Backend
In your first terminal:
```bash
cd artifacts/api-server
pnpm dev
```
*The backend starts listening on `http://localhost:5000`.*

Verify with:
```bash
curl http://localhost:5000/api/health
# Response: {"status":"ok"}
```

### Step 3: Start the Frontend
In your second terminal:
```bash
cd artifacts/pinterest-video-downloader
pnpm dev
```
*The frontend starts listening on `http://localhost:5173`.*

Open your browser to `http://localhost:5173`.

---

## 5. Testing and Verification

### Type Checking
Run type checks across all packages:
```bash
pnpm typecheck
```
Or check individual packages:
```bash
pnpm --filter @workspace/pinterest-video-downloader run typecheck
pnpm --filter @workspace/api-server run typecheck
```

### Health Check Verification
```bash
# Both routes return {"status":"ok"}
curl http://localhost:5000/api/health
curl http://localhost:5000/api/healthz
```

### Downloader End-to-End Verification
```bash
# Test URL resolution
curl -X POST http://localhost:5000/api/resolve \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.pinterest.com/pin/123456789/"}'
```

---

## 6. Production Build

To build all packages for production:
```bash
pnpm build
```

Individual builds:
```bash
# Frontend production bundle -> artifacts/pinterest-video-downloader/dist/public/
pnpm --filter @workspace/pinterest-video-downloader run build

# Backend production bundle -> artifacts/api-server/dist/index.mjs
pnpm --filter @workspace/api-server run build
```

### Running the Production Build
```bash
# Start production API server
PORT=5000 NODE_ENV=production node artifacts/api-server/dist/index.mjs

# Serve the static frontend using any web server (nginx, caddy, serve)
npx serve artifacts/pinterest-video-downloader/dist/public -p 5173
```
