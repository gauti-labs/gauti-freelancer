"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = mounted ? (resolvedTheme ?? theme ?? "dark") : "dark";
  const isDark = current === "dark";
  const nextTheme = isDark ? "light" : "dark";

  function handleToggle() {
    // Keep the CSS variable theme in sync immediately, even before providers settle.
    document.documentElement.setAttribute("data-theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${nextTheme} mode`}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-hairline/30",
        "text-ink-muted transition-all hover:border-gold/50 hover:text-gold",
        className,
      )}
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-4 w-4" aria-hidden />
        ) : (
          <Moon className="h-4 w-4" aria-hidden />
        )
      ) : (
        <Sun className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
