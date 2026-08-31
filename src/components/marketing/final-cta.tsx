import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-hairline/20 py-32 md:py-40">
      <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
      <div className="absolute inset-0 bg-radial-glow" aria-hidden />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="node-dot" />
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold/60" />
          </div>

          <h2 className="mt-8 font-display text-display-xl font-light leading-tight text-ink text-balance">
            Have an ambitious idea?
          </h2>
          <p className="mt-4 font-display text-display-xl font-medium text-balance">
            <span className="text-gold-gradient">Let&apos;s engineer it.</span>
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink href="/start-a-project" variant="primary" size="lg">
              Start a Project
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/work" variant="secondary" size="lg">
              Explore My Work
              <ArrowUpRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
