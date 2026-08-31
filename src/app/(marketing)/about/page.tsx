import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { Section, SectionEyebrow, SectionHeading, SectionLead } from "@/components/ui/section";
import { site } from "@/config/site";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "About Gautam Goyal — Digital Architect based in India",
  description:
    "Gautam Goyal is a Digital Architect with 8 years of industry experience across full-stack engineering, AI, cloud and automation. Bachelor of Engineering in Computer Science. Based in India, working worldwide.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "About", url: `${site.url}/about` },
        ]}
      />
      <Section className="pt-32 md:pt-40">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]} />
        <SectionEyebrow className="mt-10">About</SectionEyebrow>
        <SectionHeading as="h1" className="max-w-4xl">
          Engineering is a discipline. The output is a product.
        </SectionHeading>
        <SectionLead>
          I&apos;m Gautam Goyal, a Digital Architect based in India, working with ambitious businesses worldwide.
          Eight years of building software across web, mobile, backend, cloud and AI — with a preference for shipping over talking about shipping.
        </SectionLead>

        <div className="mt-20 grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="prose-content flex flex-col gap-6 text-lg leading-relaxed text-ink-muted">
              <p>
                My work sits at the intersection of software engineering and product thinking. The point of the technology
                isn&apos;t the technology — it&apos;s the outcome. Faster onboarding. Fewer support tickets. A workflow that
                takes minutes instead of days. A product that people actually adopt.
              </p>
              <p>
                Over the last eight years I&apos;ve built full-stack applications, e-commerce platforms, mobile apps and — more
                recently — AI-native systems. I work end-to-end because it produces better products: architecture, backend,
                frontend, deployment and observability treated as one system rather than four teams.
              </p>
              <p>
                My current focus is on modern AI applied where it creates durable value — generative AI, retrieval-augmented
                systems, and agentic architectures — combined with the engineering discipline needed to run those systems in
                production without surprises.
              </p>
              <p>
                I&apos;m selective about the work I take on. If a project is well-scoped, ambitious and has room for real
                engineering craft, we&apos;ll probably work well together.
              </p>
            </div>
          </div>

          <aside className="md:col-span-5">
            <div className="corner-brackets relative overflow-hidden rounded-xl border border-hairline/25 bg-elevated/40 p-8">
              <p className="font-mono text-xs uppercase tracking-widest text-gold">Snapshot</p>
              <dl className="mt-6 grid gap-5">
                <FactRow label="Role" value={site.role} />
                <FactRow label="Experience" value={`${site.yearsExperience}+ years`} />
                <FactRow label="Education" value={site.education} />
                <FactRow label="Location" value="India" />
                <FactRow label="Availability" value="Worldwide" />
                <FactRow
                  label="Focus"
                  value="Full-stack, AI, Agentic AI, Automation, Cloud"
                />
              </dl>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-hairline/20 pb-4 last:border-0 last:pb-0">
      <dt className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
