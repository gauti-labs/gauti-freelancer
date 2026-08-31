import Link from "next/link";
import { ArrowRight, Inbox, Users, Sparkles, Activity } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { collection, Collections, type ProjectRequestDoc, type AiRequestDoc } from "@/lib/db/collections";
import { getAdminEmails } from "@/lib/auth/admin";
import { AdminPageHeader, StatCard, InfoBanner } from "@/components/admin/primitives";
import { StatusPill, type RequestStatus } from "@/components/admin/status-pill";

type OverviewData = {
  dbConfigured: boolean;
  userCount: number;
  requestCount: number;
  newCount: number;
  aiCount: number;
  recentRequests: (Omit<ProjectRequestDoc, "_id"> & { _id: string })[];
};

async function loadOverview(): Promise<OverviewData> {
  const dbConfigured = !!process.env.MONGODB_URI;
  if (!dbConfigured) {
    return { dbConfigured: false, userCount: 0, requestCount: 0, newCount: 0, aiCount: 0, recentRequests: [] };
  }
  try {
    const [users, requests, ai] = await Promise.all([
      collection(Collections.Users),
      collection<ProjectRequestDoc>(Collections.ProjectRequests),
      collection<AiRequestDoc>(Collections.AiRequests),
    ]);
    const [userCount, requestCount, newCount, aiCount, recent] = await Promise.all([
      users.countDocuments({}),
      requests.countDocuments({}),
      requests.countDocuments({ status: "new" }),
      ai.countDocuments({}),
      requests.find({}).sort({ createdAt: -1 }).limit(5).toArray(),
    ]);
    return {
      dbConfigured: true,
      userCount,
      requestCount,
      newCount,
      aiCount,
      recentRequests: recent.map((r) => ({ ...r, _id: String(r._id) })),
    };
  } catch {
    return { dbConfigured: false, userCount: 0, requestCount: 0, newCount: 0, aiCount: 0, recentRequests: [] };
  }
}

export default async function AdminOverviewPage() {
  await requireAdmin();
  const data = await loadOverview();
  const admins = getAdminEmails();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Overview"
        description="System state at a glance. All data is read live from MongoDB."
      />

      {!data.dbConfigured && (
        <InfoBanner tone="warning" title="Database not configured">
          Set <code className="font-mono">MONGODB_URI</code> in your environment to enable the admin dashboard.
          Read-only counters below will remain at zero until the DB is reachable.
        </InfoBanner>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Users" value={data.userCount} icon={Users} />
        <StatCard label="Total requests" value={data.requestCount} icon={Inbox} />
        <StatCard label="New requests" value={data.newCount} hint="Awaiting first review" icon={Activity} />
        <StatCard label="AI analyses" value={data.aiCount} icon={Sparkles} />
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-medium text-ink">Recent project requests</h2>
          <Link
            href="/admin/requests"
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-gold"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-hairline/25 bg-elevated/40">
          {data.recentRequests.length === 0 ? (
            <div className="p-10 text-center text-sm text-ink-muted">No requests yet.</div>
          ) : (
            <table className="w-full">
              <thead className="border-b border-hairline/20">
                <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Received</th>
                </tr>
              </thead>
              <tbody>
                {data.recentRequests.map((r) => (
                  <tr key={r._id} className="border-b border-hairline/10 last:border-0 hover:bg-base/30">
                    <td className="px-6 py-4">
                      <Link href={`/admin/requests/${r._id}`} className="text-ink hover:text-gold">
                        {r.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-ink-subtle">{r.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-muted">{r.projectType}</td>
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
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink">Admin allowlist</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Emails granted admin role on sign-in. Managed via the <code className="font-mono">ADMIN_EMAILS</code> env var.
        </p>
        <div className="mt-4 rounded-xl border border-hairline/25 bg-elevated/40 p-6">
          {admins.length === 0 ? (
            <p className="text-sm text-ink-muted">
              No admins configured. Set <code className="font-mono">ADMIN_EMAILS</code> to a comma-separated list.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {admins.map((email) => (
                <li
                  key={email}
                  className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-3 py-1 font-mono text-xs text-gold"
                >
                  {email}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
