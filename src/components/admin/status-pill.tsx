import { cn } from "@/lib/utils/cn";

export const REQUEST_STATUSES = ["new", "reviewing", "contacted", "in_progress", "completed", "archived"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

const STATUS_LABEL: Record<RequestStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  contacted: "Contacted",
  in_progress: "In Progress",
  completed: "Completed",
  archived: "Archived",
};

const STATUS_STYLE: Record<RequestStatus, string> = {
  new: "border-gold/50 bg-gold/10 text-gold",
  reviewing: "border-blue-400/40 bg-blue-400/5 text-blue-300",
  contacted: "border-purple-400/40 bg-purple-400/5 text-purple-300",
  in_progress: "border-cyan-400/40 bg-cyan-400/5 text-cyan-300",
  completed: "border-emerald-400/40 bg-emerald-400/5 text-emerald-300",
  archived: "border-hairline/40 bg-elevated/40 text-ink-muted",
};

export function StatusPill({ status }: { status: RequestStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest",
        STATUS_STYLE[status],
      )}
    >
      <span className="h-1 w-1 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function statusLabel(s: RequestStatus): string {
  return STATUS_LABEL[s];
}
