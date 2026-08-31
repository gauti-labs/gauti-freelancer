"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { capabilities } from "@/config/capabilities";
import { Section, SectionEyebrow, SectionHeading, SectionLead } from "@/components/ui/section";
import { Hexagon } from "@/components/ui/hexagon";
import { cn } from "@/lib/utils/cn";

export function Capabilities() {
  const [active, setActive] = useState(capabilities[0].id);
  const current = capabilities.find((c) => c.id === active) ?? capabilities[0];

  return (
    <Section>
      <div className="max-w-3xl">
        <SectionEyebrow>Capabilities</SectionEyebrow>
        <SectionHeading>Engineering breadth across the modern product stack.</SectionHeading>
        <SectionLead>
          A working range that covers everything from product architecture through production deployment — including the AI systems that increasingly define what a product can do.
        </SectionLead>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-12">
        {/* Category rail */}
        <div className="flex flex-col gap-2 lg:col-span-4">
          {capabilities.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              className={cn(
                "group relative flex items-center justify-between gap-4 rounded-lg border px-5 py-4 text-left transition-all",
                active === c.id
                  ? "border-gold/50 bg-elevated/60 text-ink"
                  : "border-hairline/20 bg-transparent text-ink-muted hover:border-gold/30 hover:text-ink",
              )}
              aria-pressed={active === c.id}
            >
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-widest",
                    active === c.id ? "text-gold" : "text-ink-subtle",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-lg font-medium">{c.title}</span>
              </div>
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all",
                  active === c.id ? "bg-gold shadow-[0_0_10px_hsl(var(--gold-primary))]" : "bg-hairline/40",
                )}
              />
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="relative lg:col-span-8">
          <div className="corner-brackets relative overflow-hidden rounded-xl border border-hairline/25 bg-elevated/50 p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-start gap-6">
                  <Hexagon size={64}>
                    <span className="font-display text-xl text-gold">
                      {current.title.charAt(0)}
                    </span>
                  </Hexagon>
                  <div>
                    <h3 className="font-display text-2xl font-medium text-ink md:text-3xl">
                      {current.title}
                    </h3>
                    <p className="mt-3 text-ink-muted">{current.summary}</p>
                  </div>
                </div>

                <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                  {current.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-ink">
                      <span className="h-1 w-1 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}
