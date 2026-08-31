import { Phone, Mail, Github, Linkedin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { WorkspacePageHeader } from "@/components/client/page-header";
import { PrivateContact } from "@/components/client/private-contact";
import { social } from "@/config/social";

export default function ClientContactPage() {
  return (
    <Section className="pt-14 md:pt-16">
      <WorkspacePageHeader
        eyebrow="Workspace · Direct Contact"
        title="Private communication channels."
        description="Because you are authenticated, you have access to channels that are not exposed on the public site."
        icon={Phone}
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {/* Phone — secure reveal */}
        <div className="corner-brackets relative overflow-hidden rounded-xl border border-gold/40 bg-elevated/70 p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gold/40 bg-gold/10 text-gold">
              <Phone className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-medium text-ink">Phone</h2>
          </div>
          <p className="mt-4 text-sm text-ink-muted text-pretty">
            Direct phone line. Available to authenticated clients only. The number is fetched from a secure server
            endpoint after your session is verified — it is never included in any client bundle or static HTML.
          </p>
          <div className="mt-8">
            <PrivateContact />
          </div>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
            Session-gated · Never cached · Server-only source
          </p>
        </div>

        {/* Email */}
        <div className="relative overflow-hidden rounded-xl border border-hairline/25 bg-elevated/40 p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-hairline/25 bg-base/60 text-ink">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-medium text-ink">Email</h2>
          </div>
          <p className="mt-4 text-sm text-ink-muted text-pretty">
            The fastest path for structured requests, briefs and long-form conversation.
          </p>
          <a
            href={`mailto:${social.email}`}
            className="mt-8 inline-flex items-center gap-2 rounded-md border border-hairline/30 bg-base/40 px-4 py-2.5 font-mono text-sm text-ink transition-colors hover:border-gold/50 hover:text-gold"
          >
            <Mail className="h-4 w-4" />
            {social.email}
          </a>
        </div>

        {/* GitHub */}
        <div className="rounded-xl border border-hairline/25 bg-elevated/40 p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-hairline/25 bg-base/60 text-ink">
              <Github className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-medium text-ink">GitHub</h2>
          </div>
          <p className="mt-4 text-sm text-ink-muted text-pretty">
            Public engineering work and open-source contributions.
          </p>
          <a
            href={social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm text-ink transition-colors hover:text-gold"
          >
            github.com/gauti-labs <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* LinkedIn */}
        <div className="rounded-xl border border-hairline/25 bg-elevated/40 p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-hairline/25 bg-base/60 text-ink">
              <Linkedin className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-medium text-ink">LinkedIn</h2>
          </div>
          <p className="mt-4 text-sm text-ink-muted text-pretty">Professional network and background.</p>
          <a
            href={social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm text-ink transition-colors hover:text-gold"
          >
            linkedin.com/in/gautam-goyal <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-xl border border-hairline/20 bg-elevated/30 p-6 md:flex-row md:items-center md:p-8">
        <p className="text-sm text-ink-muted text-pretty">
          For a formal project brief, use the intake form to give Gautam the context he needs before a call.
        </p>
        <Link
          href="/start-a-project"
          className="inline-flex items-center gap-2 rounded-md border border-gold/50 bg-gold/10 px-5 py-2.5 text-sm text-gold transition-colors hover:bg-gold/15"
        >
          Send a project brief <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Section>
  );
}
