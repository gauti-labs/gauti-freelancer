import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { audit } from "@/lib/security/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/**
 * Private contact endpoint. The phone number:
 *  - lives only in ADMIN_PHONE env var
 *  - is never present in any client bundle, static HTML, JSON, or page source
 *  - is returned only after a valid server session is confirmed
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  const ip = clientIp(req);
  const userAgent = req.headers.get("user-agent") || undefined;

  if (!session?.user?.email) {
    await audit({ type: "admin.access.denied", target: "phone", ip, userAgent, meta: { reason: "unauthenticated" } });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const phone = process.env.ADMIN_PHONE?.trim();
  if (!phone) {
    return NextResponse.json({ error: "Contact number is not configured." }, { status: 404 });
  }

  await audit({ type: "contact.phone_revealed", actor: session.user.email, ip, userAgent });

  return NextResponse.json(
    { phone },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}
