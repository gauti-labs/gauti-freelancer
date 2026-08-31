import { requireAdmin } from "@/lib/auth/session";
import { collection, Collections } from "@/lib/db/collections";
import { AdminPageHeader, EmptyState, InfoBanner } from "@/components/admin/primitives";
import { getAdminEmails } from "@/lib/auth/admin";
import { cn } from "@/lib/utils/cn";

type UserRow = {
  _id: string;
  name?: string;
  email?: string;
  image?: string;
  emailVerified?: Date;
};

type AccountRow = {
  userId: string;
  provider: string;
};

async function loadUsers(): Promise<{ users: UserRow[]; providersByUser: Record<string, string[]> }> {
  if (!process.env.MONGODB_URI) return { users: [], providersByUser: {} };
  try {
    const [usersCol, accountsCol] = await Promise.all([
      collection(Collections.Users),
      collection(Collections.Accounts),
    ]);
    const [rawUsers, rawAccounts] = await Promise.all([
      usersCol.find({}).sort({ _id: -1 }).limit(200).toArray(),
      accountsCol.find({}).project({ userId: 1, provider: 1 }).limit(500).toArray(),
    ]);
    const providersByUser: Record<string, string[]> = {};
    for (const a of rawAccounts as unknown as AccountRow[]) {
      const key = String(a.userId);
      providersByUser[key] = providersByUser[key] || [];
      providersByUser[key].push(a.provider);
    }
    return {
      users: rawUsers.map((u) => ({
        _id: String(u._id),
        name: (u.name as string) || undefined,
        email: (u.email as string) || undefined,
        image: (u.image as string) || undefined,
        emailVerified: (u.emailVerified as Date) || undefined,
      })),
      providersByUser,
    };
  } catch {
    return { users: [], providersByUser: {} };
  }
}

export default async function AdminUsersPage() {
  await requireAdmin();
  const { users, providersByUser } = await loadUsers();
  const admins = new Set(getAdminEmails());

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Users"
        description="Registered users from Auth.js. Admins are flagged in gold — managed via ADMIN_EMAILS."
      />

      {!process.env.MONGODB_URI && (
        <InfoBanner title="Database not configured">
          Configure <code className="font-mono">MONGODB_URI</code> to view registered users.
        </InfoBanner>
      )}

      {users.length === 0 ? (
        <EmptyState
          title="No users yet"
          description="Users will appear here after they sign in for the first time."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-hairline/25 bg-elevated/40">
          <table className="w-full">
            <thead className="border-b border-hairline/20">
              <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Providers</th>
                <th className="px-6 py-3">Verified</th>
                <th className="px-6 py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isAdmin = u.email ? admins.has(u.email.toLowerCase()) : false;
                const providers = providersByUser[u._id] || [];
                return (
                  <tr key={u._id} className="border-b border-hairline/10 last:border-0 hover:bg-base/30">
                    <td className="px-6 py-4">
                      <p className="text-ink">{u.name || u.email?.split("@")[0] || "—"}</p>
                      <p className="mt-0.5 text-xs text-ink-subtle">{u.email || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {providers.length === 0 && (
                          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
                            email
                          </span>
                        )}
                        {providers.map((p) => (
                          <span
                            key={p}
                            className="rounded-full border border-hairline/25 bg-base/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-muted"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-ink-subtle">
                      {u.emailVerified ? new Date(u.emailVerified).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest",
                          isAdmin
                            ? "border-gold/50 bg-gold/10 text-gold"
                            : "border-hairline/30 text-ink-muted",
                        )}
                      >
                        {isAdmin ? "Admin" : "User"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
