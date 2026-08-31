import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { buildMetadata } from "@/lib/seo/metadata";
import { getService, services } from "@/config/services";
import { Section, SectionEyebrow, SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { site } from "@/config/site";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service not found" };
  return buildMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Services", url: `${site.url}/services` },
          { name: service.title, url: `${site.url}/services/${service.slug}` },
        ]}
      />
      <Section className="pt-32 md:pt-40">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: service.shortTitle, href: `/services/${service.slug}` },
          ]}
        />
        <SectionEyebrow className="mt-10">Service</SectionEyebrow>
        <SectionHeading as="h1">{service.title}</SectionHeading>
        <p className="mt-6 max-w-3xl text-xl leading-relaxed text-ink text-pretty">{service.tagline}</p>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-muted text-pretty">{service.description}</p>

        <div className="mt-16 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="font-mono text-xs uppercase tracking-widest text-gold">What you get</h2>
            <ul className="mt-6 flex flex-col gap-4">
              {service.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 border-b border-hairline/20 pb-4 last:border-0">
                  <Check className="mt-1 h-4 w-4 flex-shrink-0 text-gold" />
                  <span className="text-ink text-pretty">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-5">
            <div className="corner-brackets relative overflow-hidden rounded-xl border border-hairline/25 bg-elevated/40 p-8">
              <p className="font-mono text-xs uppercase tracking-widest text-gold">Technologies</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {service.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-hairline/25 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-10">
                <ButtonLink href="/start-a-project" variant="primary" size="md" className="w-full">
                  Discuss This Service
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24">
            <p className="font-mono text-xs uppercase tracking-widest text-gold">Related services</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/services/${r.slug}`}
                  className="group flex items-center justify-between rounded-lg border border-hairline/25 bg-elevated/30 p-5 transition-colors hover:border-gold/50 hover:bg-elevated/60"
                >
                  <span className="text-sm text-ink">{r.title}</span>
                  <ArrowRight className="h-4 w-4 text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-gold" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
