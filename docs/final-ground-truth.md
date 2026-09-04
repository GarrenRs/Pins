# Pindrop — Final Ground Truth Inventory (Production Cleaned)

**Audit & Freeze Date:** 2026-09-04  
**Project Root:** `f:/Pinterest-Video-Downloader`  
**Method:** Direct file system inspection, source code reading, import tracing, and clean build verification.

---

## Architecture (Verified from Code)

### Frontend
| Attribute | Value |
|---|---|
| Framework | React 19.1.0 |
| Bundler | Vite 7.3.6 |
| Router | wouter 3.3.5 |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` + 9 essential accessible UI primitives |
| State/Data | @tanstack/react-query 5.90.21 |
| Forms | react-hook-form 7.55.0 + zod 3.25.76 |
| Entry | `artifacts/pinterest-video-downloader/index.html` → `src/main.tsx` → `src/App.tsx` |

### Backend
| Attribute | Value |
|---|---|
| Runtime | Node.js (v24.13.0) |
| Framework | Express 5.2.1 |
| Entry | `artifacts/api-server/src/index.ts` → built to `dist/index.mjs` (1.4MB standalone executable) |
| Build | esbuild via `build.mjs` |
| Logger | Pino 9.14.0 |
| Validation | `@workspace/api-zod` (Zod schemas generated from OpenAPI 3.0 specification) |
| Rate Limiter | In-memory per-IP sliding window with automated 5-minute garbage collection sweep |

---

## Complete File Inventory & Disposal Decisions

### Root Files
| PATH | PURPOSE | USED BY | REQUIRED | ACTION |
|---|---|---|:---:|:---:|
| `package.json` | Monorepo build and typecheck orchestrator | Root workspace scripts | REQUIRED | KEEP |
| `pnpm-workspace.yaml` | Workspace configuration (6 active projects) | pnpm | REQUIRED | KEEP |
| `pnpm-lock.yaml` | Strictly pinned dependency tree | pnpm | REQUIRED | KEEP |
| `tsconfig.base.json` | Shared TypeScript compiler options | All projects | REQUIRED | KEEP |
| `tsconfig.json` | Root project references | `tsc --build` | REQUIRED | KEEP |
| `.gitignore` | Ignores `.env`, `dist/`, `node_modules/`, `*.zip`, etc. | Git | REQUIRED | KEEP |
| `.npmrc` | pnpm engine configurations | pnpm | REQUIRED | KEEP |
| `README.md` | Deployment and developer guide | Engineering | OPTIONAL | KEEP |

### `artifacts/api-server/` — Backend Service
| PATH | PURPOSE | USED BY | REQUIRED | ACTION |
|---|---|---|:---:|:---:|
| `src/index.ts` | Server listener entrypoint (port 5000) | Node runtime | REQUIRED | KEEP |
| `src/app.ts` | Express application, CORS policy, security headers | Express | REQUIRED | KEEP |
| `src/routes/index.ts` | Router aggregation | Express app | REQUIRED | KEEP |
| `src/routes/health.ts` | Liveness healthcheck endpoints | Load balancer/monitors | REQUIRED | KEEP |
| `src/routes/pinterest.ts` | `/api/resolve` & `/api/download/:token` endpoints | Frontend client | REQUIRED | KEEP |
| `src/pinterest/resolver.ts` | Pinterest redirect, scraping & candidate ranking engine | `routes/pinterest.ts` | REQUIRED | KEEP |
| `src/pinterest/security.ts` | SSRF prevention, IP filtering & host validation | Resolver & Streaming | REQUIRED | KEEP |
| `src/services/download-registry.ts` | 15-min token TTL registry & stream proxy pipe | `routes/pinterest.ts` | REQUIRED | KEEP |
| `src/lib/logger.ts` | Structured Pino logger | Express & Services | REQUIRED | KEEP |
| `build.mjs` | esbuild bundling script | Build system | REQUIRED | KEEP |
| `package.json` | Minimal backend dependencies | pnpm | REQUIRED | KEEP |
| `tsconfig.json` | Backend TypeScript configuration | Typechecker | REQUIRED | KEEP |
| `.env.example` | Template for environment variables | Ops / Developers | OPTIONAL | KEEP |

### `artifacts/pinterest-video-downloader/` — Frontend Application
| PATH | PURPOSE | USED BY | REQUIRED | ACTION |
|---|---|---|:---:|:---:|
| `index.html` | SPA HTML shell & JSON-LD WebSite metadata | Browser / Vite | REQUIRED | KEEP |
| `vite.config.ts` | Vite 7 compiler & dev `/api` reverse proxy | Build / Dev | REQUIRED | KEEP |
| `package.json` | Pruned frontend dependencies (35 unused removed) | pnpm | REQUIRED | KEEP |
| `tsconfig.json` | Frontend TypeScript config | Typechecker | REQUIRED | KEEP |
| `components.json` | shadcn metadata | CLI | OPTIONAL | KEEP |
| `.env.example` | Frontend environment template | Ops / Developers | OPTIONAL | KEEP |
| `src/main.tsx` | React 19 application mount | Browser | REQUIRED | KEEP |
| `src/App.tsx` | Homepage, router, and primary downloader | React router | REQUIRED | KEEP |
| `src/index.css` | Tailwind v4 styles and font imports | CSS bundler | REQUIRED | KEEP |
| `src/pages/pinterest-video-downloader.tsx` | Dedicated online downloader landing page | Router | REQUIRED | KEEP |
| `src/pages/how-to-download-pinterest-videos.tsx` | Tutorial and guide page | Router | REQUIRED | KEEP |
| `src/pages/about.tsx` | Product mission and privacy explanation | Router | REQUIRED | KEEP |
| `src/pages/contact.tsx` | Support mailbox and contact instructions | Router | REQUIRED | KEEP |
| `src/pages/privacy.tsx` | Real zero-retention data policy | Router | REQUIRED | KEEP |
| `src/pages/terms.tsx` | Terms of service and copyright disclosures | Router | REQUIRED | KEEP |
| `src/pages/not-found.tsx` | 404 error page | Router | REQUIRED | KEEP |
| `src/components/layout.tsx` | Header, Footer, and Breadcrumb navigation | All pages | REQUIRED | KEEP |
| `src/components/page-head.tsx` | Native document head manager | All pages | REQUIRED | KEEP |
| `src/components/error-boundary.tsx` | React error boundary catch-shield | Main tree | REQUIRED | KEEP |
| `src/components/ui/` (9 files) | `accordion`, `button`, `card`, `form`, `input`, `label`, `toast`, `toaster`, `tooltip` | Pages & forms | REQUIRED | KEEP |
| `src/lib/seo.ts` | Canonical declarations, titles, and breadcrumbs | `page-head.tsx` | REQUIRED | KEEP |
| `src/lib/utils.ts` | Style merge utilities (`clsx`, `twMerge`) | Components | REQUIRED | KEEP |
| `public/favicon.svg` | Favicon | Browser | REQUIRED | KEEP |
| `public/robots.txt` | Search crawler instructions | Search engines | REQUIRED | KEEP |
| `public/sitemap.xml` | XML sitemap with 7 canonical routes | Search engines | REQUIRED | KEEP |

### `lib/` — Shared Workspace Libraries
| PATH | PURPOSE | USED BY | REQUIRED | ACTION |
|---|---|---|:---:|:---:|
| `lib/api-client-react/` | Generated React Query hooks & fetcher | Frontend (`@workspace/api-client-react`) | REQUIRED | KEEP |
| `lib/api-spec/` | OpenAPI 3.0 specification & Orval config | Code generators | BUILD-ONLY | KEEP |
| `lib/api-zod/` | Generated Zod validation schemas | Backend (`@workspace/api-zod`) | REQUIRED | KEEP |

---

## Confirmed Dead Projects & Artifacts Removed

| PATH | FORMER ROLE | REASON FOR REMOVAL | DISPOSITION |
|---|---|---|:---:|
| `artifacts/mockup-sandbox/` | Design sandbox boilerplate | Never deployed, 0 incoming imports, Replit remnant. | **DELETED** |
| `lib/db/` | Empty Drizzle/Postgres scaffold | Database-free architecture; 0 runtime imports. | **DELETED** |
| `scripts/` | Scaffold `hello.ts` | Non-operational placeholder. | **DELETED** |
| `attached_assets/` | Pasted instruction text | Development notes only. | **DELETED** |
| `artifacts/pinterest-video-downloader/src/components/ui/` (46 unused files) | Scaffolding bloat | Unused components (`calendar`, `chart`, `carousel`, `sidebar`, `select`, etc.). | **DELETED** |
