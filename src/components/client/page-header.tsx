import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
};

export function WorkspacePageHeader({ eyebrow, title, description, icon: Icon, className }: PageHeaderProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-gold/30 bg-gold/5 text-gold">
            <Icon className="h-4 w-4" aria-hidden />
          </div>
        )}
        <span className="font-mono text-[11px] uppercase tracking-widest text-gold">{eyebrow}</span>
      </div>
      <h1 className="mt-6 max-w-3xl font-display text-4xl font-medium text-ink text-balance md:text-5xl">
        {title}
      </h1>
      {description && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted text-pretty">{description}</p>}
      <div className="mt-10 flex items-center gap-3">
        <span className="node-dot" />
        <div className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent" />
      </div>
    </div>
  );
}
