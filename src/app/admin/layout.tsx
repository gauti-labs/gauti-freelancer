import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { signOut } from "@/auth";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button, ButtonLink } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/sidebar";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Admin",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="relative min-h-screen">
      <header className="border-b border-hairline/20 bg-base/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between md:h-20">
          <div className="flex items-center gap-6">
            <Logo />
            <span className="hidden font-mono text-[10px] uppercase tracking-widest text-gold md:inline">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ButtonLink href="/client" variant="ghost" size="sm">
              <ArrowLeft className="h-3.5 w-3.5" /> Client view
            </ButtonLink>
            <span className="hidden font-mono text-[11px] uppercase tracking-widest text-ink-muted md:inline">
              {session.user?.email}
            </span>
            <ThemeToggle />
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="container py-8 md:py-10">
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <aside className="md:sticky md:top-24 md:h-fit">
            <AdminSidebar />
          </aside>
          <main id="main">{children}</main>
        </div>
      </div>
    </div>
  );
}
