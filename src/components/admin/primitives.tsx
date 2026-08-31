import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-hairline/20 pb-6 md:flex-row md:items-end">
      <div>
        <h1 className="font-display text-3xl font-medium text-ink md:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-sm text-ink-muted text-pretty">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-hairline/25 bg-elevated/40 p-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-ink-muted" aria-hidden />}
      </div>
      <p className="mt-4 font-display text-4xl font-medium text-ink">{value}</p>
      {hint && <p className="mt-2 text-xs text-ink-subtle">{hint}</p>}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="corner-brackets relative overflow-hidden rounded-xl border border-hairline/25 bg-elevated/30 p-12 text-center">
      <p className="font-display text-xl font-medium text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function InfoBanner({
  tone = "warning",
  title,
  children,
}: {
  tone?: "warning" | "info";
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5",
        tone === "warning" ? "border-gold/40 bg-gold/5" : "border-hairline/30 bg-elevated/40",
      )}
    >
      <p
        className={cn(
          "font-mono text-[10px] uppercase tracking-widest",
          tone === "warning" ? "text-gold" : "text-ink-muted",
        )}
      >
        {title}
      </p>
      <div className="mt-2 text-sm text-ink">{children}</div>
    </div>
  );
}
