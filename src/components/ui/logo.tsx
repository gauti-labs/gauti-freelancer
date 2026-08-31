import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type LogoProps = {
  className?: string;
  variant?: "mark" | "wordmark";
  href?: string;
};

/**
 * The mark is inline SVG so it inherits currentColor for perfect theme integration
 * and remains crisp at any size. Derived from the official logo geometry (hexagon + GG).
 */
export function Logo({ className, variant = "mark", href = "/" }: LogoProps) {
  const content = variant === "mark" ? <LogoMark /> : <LogoWordmark />;
  if (!href) return content;
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-3 rounded-md transition-opacity hover:opacity-90 focus-visible:opacity-90",
        className,
      )}
      aria-label="Gautam Goyal — Digital Architect"
    >
      {content}
    </Link>
  );
}

function LogoMark() {
  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden>
        <defs>
          <linearGradient id="logo-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--gold-highlight))" />
            <stop offset="55%" stopColor="hsl(var(--gold-primary))" />
            <stop offset="100%" stopColor="hsl(var(--gold-deep))" />
          </linearGradient>
        </defs>
        <polygon
          points="20,3 34,11 34,29 20,37 6,29 6,11"
          fill="none"
          stroke="url(#logo-gold)"
          strokeWidth="1.2"
          opacity="0.55"
        />
        <text
          x="14"
          y="26"
          fontFamily="Georgia, serif"
          fontSize="18"
          fontWeight="700"
          fill="url(#logo-gold)"
          textAnchor="middle"
        >
          G
        </text>
        <text
          x="26"
          y="26"
          fontFamily="Georgia, serif"
          fontSize="18"
          fontWeight="700"
          fill="url(#logo-gold)"
          textAnchor="middle"
        >
          G
        </text>
      </svg>
      <div className="flex flex-col leading-none">
        <span className="font-display text-sm font-medium tracking-tight text-ink">Gautam Goyal</span>
        <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-gold/80">Digital Architect</span>
      </div>
    </div>
  );
}

function LogoWordmark() {
  return (
    <div className="flex flex-col">
      <span className="text-gold-gradient font-display text-3xl font-bold tracking-tight">GG</span>
      <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-gold/70">Gautam Goyal</span>
    </div>
  );
}
