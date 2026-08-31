import "server-only";

/**
 * Simple in-memory sliding-window rate limiter. Suitable for a single-node
 * personal site with modest traffic. For horizontal scale, swap for
 * @upstash/ratelimit + Redis.
 */

type Entry = { hits: number[] };
const store = new Map<string, Entry>();

export function rateCheck({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}): { ok: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = store.get(key) ?? { hits: [] };
  entry.hits = entry.hits.filter((t) => now - t < windowMs);

  const ok = entry.hits.length < limit;
  if (ok) entry.hits.push(now);
  store.set(key, entry);

  const remaining = Math.max(0, limit - entry.hits.length);
  const oldest = entry.hits[0] ?? now;
  const resetIn = Math.max(0, windowMs - (now - oldest));

  return { ok, remaining, resetIn };
}
