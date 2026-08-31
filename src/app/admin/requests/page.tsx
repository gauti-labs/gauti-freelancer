import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { collection, Collections, type ProjectRequestDoc } from "@/lib/db/collections";
import { AdminPageHeader, EmptyState, InfoBanner } from "@/components/admin/primitives";
import { StatusPill, type RequestStatus, REQUEST_STATUSES, statusLabel } from "@/components/admin/status-pill";
import { cn } from "@/lib/utils/cn";

type SearchParams = Promise<{ status?: string }>;

async function loadRequests(status?: string): Promise<(Omit<ProjectRequestDoc, "_id"> & { _id: string })[]> {
  if (!process.env.MONGODB_URI) return [];
  try {
    const col = await collection<ProjectRequestDoc>(Collections.ProjectRequests);
    const filter: Record<string, unknown> = {};
    if (status && REQUEST_STATUSES.includes(status as RequestStatus)) filter.status = status;
    const docs = await col.find(filter).sort({ createdAt: -1 }).limit(100).toArray();
    return docs.map((r) => ({ ...r, _id: String(r._id) }));
  } catch {
    return [];
  }
}

export default async function AdminRequestsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const { status } = await searchParams;
  const active = REQUEST_STATUSES.includes(status as RequestStatus) ? (status as RequestStatus) : null;
  const rows = await loadRequests(active ?? undefined);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Project Requests"
        description="All inbound project inquiries. Update status inline from the detail view."
      />

      {!process.env.MONGODB_URI && (
        <InfoBanner title="Database not configured">
          Configure <code className="font-mono">MONGODB_URI</code> to view stored project requests.
        </InfoBanner>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterTab href="/admin/requests" active={active === null}>
          All
        </FilterTab>
        {REQUEST_STATUSES.map((s) => (
          <FilterTab key={s} href={`/admin/requests?status=${s}`} active={active === s}>
            {statusLabel(s)}
          </FilterTab>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No requests"
          description={
            active
              ? `There are no requests with status "${statusLabel(active)}".`
              : "New project requests will appear here as they arrive."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-hairline/25 bg-elevated/40">
          <div className="hidden md:block">
            <table className="w-full">
              <thead className="border-b border-hairline/20">
                <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Budget</th>
                  <th className="px-6 py-3">Timeline</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Received</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r._id} className="border-b border-hairline/10 last:border-0 hover:bg-base/30">
                    <td className="px-6 py-4">
                      <Link href={`/admin/requests/${r._id}`} className="text-ink hover:text-gold">
                        {r.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-ink-subtle">{r.email}</p>
                      {r.company && <p className="mt-0.5 text-xs text-ink-subtle">{r.company}</p>}
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-muted">{r.projectType}</td>
                    <td className="px-6 py-4 text-sm text-ink-muted">{r.budget || "—"}</td>
                    <td className="px-6 py-4 text-sm text-ink-muted">{r.timeline || "—"}</td>
                    <td className="px-6 py-4">
                      <StatusPill status={r.status as RequestStatus} />
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-ink-subtle">
                      {new Date(r.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <ul className="divide-y divide-hairline/10 md:hidden">
            {rows.map((r) => (
              <li key={r._id}>
                <Link href={`/admin/requests/${r._id}`} className="block p-5 hover:bg-base/30">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-ink">{r.name}</p>
                      <p className="mt-0.5 text-xs text-ink-subtle">{r.email}</p>
                    </div>
                    <StatusPill status={r.status as RequestStatus} />
                  </div>
                  <p className="mt-3 text-sm text-ink-muted">{r.projectType}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FilterTab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors",
        active
          ? "border-gold/50 bg-gold/10 text-gold"
          : "border-hairline/30 text-ink-muted hover:border-gold/30 hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
