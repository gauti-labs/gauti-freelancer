"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { primaryNav } from "@/config/nav";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils/cn";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-hairline/20 bg-base/80 backdrop-blur-lg"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container flex h-16 items-center justify-between md:h-20">
          <Logo />

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium tracking-tight transition-colors",
                  pathname.startsWith(item.href)
                    ? "text-gold"
                    : "text-ink-muted hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {session ? (
              <ButtonLink href="/client" variant="secondary" size="sm">
                Client Portal
              </ButtonLink>
            ) : (
              <ButtonLink href="/start-a-project" variant="primary" size="sm">
                Start a Project
              </ButtonLink>
            )}
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-hairline/30 text-ink-muted hover:border-gold/50 hover:text-gold"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-x-0 top-16 z-40 origin-top border-b border-hairline/20 bg-base/95 backdrop-blur-xl transition-all duration-300 md:hidden",
          open ? "pointer-events-auto scale-y-100 opacity-100" : "pointer-events-none scale-y-95 opacity-0",
        )}
      >
        <nav className="container flex flex-col gap-1 py-6" aria-label="Mobile primary">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-3 text-base font-medium transition-colors",
                pathname.startsWith(item.href) ? "bg-gold/5 text-gold" : "text-ink hover:bg-gold/5",
              )}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-3">
            {session ? (
              <ButtonLink href="/client" variant="secondary" size="md">
                Client Portal
              </ButtonLink>
            ) : (
              <ButtonLink href="/start-a-project" variant="primary" size="md">
                Start a Project
              </ButtonLink>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
