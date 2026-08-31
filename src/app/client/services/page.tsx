import Link from "next/link";
import { ArrowUpRight, Briefcase } from "lucide-react";
import { services } from "@/config/services";
import { Section } from "@/components/ui/section";
import { WorkspacePageHeader } from "@/components/client/page-header";

export default function ClientServicesPage() {
  return (
    <Section className="pt-14 md:pt-16">
      <WorkspacePageHeader
        eyebrow="Workspace · Services"
        title="Engineering services, end to end."
        description="A closer look at what each engagement covers. Public service pages exist for search visibility; the version here is intended for you as a prospective client."
        icon={Briefcase}
      />

      <div className="mt-12 grid gap-4">
        {services.map((service, i) => (
          <div
            key={service.slug}
            className="group grid gap-6 rounded-xl border border-hairline/25 bg-elevated/40 p-8 transition-colors hover:border-gold/40 md:grid-cols-12"
          >
            <div className="md:col-span-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
                  {service.shortTitle}
                </span>
              </div>
              <h2 className="mt-3 font-display text-2xl font-medium text-ink">{service.title}</h2>
              <p className="mt-3 text-sm text-ink-muted">{service.tagline}</p>
              <Link
                href={`/services/${service.slug}`}
                className="mt-5 inline-flex items-center gap-2 text-sm text-gold transition-transform hover:translate-x-0.5"
              >
                Full service page <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="md:col-span-5">
              <p className="text-ink text-pretty">{service.description}</p>
              <ul className="mt-5 grid gap-2">
                {service.benefits.slice(0, 3).map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-ink-muted">
                    <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-gold" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-gold">Tech</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {service.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-hairline/25 bg-base/40 px-2.5 py-1 font-mono text-[10px] tracking-wide text-ink-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
