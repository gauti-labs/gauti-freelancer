"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { workspaceNav } from "@/config/workspace";
import { cn } from "@/lib/utils/cn";

export function WorkspaceNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = workspaceNav.filter((i) => !i.adminOnly || isAdmin);
  const current = items.find((i) => (i.href === "/client" ? pathname === "/client" : pathname.startsWith(i.href))) ?? items[0];

  return (
    <div className="border-b border-hairline/20 bg-elevated/40 backdrop-blur-sm">
      <div className="container">
        {/* Desktop: horizontal segmented rail */}
        <nav aria-label="Workspace" className="hidden md:flex">
          <ul className="flex items-center gap-1 py-3">
            {items.map((item) => {
              const active = item.href === "/client" ? pathname === "/client" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group inline-flex items-center gap-2.5 rounded-md px-3.5 py-2 text-sm transition-all",
                      active
                        ? "bg-gold/10 text-gold shadow-[inset_0_0_0_1px_hsl(var(--gold-primary)/0.3)]"
                        : "text-ink-muted hover:bg-elevated hover:text-ink",
                      item.adminOnly && "text-gold/80 hover:text-gold",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile: dropdown */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex w-full items-center justify-between gap-3 py-4 text-left"
          >
            <div className="flex items-center gap-3">
              <current.icon className="h-4 w-4 text-gold" aria-hidden />
              <span className="text-sm font-medium text-ink">{current.label}</span>
            </div>
            <ChevronDown className={cn("h-4 w-4 text-ink-muted transition-transform", open && "rotate-180")} />
          </button>
          {open && (
            <ul className="border-t border-hairline/20 py-2">
              {items.map((item) => {
                const active = item.href === "/client" ? pathname === "/client" : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-3 text-sm",
                        active ? "bg-gold/10 text-gold" : "text-ink hover:bg-elevated",
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
