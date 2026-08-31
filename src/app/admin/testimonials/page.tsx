import { requireAdmin } from "@/lib/auth/session";
import { AdminPageHeader, EmptyState, InfoBanner } from "@/components/admin/primitives";

export default async function AdminTestimonialsPage() {
  await requireAdmin();

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Testimonials"
        description="Foundation for future real client testimonials. Nothing is displayed publicly until entries are added here."
      />

      <InfoBanner tone="info" title="Policy">
        Testimonials on the public site are intentionally absent until real, verified quotes are available. No placeholder or
        fabricated testimonials are used. Add entries here in a later phase to have them rendered on the public site.
      </InfoBanner>

      <EmptyState
        title="No testimonials"
        description="A create form will appear here in a subsequent phase. The data model already exists in MongoDB (`testimonials` collection)."
      />
    </div>
  );
}
