import Link from "next/link";
import { Mail } from "lucide-react";
import { Hexagon } from "@/components/ui/hexagon";

export default function VerifyRequestPage() {
  return (
    <div className="w-full max-w-md">
      <div className="corner-brackets relative overflow-hidden rounded-xl border border-hairline/25 bg-elevated/60 p-8 text-center md:p-10">
        <Hexagon size={56} className="mx-auto">
          <Mail className="h-5 w-5 text-gold" />
        </Hexagon>
        <h1 className="mt-6 font-display text-3xl font-medium text-ink">Check your email</h1>
        <p className="mt-3 text-sm text-ink-muted">
          A sign-in link has been sent to your email address. Open it on this device to continue.
        </p>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-ink-subtle">Link expires in 24 hours</p>
        <Link
          href="/"
          className="mt-8 inline-block text-sm text-ink-muted transition-colors hover:text-ink"
        >
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
