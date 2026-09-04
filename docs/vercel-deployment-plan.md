# Vercel deployment plan

## Configuration retained

`Pindrop-Production/vercel.json` is the minimum configuration: it selects the
Vite framework, runs the existing pnpm build, serves the Vite output directory,
routes `/api/*` to the Express Function entrypoint, and falls back to
`index.html` for SPA deep links. `api/index.ts` only imports and exports the
existing Express app. No local Vercel emulation or adapter was added.

Set the Vercel project Root Directory to `Pindrop-Production`, use Node 20+
(the verification used Node 24), and let Vercel detect pnpm from
`pnpm-lock.yaml`. Add `VITE_SITE_URL` before the production build. If the site
is served from a different browser origin than the API, also add
`FRONTEND_ORIGIN`; it is not necessary for the intended same-origin route.

## Compatibility blocker

This deployment is **not viable for the current download product on Vercel
Functions**. Current Vercel documentation sets a 4.5 MB maximum Function
response payload. The application intentionally allows 50 MB relayed videos.
Streaming does not establish that a 50 MB response is supported. Vercel also
describes Functions as a lightweight API layer rather than a media server.

Additionally, resolved download tokens live only in a process-local Map. A
serverless cold start or a different function instance may not hold the token
issued by the resolve request. This makes the two-request download flow
unreliable under serverless scaling.

Do not deploy the downloader to Vercel until an approved architecture solves
both issues. That decision is outside this finalization scope because it
requires changing the media delivery and token-state model.

Official references: Vercel Functions Limits, Vercel Function response payload
error guidance, Vercel Streaming, Vite on Vercel, and Express on Vercel.
