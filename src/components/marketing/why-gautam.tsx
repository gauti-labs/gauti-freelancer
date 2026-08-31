import { Section, SectionEyebrow, SectionHeading } from "@/components/ui/section";

const pillars = [
  {
    title: "End-to-End Ownership",
    description: "From architecture through deployment — a single point of accountability across the full stack.",
  },
  {
    title: "AI-Native Thinking",
    description: "Modern AI capabilities applied where they create genuine value, not where they generate demos.",
  },
  {
    title: "Engineering Depth",
    description: "Frontend, backend, cloud, DevOps and automation — treated as a single, coherent system.",
  },
  {
    title: "Business-Oriented Development",
    description: "Technology exists to solve business problems, not to demonstrate technical ability.",
  },
];

export function WhyGautam() {
  return (
    <Section>
      <div className="max-w-3xl">
        <SectionEyebrow>Why Work With Gautam?</SectionEyebrow>
        <SectionHeading>Four things that consistently shape the work.</SectionHeading>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {pillars.map((p, i) => (
          <div
            key={p.title}
            className="corner-brackets relative overflow-hidden rounded-xl border border-hairline/25 bg-elevated/40 p-8 md:p-10"
          >
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs uppercase tracking-widest text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" />
            </div>
            <h3 className="mt-6 font-display text-2xl font-medium text-ink md:text-3xl">{p.title}</h3>
            <p className="mt-4 text-ink-muted text-pretty">{p.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
