"use client";

import { useTransition } from "react";
import { Select } from "@/components/ui/select";
import { REQUEST_STATUSES, type RequestStatus, statusLabel } from "@/components/admin/status-pill";
import { updateRequestStatus } from "@/app/admin/actions";
import { Loader2 } from "lucide-react";

export function StatusChanger({ id, current }: { id: string; current: RequestStatus }) {
  const [pending, start] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as RequestStatus;
    if (next === current) return;
    start(async () => {
      await updateRequestStatus(id, next);
    });
  }

  return (
    <div className="flex items-center gap-3">
      <Select
        defaultValue={current}
        onChange={onChange}
        disabled={pending}
        aria-label="Update status"
        className="max-w-xs"
      >
        {REQUEST_STATUSES.map((s) => (
          <option key={s} value={s}>
            {statusLabel(s)}
          </option>
        ))}
      </Select>
      {pending && <Loader2 className="h-4 w-4 animate-spin text-gold" />}
    </div>
  );
}
