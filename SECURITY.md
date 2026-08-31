# Security Policy

## Reporting a vulnerability

Email [gautamgoyal1996@gmail.com](mailto:gautamgoyal1996@gmail.com) with a clear description and reproduction steps. Please do not open a public GitHub issue for security reports.

## Security model

### Authentication

- Auth.js v5 with two providers: Google OAuth and Resend magic link.
- Session strategy: JWT. Cookies are `HttpOnly`, `SameSite=Lax`, and `Secure` on any HTTPS host (Auth.js default).
- `AUTH_SECRET` must be at least 32 random bytes (`openssl rand -base64 32`).
- `AUTH_TRUST_HOST` is set to `true` (auto on Vercel).

### Authorization

- **Public routes** — no auth required.
- **`/client`** — any authenticated session.
- **`/admin`** — session where `session.user.role === "admin"`.
- Role is assigned server-side in the Auth.js JWT callback by matching the user's email against `ADMIN_EMAILS` (comma-separated allowlist).
- Every admin server action re-invokes `requireAdmin()` — the client is never trusted.
- Enforcement happens at three layers: middleware, layout server component, and each server action.

### Fail-closed in production

- Missing `GEMINI_API_KEY` → `/api/client/project-intelligence` returns `503`. No mock analysis is ever returned.
- Missing / empty `ADMIN_EMAILS` → no user is ever assigned `admin` role; `/admin/*` redirects everyone to `/client`.
- Missing `ADMIN_PHONE` → phone endpoint returns `404`; UI hides the reveal control.
- `requireEnv()` throws in production when a critical env var is missing.
- No development bypass, mock authentication, mock admin, or fake API response is reachable in production.

### Private phone number

- Value lives only in the `ADMIN_PHONE` env var, read only inside `/api/private/contact`.
- Response includes `Cache-Control: private, no-store, max-age=0`.
- Never present in any client bundle, static HTML, SSR payload, or JSON response body of any other route.
- Every reveal is audit-logged with the requesting user's email.

### Gemini

- `GEMINI_API_KEY` is loaded inside `src/lib/ai/gemini.ts`, which imports `server-only`. Any accidental client import fails the build.
- Client code posts a brief to `/api/client/project-intelligence`, which is session-gated, feature-gated, Zod-validated, per-user rate-limited (8/hour), body-size capped (16 KB), and abort-timeout capped (25s).
- System instruction forbids fabricated metrics, fabricated project references, exact quotes, and exact delivery dates.

### Public API (`/api/project-request`)

- Zod schema validates every field, enforces enum values, trims/lowercases where appropriate, caps description at 4,000 chars.
- Honeypot field (`website_hp`) — non-empty submissions are silently accepted and dropped.
- Per-IP sliding-window rate limit: 5 requests per hour.
- Body-size cap: 32 KB.
- Best-effort DB writes and Resend notifications — a downstream outage never fails the user's submission or leaks internal errors.

### Content Security Policy

- Nonce-based CSP set by `src/middleware.ts` on every request via `src/lib/security/csp.ts`.
- Production directives include: `'strict-dynamic'` on script-src (no `'unsafe-inline'`, no `'unsafe-eval'`), `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `upgrade-insecure-requests`.
- `connect-src` is limited to `'self'`, `https://generativelanguage.googleapis.com` (Gemini), and `https://accounts.google.com` (OAuth).
- Development relaxes only what HMR requires. Production is strict.

### Other headers

- `Strict-Transport-Security` — 2-year `max-age`, `includeSubDomains`, `preload`.
- `X-Frame-Options: DENY` (belt-and-braces with CSP `frame-ancestors`).
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`.
- `X-Robots-Tag: noindex, nofollow` on `/client/*` and `/admin/*`.
- `X-Powered-By` disabled.

### Redirect safety

- The `callbackUrl` param on `/signin` is validated to same-origin relative paths only. Values that begin with `//`, contain a scheme, or otherwise attempt to escape the origin are replaced with `/client`.

### ObjectId handling

- Every admin route that consumes an id validates with `ObjectId.isValid(id)` before constructing an `ObjectId`. Invalid ids result in a `notFound()` or a thrown server error, never a malformed query.

### Audit logging

- `src/lib/security/audit.ts` emits one JSON line per event to stdout (captured by Vercel logs) and best-effort persists to `audit_events` in MongoDB.
- Events logged: sign-in, sign-out, admin request status changes, admin access denials, phone reveals, AI request completions / failures / rate-limits, project-request receipts and rate-limits.
- A regex strips any field name matching `password|secret|token|apikey|api_key|authorization|cookie|phone` before writing.

### Rate limiting scope

- In-memory sliding windows (per Vercel instance). Suitable for a single-node personal site. Swap for a shared store if you scale horizontally.

### Secrets

- Every secret lives in an environment variable. See [`.env.example`](./.env.example).
- No API key, OAuth secret, MongoDB credential, `AUTH_SECRET`, or `ADMIN_PHONE` is committed to the repo.
- `.env` and `.env.local` are gitignored.

### Dependencies

- Direct dependencies are pinned to major versions. Run `npm audit` before every release.
- Removed `next/font/google` in favour of a linked stylesheet + preconnect for build determinism in restricted networks; this does not affect security.

## Verified vs unverified in the delivered build

| Check | State |
|---|---|
| `tsc --noEmit` | Verified clean |
| `next lint` | Verified clean |
| `next build` | Verified clean |
| `vitest run` (31 tests) | Verified passing |
| Live Google OAuth callback | Unverified in sandbox — requires configured client in prod |
| Live Resend magic link | Unverified in sandbox — requires API key + verified sender |
| Live Gemini request | Unverified in sandbox — requires API key |
| MongoDB Atlas connectivity | Unverified in sandbox — requires cluster |
| Playwright end-to-end | Not included (would require a running server + browsers). |
