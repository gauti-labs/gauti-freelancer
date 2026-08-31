import { after, NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { projectRequestSchema } from "@/lib/validation/project-request";
import { collection, Collections, type ProjectRequestDoc } from "@/lib/db/collections";
import { site } from "@/config/site";
import { audit } from "@/lib/security/audit";

export const runtime = "nodejs";

// Cap request body size — Zod already enforces field lengths, but reject
// oversize payloads early to avoid parsing wasted bytes.
const MAX_BODY_BYTES = 32 * 1024; // 32 KB

// In-memory sliding-window rate limit.
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_MAX = 5; // requests per IP per window
const ipHits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (ipHits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  arr.push(now);
  ipHits.set(ip, arr);
  return arr.length > RATE_MAX;
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const userAgent = req.headers.get("user-agent") || undefined;

  const contentLength = Number(req.headers.get("content-length") || "0");
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Request too large." }, { status: 413 });
  }

  if (rateLimited(ip)) {
    await audit({ type: "project_request.rate_limited", ip, userAgent });
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = projectRequestSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json({ ok: false, error: "Please fix the highlighted fields.", fieldErrors }, { status: 400 });
  }

  // Honeypot check (schema already enforces empty, defence in depth)
  if (parsed.data.website_hp && parsed.data.website_hp.length > 0) {
    return NextResponse.json({ ok: true }); // silently accept + drop
  }

  const doc: ProjectRequestDoc = {
    name: parsed.data.name,
    email: parsed.data.email,
    company: parsed.data.company || undefined,
    projectType: parsed.data.projectType,
    description: parsed.data.description,
    budget: parsed.data.budget,
    timeline: parsed.data.timeline,
    existingWebsite: parsed.data.existingWebsite || undefined,
    preferredContact: parsed.data.preferredContact,
    status: "new",
    createdAt: new Date(),
    ip,
    userAgent,
  };

  // Respond fast, then run network-bound tasks in the background.
  // This keeps UX snappy on free-tier cold starts and slower network paths.
  after(async () => {
    // Best-effort persistence — request should not fail if Mongo is not configured yet.
    let persisted = false;
    try {
      if (process.env.MONGODB_URI) {
        const col = await collection<ProjectRequestDoc>(Collections.ProjectRequests);
        await col.insertOne(doc);
        persisted = true;
      }
    } catch (err) {
      console.error("[project-request] db write failed", err);
    }

    await audit({
      type: "project_request.received",
      actor: doc.email,
      ip,
      userAgent,
      meta: { projectType: doc.projectType, persisted },
    });

    // Best-effort notification email via Resend.
    try {
      if (process.env.AUTH_RESEND_KEY && process.env.NOTIFY_EMAIL) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.AUTH_RESEND_KEY);
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "onboarding@resend.dev",
          to: process.env.NOTIFY_EMAIL,
          replyTo: doc.email,
          subject: `New project request — ${doc.projectType} — ${doc.name}`,
          text: [
            `From:        ${doc.name} <${doc.email}>`,
            `Company:     ${doc.company || "—"}`,
            `Project:     ${doc.projectType}`,
            `Budget:      ${doc.budget || "—"}`,
            `Timeline:    ${doc.timeline || "—"}`,
            `Website:     ${doc.existingWebsite || "—"}`,
            `Contact:     ${doc.preferredContact || "Email"}`,
            "",
            "Description:",
            doc.description,
            "",
            `— sent from ${site.url}`,
          ].join("\n"),
        });
      }
    } catch (err) {
      console.error("[project-request] notify failed", err);
    }
  });

  return NextResponse.json({ ok: true, accepted: true });
}

export function GET() {
  return NextResponse.json({ ok: true, message: "POST to submit a project request." });
}

export type ProjectRequestBody = z.infer<typeof projectRequestSchema>;
