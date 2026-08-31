# Gautam Goyal — Digital Architect

Premium personal engineering platform. Public site, authenticated client portal, foundation for AI Project Intelligence and admin dashboard.

Built with Next.js 15 (App Router), React 19, TypeScript strict, Tailwind, Motion, Auth.js v5, MongoDB Atlas and Resend. Ready for Vercel.

---

## Table of contents

1. [Prerequisites](#prerequisites)
2. [Quick start (local)](#quick-start-local)
3. [Environment variables](#environment-variables)
4. [MongoDB setup](#mongodb-setup)
5. [Google OAuth setup](#google-oauth-setup)
6. [Resend setup (magic link + notifications)](#resend-setup-magic-link--notifications)
7. [Admin access](#admin-access)
8. [Private phone number](#private-phone-number)
9. [Gemini setup (phase 7)](#gemini-setup-phase-7)
10. [Production build & typecheck](#production-build--typecheck)
11. [Vercel deployment](#vercel-deployment)
12. [Custom domain](#custom-domain)
13. [Google Search Console & Bing](#google-search-console--bing)
14. [Project structure](#project-structure)
15. [SEO checklist](#seo-checklist)
16. [Security checklist](#security-checklist)
17. [Testing checklist](#testing-checklist)
18. [Editing content](#editing-content)
19. [Phase roadmap](#phase-roadmap)

---

## Prerequisites

- Node.js `>= 20.0.0`
- npm `>= 10` (comes with Node 20)
- A MongoDB Atlas free-tier cluster (for auth persistence and project requests)
- A Google Cloud project (for Google OAuth) — optional, but recommended
- A Resend account (for magic-link auth and project inquiry notifications) — optional

## Quick start (local)

```bash
git clone <your-repo-url> gautam-goyal
cd gautam-goyal
npm install
cp .env.example .env.local
# fill .env.local with your values (see below)
npm run dev
```

Open http://localhost:3000

The site runs even with minimal env config:

- **With nothing set** — public pages render; project form returns a validation-only response; sign-in shows a helpful config warning.
- **With Mongo only** — project requests persist; auth still needs a provider.
- **With Google + Resend + Mongo** — full end-to-end sign-in, magic link, and project-request notifications work.

## Environment variables

Every variable is documented inline in [`.env.example`](./.env.example). Summary:

| Variable | Required for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Everything | No trailing slash. Drives canonical URLs, sitemap, OG. |
| `MONGODB_URI` | Auth, project requests | Atlas connection string. |
| `MONGODB_DB` | DB name | Defaults to `gautam_goyal`. |
| `AUTH_SECRET` | Auth | `openssl rand -base64 32` |
| `AUTH_TRUST_HOST` | Prod auth | Set `true` (auto on Vercel). |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google sign-in | From Google Cloud Console. |
| `AUTH_RESEND_KEY` | Magic-link sign-in + notify | From resend.com. |
| `EMAIL_FROM` | Email sender | Must be verified in Resend (or `onboarding@resend.dev` for dev). |
| `NOTIFY_EMAIL` | Project inquiry recipient | Defaults to `gautamgoyal1996@gmail.com`. |
| `ADMIN_EMAILS` | Admin panel | Comma-separated allowlist. |
| `ADMIN_PHONE` | Private contact reveal | Server-side only. Never in client bundles. |
| `GEMINI_API_KEY` | Phase 7 AI features | Server-only. |
| `GEMINI_MODEL` | Phase 7 | Defaults to `gemini-2.0-flash`. |
| `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` | Search Console | Optional. |

## MongoDB setup

1. Create a free M0 cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. **Database Access →** create a user, grant `readWrite` on the `gautam_goyal` DB.
3. **Network Access →** for local dev, add your current IP. For Vercel prod, add `0.0.0.0/0` (Atlas free tier's most practical option), or configure Vercel-managed IPs on paid tiers.
4. **Connect → Drivers → Node.js →** copy the SRV connection string. Replace `<db_password>` with the real password and set `MONGODB_URI`.

Collections are created lazily on first write. Auth.js manages `users`, `accounts`, `sessions`, `verification_tokens`; the app manages `project_requests` (and, in later phases, `projects`, `testimonials`, `ai_requests`).

## Google OAuth setup

1. Go to [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth client ID** of type **Web application**.
3. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.com/api/auth/callback/google` (and the `*.vercel.app` preview if you use it)
4. Copy the client ID and secret into `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`.

## Resend setup (magic link + notifications)

1. Create a [Resend](https://resend.com) account and API key.
2. Add and verify a sending domain (recommended for production). For local dev, `onboarding@resend.dev` works.
3. Set `AUTH_RESEND_KEY`, `EMAIL_FROM` (e.g. `"Gautam Goyal <hello@your-domain.com>"`), and `NOTIFY_EMAIL`.

## Admin access

Admin identity is controlled by the `ADMIN_EMAILS` allowlist (comma-separated, case-insensitive). On sign-in, matching emails receive `role: "admin"` in the JWT. `/admin` routes require that role — enforced in middleware and re-checked server-side in layouts.

To grant admin access, add the email to `ADMIN_EMAILS` and redeploy (or restart `npm run dev`). The user must then sign out and sign back in for the new JWT to take effect.

## Private phone number

`ADMIN_PHONE` is read only inside the server-only route handler at `src/app/api/private/contact/route.ts`. The endpoint:

- Requires a valid session (`auth()` server check).
- Returns `Cache-Control: private, no-store` to prevent any intermediary caching.
- Is never included in initial HTML, JSON payloads, or client JS bundles.

Leave `ADMIN_PHONE` blank to hide the reveal CTA entirely (the endpoint returns `404`).

## Gemini setup (phase 7)

Set `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/app/apikey). The Project Intelligence route (added in phase 7) validates input with Zod, rate-limits per session, and never returns the raw key to the client. The site remains fully usable if Gemini is unavailable.

## Production build & typecheck

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run start
```

`npm run build` must complete without errors before deployment. `npm test` runs Vitest against the validation, CSP, admin, and rate-limit units.

## Vercel deployment

1. Push this repo to GitHub.
2. In [vercel.com](https://vercel.com), **Add New → Project → Import** the repo.
3. Framework: **Next.js** (auto-detected).
4. **Environment Variables**: add every variable from `.env.example` that you use in production. In particular set `NEXT_PUBLIC_SITE_URL` to your production URL.
5. **Deploy**.
6. Update Google OAuth authorised redirect URIs with the production URL.
7. Update MongoDB Atlas network access to include Vercel (or `0.0.0.0/0` for free tier).
8. Verify:
   - `/` renders.
   - `/robots.txt` and `/sitemap.xml` are served.
   - `/signin` works with both providers.
   - Submitting `/start-a-project` produces an entry in Mongo and an email to `NOTIFY_EMAIL`.
   - `/client` is inaccessible unauthenticated.

## Custom domain

In Vercel → Project → **Settings → Domains**, add your domain and follow the DNS instructions. Then:

- Update `NEXT_PUBLIC_SITE_URL` to `https://your-domain.com`.
- Update Google OAuth redirect URIs.
- Update Resend verified sending domain if desired.
- Redeploy.

## Google Search Console & Bing

1. Add your production URL as a property in [Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. **Verification** — the simplest path is the `<meta>` tag method:
   - Copy the content string from the verification tag.
   - Set `GOOGLE_SITE_VERIFICATION` and/or `BING_SITE_VERIFICATION` env vars — Next injects them automatically.
   - Redeploy.
3. **Submit sitemap:** `https://your-domain.com/sitemap.xml`.

## Project structure

```
src/
  app/
    (marketing)/       Public site (nav + footer via group layout)
      page.tsx         Homepage
      about/
      services/[slug]/
      work/
      pricing/
      start-a-project/
    (auth)/            Sign-in + verify-request (noindex)
    client/            Authenticated portal (noindex, session-gated)
    admin/             Admin dashboard (phase 8, role-gated)
    api/
      auth/[...nextauth]/    Auth.js handler
      project-request/       Zod + rate-limit + Mongo + Resend
      private/contact/       Session-gated phone reveal
    sitemap.ts
    robots.ts
    manifest.ts
    opengraph-image.tsx
    icon.svg / apple-icon.svg
    layout.tsx / not-found.tsx / global-error.tsx
    globals.css
  components/
    ui/                Design system primitives (Button, Input, Card, Hexagon, Logo, ThemeToggle, ...)
    marketing/         Nav, Footer, Hero, Capabilities, ExperienceBand, SelectedWork, WhyGautam, ProjectForm, FinalCta
    client/            PrivateContact
    seo/               JSON-LD, Breadcrumbs
    providers.tsx
  config/              Editable content: site, nav, capabilities, services, projects, pricing, social
  lib/
    auth/              admin allowlist helper
    db/                mongodb client + collections
    seo/               metadata builder
    validation/        Zod schemas
    utils/             cn
  auth.config.ts       Edge-safe Auth.js config (used by middleware)
  auth.ts              Auth.js main (adapter + providers + role callback)
  middleware.ts        Route protection
```

## SEO checklist

- [x] Unique `<title>` and description per public page (App Router `metadata` + `generateMetadata`)
- [x] Canonical URLs on every public page
- [x] Open Graph + Twitter metadata via root `layout.tsx` and per-page helpers
- [x] Dynamic OG image at `/opengraph-image` (edge-rendered, brand-consistent)
- [x] JSON-LD: `Person`, `WebSite`, `ProfessionalService`, `BreadcrumbList`
- [x] `sitemap.xml` and `robots.txt` — public URLs only, private disallowed
- [x] `X-Robots-Tag: noindex` on `/client` and `/admin` at the header level (belt-and-braces with `robots` metadata)
- [x] Semantic headings, breadcrumb navigation, descriptive internal links
- [x] Favicon (SVG) + Apple touch icon + web manifest
- [x] Descriptive image alt text (no decorative-only images that lack alt)
- [x] Configurable Search Console verification via env

## Security checklist

- [x] Secrets live only in env vars; `.env` and `.env.local` gitignored
- [x] MongoDB URI never in client code
- [x] Gemini API key never in client code (`server-only` import + no NEXT_PUBLIC_ prefix)
- [x] Auth.js sessions (JWT strategy); role assigned server-side from allowlist
- [x] Middleware protects `/client` (any session) and `/admin` (admin role)
- [x] Admin server actions re-check `requireAdmin()` on every call
- [x] Private phone number: server-only env var + session-gated endpoint + `no-store` cache
- [x] Project-request endpoint: Zod validation, honeypot, IP rate limit, body-size cap, best-effort writes
- [x] Project Intelligence: session-gated, feature-gated (503 in prod if key missing), per-user rate limit, body-size cap
- [x] Nonce-based Content-Security-Policy set by middleware, tightened in production (`strict-dynamic`; no `unsafe-inline`, no `unsafe-eval`)
- [x] Security headers: HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy
- [x] `X-Robots-Tag: noindex` on `/client` and `/admin` at the header level
- [x] Structured audit log (`audit_events` collection + stdout JSON) for auth, admin actions, phone reveals, AI usage, rate limits
- [x] Log sanitiser strips fields matching `password|secret|token|apikey|authorization|cookie|phone`
- [x] `poweredByHeader: false`
- [x] External links use `rel="noopener noreferrer"`
- [x] Production fails closed: missing `GEMINI_API_KEY` → 503; missing `ADMIN_EMAILS` → no admin access; missing `ADMIN_PHONE` → 404 on reveal; no dev bypasses reachable in prod

## Testing checklist

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` completes without errors
- [ ] All public pages load
- [ ] Theme toggle persists across reloads
- [ ] `/start-a-project` shows field-level validation errors on bad input
- [ ] `/start-a-project` submits successfully with valid input (persists if Mongo configured; emails if Resend configured)
- [ ] `/signin` renders both providers when configured; magic link email arrives
- [ ] `/client` redirects unauthenticated users to `/signin?callbackUrl=/client`
- [ ] `/admin` returns 401/redirect for non-admin users
- [ ] `/api/private/contact` returns 401 when logged out, 404 when `ADMIN_PHONE` is blank, and the number when both authenticated and configured
- [ ] Lighthouse Performance / Accessibility / SEO / Best Practices all ≥ 90 on desktop
- [ ] Mobile navigation works and menus close on route change

## Editing content

Content lives in `src/config/`. Nothing about copy, pricing, projects, services, or navigation is hardcoded in components.

- **Projects** → `src/config/projects.ts`
- **Services** → `src/config/services.ts` (add a slug here → the `/services/[slug]` route + sitemap update automatically)
- **Pricing** → `src/config/pricing.ts`
- **Capabilities** → `src/config/capabilities.ts`
- **Navigation** → `src/config/nav.ts`
- **Social / email** → `src/config/social.ts`
- **Site metadata / tagline** → `src/config/site.ts`

## Phase roadmap

- [x] **Phase 1** — Project initialisation
- [x] **Phase 2** — Design system
- [x] **Phase 3** — Public website (homepage, about, services, work, pricing, start-a-project)
- [x] **Phase 4** — SEO (metadata, JSON-LD, sitemap, robots, OG image, canonical)
- [x] **Phase 5** — Authentication (Google, magic link, session-gated routes, private contact API)
- [x] **Phase 6** — Client portal as a private workspace
- [x] **Phase 7** — Gemini Project Intelligence (structured, rate-limited, session-gated, persistent)
- [x] **Phase 8** — MongoDB-backed admin dashboard
- [x] **Phase 9** — Security hardening (CSP with nonces, audit logging, body-size caps)
- [x] **Phase 10** — Testing (Vitest, 31 tests), accessibility (skip link, main landmarks), SEO audit, security review
- [x] **Phase 11** — Production readiness ([SECURITY.md](./SECURITY.md), deployment runbook)

## License

MIT — see [LICENSE](./LICENSE).
