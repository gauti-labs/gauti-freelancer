import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { buildMetadata } from "@/lib/seo/metadata";
import { pricingTiers, pricingFooter } from "@/config/pricing";
import { Section, SectionEyebrow, SectionHeading, SectionLead } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { site } from "@/config/site";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = buildMetadata({
  title: "Pricing & Engagements",
  description:
    "Transparent starting-from pricing for focused engagements, full applications and advanced AI product engineering. Complex projects receive a custom estimate.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Pricing", url: `${site.url}/pricing` },
        ]}
      />
      <Section className="pt-32 md:pt-40">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Pricing", href: "/pricing" }]} />
        <SectionEyebrow className="mt-10">Pricing</SectionEyebrow>
        <SectionHeading as="h1">Engagement tiers, starting from.</SectionHeading>
        <SectionLead>
          Every project is scoped individually. These starting-from figures indicate where each tier begins. Complex or long-running projects receive a custom estimate.
        </SectionLead>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-xl border p-8 md:p-10",
                tier.featured
                  ? "border-gold/50 bg-elevated/70 shadow-[0_0_0_1px_hsl(var(--gold-primary)/0.15),0_30px_60px_-30px_hsl(var(--gold-primary)/0.3)]"
                  : "border-hairline/25 bg-elevated/40",
              )}
            >
              {tier.featured && (
                <div className="absolute right-6 top-6 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-gold">
                  Most Chosen
                </div>
              )}
              <p className="font-mono text-xs uppercase tracking-widest text-gold">{tier.name}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">Starting from</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-5xl font-medium text-gold-gradient">
                  {tier.currency}
                  {tier.startingFrom}
                </span>
              </div>
              <p className="mt-4 text-ink-muted text-pretty">{tier.positioning}</p>
              <p className="mt-3 text-sm text-ink-subtle text-pretty">{tier.bestFor}</p>

              <ul className="mt-8 flex flex-col gap-3 border-t border-hairline/20 pt-6">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-10">
                <ButtonLink
                  href="/start-a-project"
                  variant={tier.featured ? "primary" : "secondary"}
                  size="md"
                  className="w-full"
                >
                  {tier.cta}
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-xl border border-hairline/20 bg-elevated/30 p-6 md:flex-row md:items-center md:p-8">
          <p className="text-ink-muted text-pretty">{pricingFooter.note}</p>
          <ButtonLink href="/start-a-project" variant="outline" size="sm">
            {pricingFooter.quoteCtaLabel}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
