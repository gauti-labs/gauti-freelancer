import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { HeroCanvas } from "./hero-canvas";
import { site } from "@/config/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 md:pt-40 pb-24 md:pb-32">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
      <div className="absolute inset-0" aria-hidden>
        <HeroCanvas />
      </div>

      {/* Corner brackets — logo language */}
      <div className="pointer-events-none absolute inset-x-0 top-24 mx-auto h-[calc(100%-6rem)] max-w-6xl">
        <div className="absolute left-4 top-0 h-6 w-6 border-l border-t border-gold/30" />
        <div className="absolute right-4 top-0 h-6 w-6 border-r border-t border-gold/30" />
        <div className="absolute bottom-0 left-4 h-6 w-6 border-b border-l border-gold/30" />
        <div className="absolute bottom-0 right-4 h-6 w-6 border-b border-r border-gold/30" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-hairline/30 bg-elevated/40 px-4 py-1.5 backdrop-blur">
            <span className="node-dot" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-gold">
              {site.role} · {site.location}
            </span>
          </div>

          <h1 className="mt-8 font-display text-display-2xl font-medium text-ink text-balance">
            <span className="text-gold-gradient">Gautam Goyal</span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl font-display text-display-lg font-light leading-tight text-ink text-balance">
            I engineer digital products that turn ambitious ideas into reality.
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted text-pretty">
            Full-stack engineering, artificial intelligence, automation and cloud — from architecture to production.
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

          <div className="mt-16 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
            <span className="node-dot" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
