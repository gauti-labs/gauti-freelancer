import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { footerNav } from "@/config/nav";
import { socialLinks } from "@/config/social";
import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="relative border-t border-hairline/20 bg-elevated/40">
      <div className="container py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-muted">
              {site.description}
            </p>
            <div className="mt-8 flex flex-col gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 text-sm text-ink-muted transition-colors hover:text-gold"
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-gold/60 group-hover:text-gold">
                    {s.label}
                  </span>
                  <span>{s.handle}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 md:col-span-8">
            {footerNav.map((group) => (
              <div key={group.title}>
                <h3 className="font-mono text-xs uppercase tracking-widest text-gold">{group.title}</h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-ink-muted transition-colors hover:text-ink"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-hairline/20 pt-8 md:flex-row md:items-center">
          <p className="text-xs text-ink-subtle">
            © {new Date().getFullYear()} {site.name}. {site.positioning}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
            {site.role} · {site.yearsExperience}+ years experience
          </p>
        </div>
      </div>
    </footer>
  );
}
