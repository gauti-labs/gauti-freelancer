import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { ProjectForm } from "@/components/marketing/project-form";
import { Section, SectionEyebrow, SectionHeading, SectionLead } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { site } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Start a Project",
  description:
    "Tell Gautam Goyal about your project. Full-stack, AI, automation, cloud and e-commerce engagements — response within 1–2 business days.",
  path: "/start-a-project",
});

export default function StartProjectPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Start a Project", url: `${site.url}/start-a-project` },
        ]}
      />
      <Section className="pt-32 md:pt-40">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Start a Project", href: "/start-a-project" },
          ]}
        />
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionEyebrow className="mt-10">Start a Project</SectionEyebrow>
            <SectionHeading as="h1">Tell me about your project.</SectionHeading>
            <SectionLead>
              A few details help me give you a useful response the first time. Everything you share stays confidential.
            </SectionLead>

            <div className="mt-12 flex flex-col gap-6 border-t border-hairline/20 pt-8">
              <Fact label="Response time" value="1–2 business days" />
              <Fact label="Engagement types" value="Fixed scope, retainer, or product build" />
              <Fact label="Availability" value="Worldwide" />
              <Fact label="Direct email" value={site.email} href={`mailto:${site.email}`} />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="corner-brackets relative overflow-hidden rounded-xl border border-hairline/25 bg-elevated/40 p-6 md:p-10">
              <ProjectForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function Fact({ label, value, href }: { label: string; value: string; href?: string }) {
  const inner = <span className="text-ink">{value}</span>;
  return (
    <div className="flex flex-col gap-1">
      <p className="font-mono text-[10px] uppercase tracking-widest text-gold">{label}</p>
      {href ? (
        <a href={href} className="text-ink transition-colors hover:text-gold">
          {value}
        </a>
      ) : (
        inner
      )}
    </div>
  );
}
