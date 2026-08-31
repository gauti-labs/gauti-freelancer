import "server-only";

/**
 * Build a Content-Security-Policy header for the current request.
 *
 * In development we intentionally do not use nonce sources because React/Next
 * HMR and extension-injected snippets can trigger noisy CSP + hydration
 * warnings. Production remains strict and nonce-based.
 */
export function buildCsp(nonce: string | undefined, isDev: boolean): string {
  if (!isDev && !nonce) {
    throw new Error("[csp] nonce is required in production.");
  }

  const script = isDev
    ? `'self' 'unsafe-eval' 'unsafe-inline'`
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  // Fonts are loaded from Google Fonts via <link> in layout.tsx.
  const style = isDev
    ? `'self' 'unsafe-inline' https://fonts.googleapis.com`
    : `'self' 'nonce-${nonce}' 'unsafe-inline' https://fonts.googleapis.com`;

  const directives: Record<string, string> = {
    "default-src": "'self'",
    "script-src": script,
    "style-src": style,
    "img-src": "'self' data: blob: https://lh3.googleusercontent.com",
    "font-src": "'self' https://fonts.gstatic.com data:",
    "connect-src": "'self' https://generativelanguage.googleapis.com https://accounts.google.com",
    "frame-src": "'self' https://accounts.google.com",
    "form-action": "'self'",
    "frame-ancestors": "'none'",
    "base-uri": "'self'",
    "object-src": "'none'",
    "worker-src": "'self' blob:",
    "manifest-src": "'self'",
    "upgrade-insecure-requests": "",
  };

  return Object.entries(directives)
    .map(([k, v]) => (v ? `${k} ${v}` : k))
    .join("; ");
}

/**
 * Create a cryptographically strong nonce.
 */
export function newNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  // Base64url without padding
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
