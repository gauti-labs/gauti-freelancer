import { ArrowRight, Check, Receipt } from "lucide-react";
import { pricingTiers, pricingFooter } from "@/config/pricing";
import { Section } from "@/components/ui/section";
import { WorkspacePageHeader } from "@/components/client/page-header";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const engagementModels = [
  {
    title: "Fixed-scope",
    description:
      "One-off project with a defined deliverable. Best for MVPs, focused builds, and integrations with clear boundaries.",
  },
  {
    title: "Retainer",
    description:
      "Ongoing engineering capacity billed monthly. Best for evolving products, feature velocity, or a fractional CTO relationship.",
  },
  {
    title: "Product build",
    description:
      "Full end-to-end product ownership from architecture through launch and beyond. Best for AI-native products, SaaS platforms, and complex systems.",
  },
];

export default function ClientPricingPage() {
  return (
    <Section className="pt-14 md:pt-16">
      <WorkspacePageHeader
        eyebrow="Workspace · Pricing"
        title="How engagements are structured."
        description="Every project is scoped individually. The tiers below indicate where each engagement begins — most product work benefits from a custom quote."
        icon={Receipt}
      />

      {/* Tiers */}
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {pricingTiers.map((tier) => (
          <div
            key={tier.id}
            className={cn(
              "relative flex flex-col overflow-hidden rounded-xl border p-8",
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
            <div className="mt-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">Starting from</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-5xl font-medium text-gold-gradient">
                  {tier.currency}
                  {tier.startingFrom}
                </span>
              </div>
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
          </div>
        ))}
      </div>

      {/* Engagement models */}
      <div className="mt-16">
        <p className="font-mono text-xs uppercase tracking-widest text-gold">Engagement models</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {engagementModels.map((m) => (
            <div key={m.title} className="rounded-xl border border-hairline/25 bg-elevated/30 p-6">
              <h3 className="font-display text-xl font-medium text-ink">{m.title}</h3>
              <p className="mt-3 text-sm text-ink-muted text-pretty">{m.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 flex flex-col items-start justify-between gap-4 rounded-xl border border-hairline/20 bg-elevated/30 p-6 md:flex-row md:items-center md:p-8">
        <p className="text-ink-muted text-pretty">{pricingFooter.note}</p>
        <ButtonLink href="/start-a-project" variant="primary" size="md">
          {pricingFooter.quoteCtaLabel} <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </div>
    </Section>
  );
}
