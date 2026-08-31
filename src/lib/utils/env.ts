/**
 * Production-safety helpers.
 *
 * Development is permissive so the site runs on first clone. Production must
 * fail closed for any feature whose absence would create a security or
 * data-integrity hazard.
 */
export const isProd = process.env.NODE_ENV === "production";
export const isDev = !isProd;

/**
 * Throw in production if a required env var is missing. Never throws in dev.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    if (isProd) {
      throw new Error(`[env] ${name} is required in production.`);
    }
    return "";
  }
  return value.trim();
}

/**
 * Assert that a value is present in production. In dev, returns false silently.
 * Use to gate feature availability without hard-crashing dev.
 */
export function isAvailable(...envVars: string[]): boolean {
  for (const name of envVars) {
    const v = process.env[name];
    if (!v || !v.trim()) return false;
  }
  return true;
}
