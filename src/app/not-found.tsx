import Link from "next/link";
import { Hexagon } from "@/components/ui/hexagon";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-24">
      <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
      <div className="relative z-10 text-center">
        <Hexagon size={72} className="mx-auto">
          <span className="font-display text-2xl text-gold">404</span>
        </Hexagon>
        <h1 className="mt-8 font-display text-display-xl font-medium text-ink">Nothing here.</h1>
        <p className="mt-4 max-w-md text-ink-muted">
          The page you were looking for does not exist or has been moved.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ButtonLink href="/" variant="primary" size="md">
            Return home
          </ButtonLink>
          <Link href="/work" className="text-sm text-ink-muted transition-colors hover:text-gold">
            Explore work →
          </Link>
        </div>
      </div>
    </div>
  );
}
