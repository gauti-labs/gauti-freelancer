import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { featuredProjects } from "@/config/projects";
import { Section, SectionEyebrow, SectionHeading, SectionLead } from "@/components/ui/section";

export function SelectedWork() {
  return (
    <Section>
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <SectionEyebrow>Selected Work</SectionEyebrow>
          <SectionHeading>Public projects, engineered and shipped.</SectionHeading>
          <SectionLead>
            A small selection of publicly disclosable work. Additional client engagements are covered under confidentiality.
          </SectionLead>
        </div>
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 self-start rounded-md border border-hairline/30 px-5 py-2.5 text-sm text-ink transition-colors hover:border-gold/60 hover:text-gold md:self-auto"
        >
          All work
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-hairline/20 bg-elevated/30 p-8 md:p-10">
        <p className="font-mono text-xs uppercase tracking-widest text-gold">Confidential Engagements</p>
        <p className="mt-4 max-w-3xl text-lg text-ink text-pretty">
          Selected work includes confidential client engagements that cannot be publicly disclosed.
        </p>
      </div>
    </Section>
  );
}

function ProjectCard({ project }: { project: (typeof featuredProjects)[number] }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-xl border border-hairline/25 bg-elevated/40 p-8 transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:bg-elevated/70"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-[10px] uppercase tracking-widest text-gold/80">{project.category}</span>
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
  );
}
