"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { budgetRanges, contactMethods, projectTypes, timelines } from "@/lib/validation/project-request";

type Status = "idle" | "submitting" | "success" | "error";

export function ProjectForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);
    setFieldErrors({});

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/project-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; fieldErrors?: Record<string, string> };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        return;
      }
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="corner-brackets relative overflow-hidden rounded-xl border border-gold/40 bg-elevated/60 p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 bg-gold/10 text-gold">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-6 font-display text-3xl font-medium text-ink">Request received.</h3>
        <p className="mt-3 text-ink-muted">
          Thanks for reaching out. I&apos;ll review your project and get back to you within one to two business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6">
      {/* Honeypot */}
      <input type="text" name="website_hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Name" name="name" error={fieldErrors.name}>
          <Input name="name" required autoComplete="name" placeholder="Your name" />
        </Field>
        <Field label="Email" name="email" error={fieldErrors.email}>
          <Input name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
        </Field>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Company" name="company" error={fieldErrors.company}>
          <Input name="company" autoComplete="organization" placeholder="Optional" />
        </Field>
        <Field label="Existing website" name="existingWebsite" error={fieldErrors.existingWebsite}>
          <Input name="existingWebsite" type="url" placeholder="https:// (optional)" />
        </Field>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Field label="Project type" name="projectType" error={fieldErrors.projectType}>
          <Select name="projectType" required defaultValue="">
            <option value="" disabled>
              Select
            </option>
            {projectTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Budget" name="budget" error={fieldErrors.budget}>
          <Select name="budget" defaultValue="">
            <option value="">Optional</option>
            {budgetRanges.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Timeline" name="timeline" error={fieldErrors.timeline}>
          <Select name="timeline" defaultValue="">
            <option value="">Optional</option>
            {timelines.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Project description" name="description" error={fieldErrors.description}>
        <Textarea
          name="description"
          required
          minLength={20}
          maxLength={4000}
          placeholder="What are you building? What outcome matters most?"
        />
      </Field>

      <Field label="Preferred contact" name="preferredContact" error={fieldErrors.preferredContact}>
        <Select name="preferredContact" defaultValue="Email">
          {contactMethods.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>
      </Field>

      {errorMsg && (
        <p className="rounded-md border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">{errorMsg}</p>
      )}

      <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink-subtle">
          Response within 1–2 business days
        </p>
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending
            </>
          ) : (
            "Send Project Request"
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
