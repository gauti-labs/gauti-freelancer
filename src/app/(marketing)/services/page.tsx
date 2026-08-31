import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo/metadata";
import { services } from "@/config/services";
import { Section, SectionEyebrow, SectionHeading, SectionLead } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { site } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Services — Full-Stack, AI, Automation, Cloud & E-commerce",
  description:
    "Services offered by Gautam Goyal: full-stack development, AI development, AI automation, e-commerce, web and mobile applications, DevOps, and technical SEO.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Services", url: `${site.url}/services` },
        ]}
      />
      <Section className="pt-32 md:pt-40">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }]} />
        <SectionEyebrow className="mt-10">Services</SectionEyebrow>
        <SectionHeading as="h1">Engineering services, end to end.</SectionHeading>
        <SectionLead>
          Design, architecture, engineering and deployment — offered as focused services or combined into full product engagements.
        </SectionLead>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {services.map((service, i) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-hairline/25 bg-elevated/40 p-8 transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:bg-elevated/70"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gold/80">
                  {String(i + 1).padStart(2, "0")} · {service.shortTitle}
                </span>
                <ArrowUpRight className="h-4 w-4 text-ink-muted transition-all group-hover:text-gold group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <h3 className="mt-6 font-display text-2xl font-medium text-ink md:text-3xl">{service.title}</h3>
              <p className="mt-3 text-ink-muted text-pretty">{service.tagline}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
