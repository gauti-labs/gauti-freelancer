import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
      <header className="relative z-10 container flex h-20 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-ink-muted transition-colors hover:text-ink">
            ← Back to site
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-16">{children}</main>
    </div>
  );
}
