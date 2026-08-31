import { User } from "lucide-react";
import { Section } from "@/components/ui/section";
import { WorkspacePageHeader } from "@/components/client/page-header";
import { site } from "@/config/site";
import { socialLinks } from "@/config/social";

const principles = [
  {
    title: "Ship, then iterate.",
    body:
      "Working software beats perfect specifications. The first version exists to learn from, not to be defended.",
  },
  {
    title: "Own the stack.",
    body:
      "End-to-end responsibility is a feature, not a burden. It means fewer coordination costs, faster iterations, and better product outcomes.",
  },
  {
    title: "AI when it earns its place.",
    body:
      "Modern AI belongs in production when it measurably improves the user experience or the operator's workload. Not as a demo layer.",
  },
  {
    title: "Boring where it counts.",
    body:
      "Databases, deployments, monitoring — the parts nobody notices until they break — get boring, well-worn tools. Novelty budget goes elsewhere.",
  },
];

export default function ClientAboutPage() {
  return (
    <Section className="pt-14 md:pt-16">
      <WorkspacePageHeader
        eyebrow="Workspace · About"
        title="A little more about how the work happens."
        description="The public About page states the credentials. This is closer to how the work actually gets done."
        icon={User}
      />

      <div className="mt-12 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="flex flex-col gap-6 text-lg leading-relaxed text-ink-muted">
            <p>
              Every engagement starts with understanding the outcome. Not the feature list, not the technology preference —
              the outcome the business needs. Once that is agreed, the technical decisions largely follow from it.
            </p>
            <p>
              The default posture is engineering honesty. If a two-week timeline is unrealistic, I&apos;ll say so up front.
              If a fashionable technology isn&apos;t the right fit, I&apos;ll explain what is. If the scope is drifting,
              you&apos;ll hear about it before it becomes a problem.
            </p>
            <p>
              Most engagements combine a small number of high-leverage decisions with a large amount of quiet, disciplined
              execution. My job is to make both of those parts happen well.
            </p>
          </div>

          <div className="mt-12">
            <p className="font-mono text-xs uppercase tracking-widest text-gold">Working principles</p>
            <div className="mt-6 grid gap-4">
              {principles.map((p) => (
                <div key={p.title} className="rounded-lg border border-hairline/25 bg-elevated/40 p-6">
                  <h3 className="font-display text-lg font-medium text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm text-ink-muted text-pretty">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="md:col-span-5">
          <div className="corner-brackets relative overflow-hidden rounded-xl border border-hairline/25 bg-elevated/40 p-8">
            <p className="font-mono text-xs uppercase tracking-widest text-gold">Snapshot</p>
            <dl className="mt-6 grid gap-5">
              <Fact label="Role" value={site.role} />
              <Fact label="Experience" value={`${site.yearsExperience}+ years`} />
              <Fact label="Education" value={site.education} />
              <Fact label="Location" value={site.location} />
              <Fact label="Availability" value="Worldwide" />
              <Fact label="Focus" value="Full-stack · AI · Agentic AI · Automation · Cloud" />
            </dl>

            <div className="mt-8 border-t border-hairline/20 pt-6">
              <p className="font-mono text-xs uppercase tracking-widest text-gold">Connect</p>
              <ul className="mt-4 flex flex-col gap-2">
                {socialLinks.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 text-sm text-ink-muted transition-colors hover:text-gold"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-widest text-gold/60 group-hover:text-gold">
                        {s.label}
                      </span>
                      <span>{s.handle}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </Section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-hairline/20 pb-4 last:border-0 last:pb-0">
      <dt className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
