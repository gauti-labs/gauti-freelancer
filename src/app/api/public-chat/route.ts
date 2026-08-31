import { NextResponse, type NextRequest } from "next/server";
import { answerPublicChat } from "@/lib/ai/gemini";
import { rateCheck } from "@/lib/ai/rate-limit";
import { publicChatSchema } from "@/lib/validation/public-chat";
import { isAvailable } from "@/lib/utils/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 60_000; // 1 hour
const MAX_BODY_BYTES = 8 * 1024; // 8 KB

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  const contentLength = Number(req.headers.get("content-length") || "0");
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Request too large." }, { status: 413 });
  }

  const rl = rateCheck({ key: `public-chat:${ip}`, limit: RATE_LIMIT, windowMs: RATE_WINDOW_MS });
  if (!rl.ok) {
    const minutes = Math.ceil(rl.resetIn / 60_000);
    return NextResponse.json(
      { ok: false, error: `Too many messages. Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.` },
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = publicChatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Invalid input." },
      { status: 400 },
    );
  }

  if (!isAvailable("GROQ_API_KEY") && !isAvailable("GEMINI_API_KEY")) {
    return NextResponse.json(
      {
        ok: true,
        reply:
          "I can help with services, AI, and project planning. The live AI assistant is currently unavailable. Please use Start a Project and Gautam will respond directly.",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const reply = await answerPublicChat(parsed.data.message, parsed.data.history ?? []);
    return NextResponse.json({ ok: true, reply }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      {
        ok: true,
        reply:
          "I hit a temporary delay while generating that answer. Please ask again, or share your project goal and I will help with services, pricing, and next steps.",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}
