import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { projectBriefSchema } from "@/lib/validation/project-brief";
import { analyzeProject, DEFAULT_MODEL } from "@/lib/ai/gemini";
import { rateCheck } from "@/lib/ai/rate-limit";
import { collection, Collections, type AiRequestDoc } from "@/lib/db/collections";
import { isAvailable } from "@/lib/utils/env";
import { audit } from "@/lib/security/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Per-user limits.
const RATE_LIMIT = 8;               // requests
const RATE_WINDOW_MS = 60 * 60_000; // per hour
const MAX_BODY_BYTES = 16 * 1024;   // 16 KB

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  // Authorisation
  const session = await auth();
  const ip = clientIp(req);
  const userAgent = req.headers.get("user-agent") || undefined;

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }
  const userEmail = session.user.email.toLowerCase();

  const contentLength = Number(req.headers.get("content-length") || "0");
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }

  // Feature availability
  if (!isAvailable("GEMINI_API_KEY")) {
    return NextResponse.json(
      { error: "The analysis engine is not configured. GEMINI_API_KEY is required." },
      { status: 503 },
    );
  }

  // Rate limit
  const rl = rateCheck({ key: `pi:${userEmail}`, limit: RATE_LIMIT, windowMs: RATE_WINDOW_MS });
  if (!rl.ok) {
    const minutes = Math.ceil(rl.resetIn / 60_000);
    await audit({ type: "ai.request.rate_limited", actor: userEmail, ip, userAgent });
    return NextResponse.json(
      { error: `Rate limit reached. Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.` },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rl.resetIn / 1000)),
          "X-RateLimit-Limit": String(RATE_LIMIT),
          "X-RateLimit-Remaining": String(rl.remaining),
        },
      },
    );
  }

  // Body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = projectBriefSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input." },
      { status: 400 },
    );
  }

  const t0 = Date.now();
  let result;
  try {
    result = await analyzeProject(parsed.data.brief);
  } catch {
    await audit({ type: "ai.request.failed", actor: userEmail, ip, userAgent });
    return NextResponse.json(
      { error: "Analysis engine unavailable. Please try again shortly." },
      { status: 502 },
    );
  }
  const durationMs = Date.now() - t0;

  // Best-effort persist. Never fail the request if the DB is down.
  try {
    if (process.env.MONGODB_URI) {
      const col = await collection<AiRequestDoc>(Collections.AiRequests);
      await col.insertOne({
        userEmail,
        userId: (session.user as { id?: string })?.id,
        brief: parsed.data.brief,
        result,
        model: DEFAULT_MODEL,
        createdAt: new Date(),
        durationMs,
      });
    }
  } catch (err) {
    console.error("[project-intelligence] persist failed", err);
  }

  await audit({
    type: "ai.request.completed",
    actor: userEmail,
    ip,
    userAgent,
    meta: { model: DEFAULT_MODEL, durationMs, briefLength: parsed.data.brief.length },
  });

  return NextResponse.json(
    { ok: true, result, meta: { model: DEFAULT_MODEL, durationMs } },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
