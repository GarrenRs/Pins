# Pindrop — Final Project Map & Architecture Blueprint

**Status:** Production Frozen Release Candidate  
**Date:** 2026-09-04  
**Project Root:** `f:/Pinterest-Video-Downloader`

---

## 1. Project Directory Structure & Responsibility Map

```
f:/Pinterest-Video-Downloader
├── artifacts/
│   ├── api-server/                     # Production Backend Service
│   │   ├── src/
│   │   │   ├── index.ts                # HTTP Listener entrypoint (port 5000)
│   │   │   ├── app.ts                  # Express 5 application setup, CORS, Security Headers
│   │   │   ├── routes/
│   │   │   │   ├── index.ts            # Sub-router registry
│   │   │   │   ├── health.ts           # /api/health and /api/healthz probes
│   │   │   │   └── pinterest.ts        # /api/resolve and /api/download/:token
│   │   │   ├── pinterest/
│   │   │   │   ├── resolver.ts         # Direct page fetching, redirect chasing, candidate extraction & ranking
│   │   │   │   └── security.ts         # SSRF protection, DNS rebinding guards, IP & host allowlists
│   │   │   ├── services/
│   │   │   │   └── download-registry.ts# 15-minute token TTL registry & stream proxy pipe
│   │   │   └── lib/
│   │   │       └── logger.ts           # Pino structured logger
│   │   ├── build.mjs                   # esbuild bundler script (outputs to dist/index.mjs)
│   │   ├── package.json                # Server manifests & scripts
│   │   └── tsconfig.json               # Server TypeScript config
│   │
│   └── pinterest-video-downloader/     # Production Frontend Single Page Application
│       ├── src/
│       │   ├── App.tsx                 # Core app layout, hero section, routing & homepage downloader
│       │   ├── main.tsx                # React 19 entrypoint mounting #root
│       │   ├── index.css               # Global Tailwind v4 styles & fonts
│       │   ├── pages/
│       │   │   ├── pinterest-video-downloader.tsx  # Dedicated online utility landing page
│       │   │   ├── how-to-download-pinterest-videos.tsx # Step-by-step visual tutorial
│       │   │   ├── about.tsx           # Product transparency & mission statement
│       │   │   ├── contact.tsx         # Support email link & assistance info
│       │   │   ├── privacy.tsx         # Real no-storage data policy & disclosure
│       │   │   ├── terms.tsx           # Terms of service & legal copyright boundaries
│       │   │   └── not-found.tsx       # 404 handler
│       │   ├── components/
│       │   │   ├── layout.tsx          # Responsive SiteHeader, SiteFooter, Breadcrumb
│       │   │   ├── page-head.tsx       # Hoisted title, meta tags, and canonical links
│       │   │   ├── error-boundary.tsx  # React component tree crash shield
│       │   │   └── ui/                 # Accessible Radix / shadcn UI components
│       │   └── lib/
│       │       ├── seo.ts              # Canonical declarations, meta descriptions & breadcrumb data
│       │       └── utils.ts            # Class merging & style utilities
│       ├── public/
│       │   ├── favicon.svg             # Brand favicon
│       │   ├── robots.txt              # Search crawler access directives
│       │   └── sitemap.xml             # Complete XML sitemap (7 public URLs)
│       ├── index.html                  # HTML5 shell & WebSite JSON-LD
│       ├── vite.config.ts              # Vite 7 configuration with /api reverse proxy
│       └── package.json                # Frontend package dependencies & build commands
│
├── lib/
│   ├── api-client-react/               # Orval-generated React Query API client
│   │   └── src/index.ts                # Provides useResolvePinterestPin, useHealthCheck
│   ├── api-spec/                       # Single source of truth API contract
│   │   ├── openapi.yaml                # OpenAPI 3.0 specification
│   │   └── orval.config.ts             # Code-generation configuration
│   ├── api-zod/                        # Zod schemas generated from openapi.yaml
│   │   └── src/generated/api.ts        # Runtime body & param validators used by Express
│   └── db/                             # Legacy scaffold (zero code imports in runtime)
│
├── docs/                               # Engineering audits & ground truth verification
│   ├── final-ground-truth.md           # Full repository inventory
│   ├── dependency-audit.md             # Dependency forensics & usage matrix
│   ├── final-project-map.md            # Architecture blueprint (this file)
│   ├── release-candidate.md            # Release Candidate acceptance matrix
│   ├── final-ux-seo-audit.md           # Mobile responsiveness & intent separation audit
│   └── homepage-vs-pinterest-video-downloader-audit.md # Search intent distinction analysis
│
├── .gitignore                          # Standard git excludes (excludes dist, node_modules, cache, logs)
├── .npmrc                              # pnpm workspace configuration
├── package.json                        # Monorepo root scripts (build, typecheck)
├── pnpm-lock.yaml                      # Pinned lockfile
├── pnpm-workspace.yaml                 # Monorepo package registry
├── tsconfig.base.json                  # Shared strict TypeScript base config
└── tsconfig.json                       # Solution-style TypeScript reference
```

---

## 2. Directory Purpose & Lifecycle Classification

| Major Directory | Why It Exists | Who Uses It | Required in Production? |
|---|---|---|:---:|
| `artifacts/api-server/` | Host the backend Express 5 REST API, Pinterest page resolver, and streaming proxy. | Browser client & external Pinterest servers. | **YES (REQUIRED)** |
| `artifacts/pinterest-video-downloader/` | Host the user interface, SEO metadata, landing pages, and responsive download controls. | End users & web crawlers. | **YES (REQUIRED)** |
| `lib/api-client-react/` | Type-safe React Query hooks connecting frontend directly to backend endpoints. | `pinterest-video-downloader` frontend. | **YES (REQUIRED)** |
| `lib/api-zod/` | Runtime input validation schemas checking URL formats and download tokens. | `api-server` backend. | **YES (REQUIRED)** |
| `lib/api-spec/` | OpenAPI 3.0 contract and code-generation tool configuration. | Developers during API contract updates. | **BUILD-ONLY** |
| `lib/db/` | Legacy database scaffold without imports. | None. | **UNUSED (REMOVAL CANDIDATE)** |
| `artifacts/mockup-sandbox/` | Isolated prototyping sandbox. | Developers (UI testing). | **DEVELOPMENT-ONLY** |
| `scripts/` | Monorepo helper folder. | None. | **UNUSED** |
| `attached_assets/` | Pasted task guidelines & notes. | Reference only. | **NON-OPERATIONAL** |
| `docs/` | Ground-truth verification, security tests, and architecture records. | Engineering & operations. | **DOCUMENTATION** |
