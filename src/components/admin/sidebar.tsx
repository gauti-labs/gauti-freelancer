"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNav } from "@/config/admin-nav";
import { cn } from "@/lib/utils/cn";

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-gold">Admin</p>
      {adminNav.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-all",
              active
                ? "bg-gold/10 text-gold shadow-[inset_0_0_0_1px_hsl(var(--gold-primary)/0.3)]"
                : "text-ink-muted hover:bg-elevated hover:text-ink",
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
