import * as React from "react";
import { cn } from "@/lib/utils/cn";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  as?: "section" | "div" | "article";
  bleed?: boolean;
};

export function Section({ as: Tag = "section", className, bleed, children, ...props }: SectionProps) {
  return (
    <Tag className={cn("relative py-24 md:py-32", className)} {...props}>
      {bleed ? children : <div className="container">{children}</div>}
    </Tag>
  );
}

export function SectionEyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-gold", className)}>
      <span className="node-dot" />
      <span>{children}</span>
    </div>
  );
}

export function SectionHeading({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={cn(
        "mt-5 max-w-3xl font-display text-display-lg font-medium text-ink text-balance",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function SectionLead({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted text-pretty", className)}>{children}</p>
  );
}
