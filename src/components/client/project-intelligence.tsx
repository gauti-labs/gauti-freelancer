"use client";

import { useState } from "react";
import {
  ArrowRight,
  Loader2,
  Sparkles,
  Layers,
  Cpu,
  Package,
  Plug,
  AlertTriangle,
  Gauge,
  Compass,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type Analysis = {
  projectType: string;
  summary: string;
  recommendedArchitecture: string;
  keyFeatures: string[];
  aiLayer: string;
  complexity: "Low" | "Medium" | "High" | "Very High";
  suggestedEngagement: string;
  suggestedTechnologies: string[];
  potentialIntegrations: string[];
  risksToConsider: string[];
  nextStep: string;
};

const EXAMPLES = [
  "I want an e-commerce platform with AI-driven product recommendations, personalised search, and an admin dashboard.",
  "A B2B SaaS tool that ingests PDFs from an inbox, extracts structured data with an LLM, and posts results into HubSpot.",
  "A React Native mobile app for scheduling personal training sessions with in-app payments and calendar sync.",
  "An agentic AI assistant that monitors a company's Slack, summarises threads daily, and drafts responses for a human to approve.",
];

const CHAR_LIMIT = 2000;
const CHAR_MIN = 20;

export function ProjectIntelligence({ enabled }: { enabled: boolean }) {
  const [brief, setBrief] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Analysis | null>(null);
  const [meta, setMeta] = useState<{ model: string; durationMs: number } | null>(null);

  const disabled = !enabled;
  const tooShort = brief.trim().length < CHAR_MIN;

  async function analyse() {
    if (disabled || tooShort) return;
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/client/project-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        result?: Analysis;
        meta?: { model: string; durationMs: number };
        error?: string;
      };
      if (!res.ok || !data.ok || !data.result) {
        setStatus("error");
        setError(data.error || "Something went wrong.");
        return;
      }
      setResult(data.result);
      setMeta(data.meta ?? null);
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  function reset() {
    setResult(null);
    setMeta(null);
    setStatus("idle");
    setError(null);
    setBrief("");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Input card */}
      <div className="corner-brackets relative overflow-hidden rounded-xl border border-hairline/25 bg-elevated/50 p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-gold/30 bg-gold/5 text-gold">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-xl font-medium text-ink">Describe your project</h2>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
                Server-only · Gemini · Not used for model training
              </p>
            </div>
          </div>
          {status === "done" && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-md border border-hairline/30 px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-gold/50 hover:text-gold"
            >
              <RefreshCcw className="h-3 w-3" /> New brief
            </button>
          )}
        </div>

        {disabled && (
          <p className="mt-6 rounded-md border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-gold">
            The analysis engine is not configured yet. Set <code className="font-mono">GEMINI_API_KEY</code> in your
            environment.
          </p>
        )}

        <div className="mt-6">
          <Textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value.slice(0, CHAR_LIMIT))}
            placeholder="e.g. I want an AI-powered platform where users can upload contracts and get an automatic risk summary…"
            className="min-h-[160px]"
            disabled={disabled || status === "loading"}
          />
          <div className="mt-2 flex items-center justify-between">
            <p
              className={cn(
                "font-mono text-[10px] uppercase tracking-widest",
                tooShort ? "text-ink-subtle" : "text-gold/70",
              )}
            >
              {brief.trim().length} / {CHAR_LIMIT}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
              Minimum {CHAR_MIN} characters
            </p>
          </div>
        </div>

        {/* Example prompts */}
        {status === "idle" && (
          <div className="mt-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle">Try an example</p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setBrief(ex)}
                  disabled={disabled}
                  className="rounded-md border border-hairline/25 bg-base/30 px-4 py-3 text-left text-xs text-ink-muted transition-colors hover:border-gold/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="mt-6 rounded-md border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
            Analysis is a signal, not a quote
          </p>
          <Button type="button" onClick={analyse} disabled={disabled || tooShort || status === "loading"} size="md">
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Analysing
              </>
            ) : (
              <>
                Analyse Project <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Result */}
      {status === "loading" && <SkeletonResult />}
      {status === "done" && result && <ResultCard result={result} meta={meta} />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */

function SkeletonResult() {
  return (
    <div className="grid gap-4 md:grid-cols-12">
      <div className="col-span-12 h-40 animate-pulse rounded-xl border border-hairline/25 bg-elevated/30" />
      <div className="col-span-6 h-56 animate-pulse rounded-xl border border-hairline/25 bg-elevated/30" />
      <div className="col-span-6 h-56 animate-pulse rounded-xl border border-hairline/25 bg-elevated/30" />
      <div className="col-span-12 h-32 animate-pulse rounded-xl border border-hairline/25 bg-elevated/30" />
    </div>
  );
}

function complexityIndex(c: Analysis["complexity"]): number {
  return { Low: 1, Medium: 2, High: 3, "Very High": 4 }[c];
}

function ResultCard({ result, meta }: { result: Analysis; meta: { model: string; durationMs: number } | null }) {
  return (
    <div className="grid gap-6 md:grid-cols-12">
      {/* Header block */}
      <div className="col-span-12 corner-brackets relative overflow-hidden rounded-xl border border-gold/40 bg-elevated/70 p-8">
        <div className="absolute inset-0 bg-radial-glow opacity-40" aria-hidden />
        <div className="relative flex items-center gap-3">
          <span className="node-dot" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-gold">Project Intelligence</p>
        </div>
        <h3 className="relative mt-4 font-display text-3xl font-medium text-ink md:text-4xl">
          <span className="text-gold-gradient">{result.projectType}</span>
        </h3>
        <p className="relative mt-4 max-w-3xl text-lg leading-relaxed text-ink text-pretty">{result.summary}</p>
        {meta && (
          <p className="relative mt-6 font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
            {meta.model} · {(meta.durationMs / 1000).toFixed(1)}s
          </p>
        )}
      </div>

      {/* Architecture */}
      <Block
        icon={<Layers className="h-4 w-4" />}
        title="Recommended Architecture"
        className="md:col-span-7"
      >
        <p className="text-ink text-pretty">{result.recommendedArchitecture}</p>
        <div className="mt-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gold">Key features</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {result.keyFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-ink-muted">
                <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-gold" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </Block>

      {/* Complexity + Engagement */}
      <Block icon={<Gauge className="h-4 w-4" />} title="Signal" className="md:col-span-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle">Complexity</p>
          <div className="mt-2 flex items-center gap-3">
            <p className="font-display text-2xl text-ink">{result.complexity}</p>
            <ComplexityMeter value={complexityIndex(result.complexity)} />
          </div>
        </div>
        <div className="mt-6 border-t border-hairline/20 pt-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle">Suggested engagement</p>
          <p className="mt-2 text-ink">{result.suggestedEngagement}</p>
        </div>
      </Block>

      {/* AI Layer */}
      <Block icon={<Cpu className="h-4 w-4" />} title="AI Layer" className="md:col-span-6">
        <p className="text-ink text-pretty">{result.aiLayer}</p>
      </Block>

      {/* Technologies */}
      <Block icon={<Package className="h-4 w-4" />} title="Suggested Technologies" className="md:col-span-6">
        <div className="flex flex-wrap gap-2">
          {result.suggestedTechnologies.map((t) => (
            <span
              key={t}
              className="rounded-full border border-hairline/30 bg-base/40 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink"
            >
              {t}
            </span>
          ))}
        </div>
      </Block>

      {/* Integrations */}
      {result.potentialIntegrations.length > 0 && (
        <Block icon={<Plug className="h-4 w-4" />} title="Potential Integrations" className="md:col-span-6">
          <ul className="grid gap-2">
            {result.potentialIntegrations.map((i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
                <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-gold" />
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {/* Risks */}
      {result.risksToConsider.length > 0 && (
        <Block icon={<AlertTriangle className="h-4 w-4" />} title="Risks to Consider" className="md:col-span-6">
          <ul className="grid gap-2">
            {result.risksToConsider.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm text-ink-muted">
                <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-gold" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {/* Next step */}
      <div className="col-span-12 flex flex-col items-start justify-between gap-4 rounded-xl border border-gold/40 bg-elevated/70 p-6 md:flex-row md:items-center md:p-8">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-gold/40 bg-gold/10 text-gold">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gold">Next step</p>
            <p className="mt-1 text-ink">{result.nextStep}</p>
          </div>
        </div>
        <Link
          href="/start-a-project"
          className="inline-flex items-center gap-2 rounded-md bg-gold-gradient px-5 py-2.5 text-sm font-medium text-[hsl(var(--bg-base))] shadow-[0_20px_40px_-20px_hsl(var(--gold-primary)/0.5)] transition-all hover:-translate-y-px"
        >
          Discuss This Project <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function Block({
  icon,
  title,
  className,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border border-hairline/25 bg-elevated/40 p-6 md:p-7", className)}>
      <div className="flex items-center gap-2.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-md border border-hairline/25 bg-base/40 text-gold">
          {icon}
        </span>
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold">{title}</p>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function ComplexityMeter({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Complexity ${value} of 4`}>
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={cn(
            "h-4 w-1.5 rounded-sm transition-colors",
            i <= value ? "bg-gold" : "bg-hairline/40",
          )}
        />
      ))}
    </div>
  );
}
