import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { WorkspaceNav } from "@/components/client/workspace-nav";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Client Portal",
};

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=/client");

  const isAdmin = session.user.role === "admin";
  const initial = (session.user.name || session.user.email || "?").charAt(0).toUpperCase();

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-15" aria-hidden />

      {/* Top bar */}
      <header className="relative z-20 border-b border-hairline/20 bg-base/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between md:h-20">
          <div className="flex items-center gap-6">
            <Logo />
            <span className="hidden font-mono text-[10px] uppercase tracking-widest text-gold/70 md:inline">
              Workspace
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center gap-2.5 rounded-full border border-hairline/25 bg-elevated/60 py-1 pl-1 pr-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-gradient font-display text-[11px] font-bold text-[hsl(var(--bg-base))]">
                  {initial}
                </span>
                <span className="text-xs text-ink">{session.user.email}</span>
              </div>
            </div>
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

      {/* Workspace sub-nav */}
      <div className="relative z-10">
        <WorkspaceNav isAdmin={isAdmin} />
      </div>

      <main id="main" className="relative z-10">{children}</main>
    </div>
  );
}
