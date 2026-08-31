import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Hexagon } from "@/components/ui/hexagon";

/**
 * Only accept relative paths that begin with "/" and do not attempt to
 * escape the origin (protocol-relative "//" or backslash tricks).
 * This is defence-in-depth on top of Auth.js's own callback validation.
 */
function safeCallback(input: string | undefined): string {
  const fallback = "/client";
  if (!input) return fallback;
  if (!input.startsWith("/")) return fallback;
  if (input.startsWith("//") || input.startsWith("/\\")) return fallback;
  if (/^\/[a-z]+:/i.test(input)) return fallback;
  return input;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/client");
  const params = await searchParams;
  const callbackUrl = safeCallback(params.callbackUrl);
  const error = params.error;

  const hasGoogle = !!process.env.AUTH_GOOGLE_ID;
  const hasResend = !!process.env.AUTH_RESEND_KEY;

  return (
    <div className="w-full max-w-md">
      <div className="corner-brackets relative overflow-hidden rounded-xl border border-hairline/25 bg-elevated/60 p-8 md:p-10">
        <div className="flex flex-col items-center text-center">
          <Hexagon size={56}>
            <span className="font-display text-lg text-gold">GG</span>
          </Hexagon>
          <h1 className="mt-6 font-display text-3xl font-medium text-ink">Sign in</h1>
          <p className="mt-2 text-sm text-ink-muted">Access the client portal.</p>
        </div>

        {error && (
          <p className="mt-6 rounded-md border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            Sign-in failed. Please try again.
          </p>
        )}

        {!hasGoogle && !hasResend && (
          <p className="mt-6 rounded-md border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-gold">
            No auth providers configured. Set <code>AUTH_GOOGLE_ID</code> / <code>AUTH_GOOGLE_SECRET</code> and/or{" "}
            <code>AUTH_RESEND_KEY</code> in <code>.env.local</code>.
          </p>
        )}

        {hasGoogle && (
          <>
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: callbackUrl });
              }}
              className="mt-8"
            >
              <Button type="submit" variant="secondary" size="md" className="w-full">
                <GoogleIcon />
                Continue with Google
              </Button>
            </form>
          </>
        )}

        {hasGoogle && hasResend && (
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-hairline/30" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle">or</span>
            <div className="h-px flex-1 bg-hairline/30" />
          </div>
        )}

        {hasResend && (
          <form
            action={async (formData: FormData) => {
              "use server";
              const email = String(formData.get("email") || "");
              await signIn("resend", { email, redirectTo: callbackUrl });
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
            </div>
            <Button type="submit" variant="primary" size="md" className="w-full">
              Send magic link
            </Button>
          </form>
        )}

        <p className="mt-8 text-center text-xs text-ink-subtle">
          By continuing you agree that Gautam Goyal will process your email to provide access to the client portal.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
      <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83Z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38Z" fill="#EA4335" />
    </svg>
  );
}
