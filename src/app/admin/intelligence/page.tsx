import { requireAdmin } from "@/lib/auth/session";
import { collection, Collections, type AiRequestDoc } from "@/lib/db/collections";
import { AdminPageHeader, EmptyState, InfoBanner } from "@/components/admin/primitives";

async function loadRequests() {
  if (!process.env.MONGODB_URI) return [];
  try {
    const col = await collection<AiRequestDoc>(Collections.AiRequests);
    const rows = await col.find({}).sort({ createdAt: -1 }).limit(100).toArray();
    return rows.map((r) => ({ ...r, _id: String(r._id) }));
  } catch {
    return [];
  }
}

export default async function AdminIntelligencePage() {
  await requireAdmin();
  const rows = await loadRequests();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="AI Requests"
        description="Every Project Intelligence analysis run by authenticated clients. Useful for reviewing intent and shaping outreach."
      />

      {!process.env.MONGODB_URI && (
        <InfoBanner title="Database not configured">
          Configure <code className="font-mono">MONGODB_URI</code> to view stored AI requests.
        </InfoBanner>
      )}

      {rows.length === 0 ? (
        <EmptyState
          title="No analyses yet"
          description="Client Project Intelligence submissions will appear here."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((r) => (
            <li
              key={r._id}
              className="rounded-xl border border-hairline/25 bg-elevated/40 p-6 transition-colors hover:border-gold/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-ink">{r.userEmail}</p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
                    {new Date(r.createdAt).toLocaleString()} · {r.model} · {(r.durationMs || 0) / 1000}s
                  </p>
                </div>
              </div>
              <p className="mt-4 line-clamp-3 text-sm text-ink-muted">{r.brief}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
