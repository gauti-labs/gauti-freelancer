import "server-only";
import type { ObjectId } from "mongodb";
import { collection } from "@/lib/db/collections";

export type AuditEventType =
  | "auth.signin"
  | "auth.signout"
  | "admin.request.status_changed"
  | "admin.access.denied"
  | "ai.request.rate_limited"
  | "ai.request.completed"
  | "ai.request.failed"
  | "contact.phone_revealed"
  | "project_request.received"
  | "project_request.rate_limited";

export type AuditEvent = {
  _id?: ObjectId;
  type: AuditEventType;
  at: Date;
  actor?: string;       // email or "anon"
  target?: string;      // resource id, request id, etc
  ip?: string;
  userAgent?: string;
  meta?: Record<string, unknown>;
};

const AUDIT_COLLECTION = "audit_events";

/**
 * Log a structured audit event.
 * - Always writes a JSON line to stdout (captured by Vercel / any platform).
 * - Best-effort persists to Mongo when configured. Never throws.
 */
export async function audit(event: Omit<AuditEvent, "at" | "_id"> & { at?: Date }) {
  const doc: Omit<AuditEvent, "_id"> = {
    at: event.at ?? new Date(),
    type: event.type,
    actor: event.actor,
    target: event.target,
    ip: event.ip,
    userAgent: event.userAgent,
    meta: sanitize(event.meta),
  };

  // Structured stdout — one JSON line per event.
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ audit: doc }));

  if (!process.env.MONGODB_URI) return;
  try {
    const col = await collection<AuditEvent>(AUDIT_COLLECTION);
    await col.insertOne(doc);
  } catch (err) {
    // Never let audit failure break the request.
    // eslint-disable-next-line no-console
    console.error("[audit] persist failed", err);
  }
}

/**
 * Strip fields that must never enter a log: passwords, tokens, keys, phone.
 */
function sanitize(meta: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
  if (!meta) return undefined;
  const forbidden = /(password|secret|token|apikey|api_key|authorization|cookie|phone)/i;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(meta)) {
    if (forbidden.test(k)) continue;
    out[k] = v;
  }
  return out;
}
