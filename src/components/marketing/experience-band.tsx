import { site } from "@/config/site";

const disciplines = ["FULL-STACK", "AI", "GEN-AI", "AGENTIC AI", "CLOUD", "DEVOPS", "AUTOMATION", "E-COMMERCE"];

export function ExperienceBand() {
  return (
    <section className="relative border-y border-hairline/20 bg-elevated/30 py-24 md:py-32">
      <div className="container">
        <div className="grid gap-16 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <p className="font-mono text-xs uppercase tracking-widest text-gold">Experience</p>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-gold-gradient font-display text-[7rem] font-medium leading-none md:text-[10rem]">
                {site.yearsExperience}
              </span>
              <span className="font-display text-6xl font-medium text-gold md:text-8xl">+</span>
            </div>
            <p className="mt-4 font-display text-2xl font-light text-ink md:text-3xl">Years of industry experience</p>
            <p className="mt-6 max-w-md text-ink-muted">
              {site.education}. Working across full-stack engineering, AI systems, cloud infrastructure and
              automation — building products that ship.
            </p>
          </div>

          <div className="flex flex-col justify-center md:col-span-7">
            <div className="hairline mb-10" />
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
              {disciplines.map((d) => (
                <div key={d} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_hsl(var(--gold-primary))]" />
                  <span className="font-mono text-xs uppercase tracking-widest text-ink">{d}</span>
                </div>
              ))}
            </div>
            <div className="hairline mt-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
