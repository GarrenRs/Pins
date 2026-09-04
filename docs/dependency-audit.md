# Pindrop — Final Dependency Audit

**Audit Date:** 2026-09-04  
**Scope:** Complete Monorepo Workspace (6 active packages)  
**Status:** Pruned & Regenerated (`pnpm-lock.yaml` down by 137 packages)

---

## 1. Backend Service (`artifacts/api-server/package.json`)

### Runtime Dependencies
| Package | Version | Purpose | Where Imported |
|---|---|---|---|
| `@workspace/api-zod` | workspace:* | Type validation schemas | `src/routes/pinterest.ts`, `src/routes/health.ts` |
| `cors` | ^2.8.6 | CORS middleware | `src/app.ts` |
| `express` | ^5.2.1 | HTTP web server | `src/app.ts`, `src/index.ts`, all routes |
| `pino` | ^9.14.0 | Structured JSON logging | `src/lib/logger.ts` |
| `pino-http` | ^10.5.0 | Request logging middleware | `src/app.ts` |

### Removed Backend Packages
- `cookie-parser` & `@types/cookie-parser` (Zero imports found; removed)
- `drizzle-orm` (Zero imports found; removed)
- `@workspace/db` (Zero imports found; removed)

---

## 2. Frontend Application (`artifacts/pinterest-video-downloader/package.json`)

### Verified Active Dependencies
| Package | Version | Purpose |
|---|---|---|
| `react` & `react-dom` | 19.1.0 | Core UI rendering |
| `wouter` | ^3.3.5 | Client-side routing |
| `@tanstack/react-query` | ^5.90.21 | Asynchronous state & API fetching |
| `react-hook-form` | ^7.55.0 | Form state management |
| `@hookform/resolvers` | ^3.10.0 | Zod resolver for forms |
| `zod` | ^3.25.76 | Form schema validation |
| `@workspace/api-client-react` | workspace:* | Generated API client & hooks |
| `lucide-react` | ^0.545.0 | UI icons |
| `@radix-ui/react-accordion` | ^1.2.4 | Accessible FAQ accordions |
| `@radix-ui/react-label` | ^2.1.3 | Accessible form labels |
| `@radix-ui/react-slot` | ^1.2.0 | Polymorphic component slots |
| `@radix-ui/react-toast` | ^1.2.7 | Toast notification primitives |
| `@radix-ui/react-tooltip` | ^1.2.0 | Contextual tooltips |
| `class-variance-authority` | ^0.7.1 | Component style variants |
| `clsx` & `tailwind-merge` | catalog | Dynamic CSS class merging |
| `tailwindcss` & `@tailwindcss/vite` | ^4.1.14 | CSS framework & Vite plugin |
| `@tailwindcss/typography` | ^0.5.15 | Prose styling for articles/guides |
| `tw-animate-css` | ^1.4.0 | CSS keyframe animations for Radix UI |
| `vite` | ^7.3.2 | Fast frontend compiler |

### Removed Frontend Packages (35 packages pruned)
- `@radix-ui/react-alert-dialog`, `@radix-ui/react-aspect-ratio`, `@radix-ui/react-avatar`, `@radix-ui/react-checkbox`, `@radix-ui/react-collapsible`, `@radix-ui/react-context-menu`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-hover-card`, `@radix-ui/react-menubar`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-popover`, `@radix-ui/react-progress`, `@radix-ui/react-radio-group`, `@radix-ui/react-scroll-area`, `@radix-ui/react-select`, `@radix-ui/react-separator`, `@radix-ui/react-slider`, `@radix-ui/react-switch`, `@radix-ui/react-tabs`, `@radix-ui/react-toggle`, `@radix-ui/react-toggle-group`
- `cmdk`, `date-fns`, `embla-carousel-react`, `framer-motion`, `input-otp`, `next-themes`, `react-day-picker`, `react-icons`, `react-resizable-panels`, `recharts`, `sonner`, `vaul`
- Removed 46 unused `.tsx` component files from `src/components/ui/`.

---

## 3. Workspace Libraries

| Package | Status | Consumer |
|---|:---:|---|
| `lib/api-client-react` | **REQUIRED** | Imported by `pinterest-video-downloader` |
| `lib/api-spec` | **BUILD-ONLY** | OpenAPI schema source of truth (code generation) |
| `lib/api-zod` | **REQUIRED** | Imported by `api-server` |
| `lib/db` | **DELETED** | Removed from workspace |
