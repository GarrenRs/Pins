# Ground truth

The deployable source is `Pindrop-Production/`. Vercel must be configured with
that directory as its Root Directory. Repository-root `docs/` is intentionally
outside the deployable workspace.

| Path | Purpose | Used by | Runtime/build/development | Required | Action |
| --- | --- | --- | --- | --- | --- |
| `Pindrop-Production/artifacts/pinterest-video-downloader` | React single-page frontend | Browser, Vite | Build and development | Yes | Retained |
| `Pindrop-Production/artifacts/api-server` | Express API, resolver and stream relay | `/api` Vercel Function; local Node server | Runtime, build, development | Yes | Retained |
| `Pindrop-Production/api/index.ts` | Minimal Vercel Function entrypoint | Vercel | Runtime | Yes | Retained |
| `Pindrop-Production/lib/api-zod` | Zod API request/response schemas | API and generated client | Build/runtime | Yes | Retained |
| `Pindrop-Production/lib/api-client-react` | Generated React Query API client | Frontend | Build/runtime | Yes | Retained |
| `Pindrop-Production/vercel.json` | Vite build output and API/SPA routing | Vercel | Deployment | Yes | Retained |
| `docs/` | Audit and release records | Maintainer | Documentation | Yes | Retained outside deploy source |

The former repository-root workspace duplicated the production workspace and
was removed, along with generated JavaScript, archive, caches, and build output.
