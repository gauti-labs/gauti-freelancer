import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { label: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-gold" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="transition-colors hover:text-ink">
                  {item.label}
                </Link>
              )}
              {!isLast && <ChevronRight className="h-3 w-3 text-ink-subtle" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
