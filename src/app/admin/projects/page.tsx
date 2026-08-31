import { requireAdmin } from "@/lib/auth/session";
import { AdminPageHeader, InfoBanner } from "@/components/admin/primitives";
import { projects } from "@/config/projects";

export default async function AdminProjectsPage() {
  await requireAdmin();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Projects"
        description="Public work displayed on the site. Currently sourced from the code config for reliability; can be migrated to MongoDB in a later phase."
      />

      <InfoBanner tone="info" title="Currently config-driven">
        Projects live in <code className="font-mono">src/config/projects.ts</code>. Edit that file (and redeploy) to add or
        update entries. Migrating to a DB-backed CRUD interface is a small addition when needed.
      </InfoBanner>

      <div className="overflow-hidden rounded-xl border border-hairline/25 bg-elevated/40">
        <table className="w-full">
          <thead className="border-b border-hairline/20">
            <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Featured</th>
              <th className="px-6 py-3">URL</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-hairline/10 last:border-0 hover:bg-base/30">
                <td className="px-6 py-4 text-ink">{p.title}</td>
                <td className="px-6 py-4 text-sm text-ink-muted">{p.category}</td>
                <td className="px-6 py-4">
                  {p.featured ? (
                    <span className="rounded-full border border-gold/40 bg-gold/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-gold">
                      Featured
                    </span>
                  ) : (
                    <span className="text-ink-subtle">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gold hover:underline"
                    >
                      {p.url.replace(/^https?:\/\//, "")}
                    </a>
                  ) : (
                    <span className="text-ink-subtle">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
