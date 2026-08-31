import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo/metadata";
import { projects } from "@/config/projects";
import { Section, SectionEyebrow, SectionHeading, SectionLead } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { site } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Selected Work",
  description:
    "Selected publicly disclosable projects engineered by Gautam Goyal. Additional client engagements are covered under confidentiality.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Work", url: `${site.url}/work` },
        ]}
      />
      <Section className="pt-32 md:pt-40">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Work", href: "/work" }]} />
        <SectionEyebrow className="mt-10">Work</SectionEyebrow>
        <SectionHeading as="h1">Publicly disclosable projects.</SectionHeading>
        <SectionLead>
          A subset of engagements that can be shared publicly. Additional work is covered under confidentiality agreements.
        </SectionLead>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col overflow-hidden rounded-xl border border-hairline/25 bg-elevated/40 p-8 transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:bg-elevated/70"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gold/80">
                  {project.category}
                </span>
                <ArrowUpRight className="h-4 w-4 text-ink-muted transition-all group-hover:text-gold group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <h3 className="mt-8 font-display text-2xl font-medium text-ink md:text-3xl">{project.title}</h3>
              <p className="mt-3 text-ink-muted">{project.description}</p>
              <div className="mt-10 flex flex-wrap gap-2 border-t border-hairline/20 pt-6">
                {project.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-hairline/25 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-hairline/20 bg-elevated/30 p-8 md:p-10">
          <p className="font-mono text-xs uppercase tracking-widest text-gold">Confidential Engagements</p>
          <p className="mt-4 max-w-3xl text-lg text-ink text-pretty">
            Selected work includes confidential client engagements that cannot be publicly disclosed.
          </p>
        </div>
      </Section>
    </>
  );
}
