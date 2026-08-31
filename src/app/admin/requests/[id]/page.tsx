import Link from "next/link";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { ArrowLeft, Mail } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { collection, Collections, type ProjectRequestDoc } from "@/lib/db/collections";
import { StatusPill, type RequestStatus } from "@/components/admin/status-pill";
import { StatusChanger } from "@/components/admin/status-changer";

type Params = { params: Promise<{ id: string }> };

async function loadRequest(id: string) {
  if (!ObjectId.isValid(id)) return null;
  if (!process.env.MONGODB_URI) return null;
  try {
    const col = await collection<ProjectRequestDoc>(Collections.ProjectRequests);
    return await col.findOne({ _id: new ObjectId(id) });
  } catch {
    return null;
  }
}

export default async function AdminRequestDetail({ params }: Params) {
  await requireAdmin();
  const { id } = await params;
  const doc = await loadRequest(id);
  if (!doc) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/admin/requests"
          className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All requests
        </Link>
        <div className="mt-6 flex flex-col justify-between gap-4 border-b border-hairline/20 pb-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <StatusPill status={doc.status as RequestStatus} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
                {new Date(doc.createdAt).toLocaleString()}
              </span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-medium text-ink md:text-4xl">{doc.name}</h1>
            <a
              href={`mailto:${doc.email}?subject=${encodeURIComponent(`Re: ${doc.projectType} project`)}`}
              className="mt-2 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-gold"
            >
              <Mail className="h-3.5 w-3.5" /> {doc.email}
            </a>
          </div>
          <StatusChanger id={String(doc._id)} current={doc.status as RequestStatus} />
        </div>
      </div>

      {/* Facts grid */}
      <dl className="grid gap-4 md:grid-cols-4">
        <Fact label="Type" value={doc.projectType} />
        <Fact label="Budget" value={doc.budget || "—"} />
        <Fact label="Timeline" value={doc.timeline || "—"} />
        <Fact label="Preferred contact" value={doc.preferredContact || "Email"} />
        {doc.company && <Fact label="Company" value={doc.company} />}
        {doc.existingWebsite && (
          <Fact
            label="Existing website"
            value={
              <a
                href={doc.existingWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                {doc.existingWebsite}
              </a>
            }
          />
        )}
      </dl>

      {/* Description */}
      <section>
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold">Description</p>
        <div className="mt-3 whitespace-pre-wrap rounded-xl border border-hairline/25 bg-elevated/40 p-6 text-ink text-pretty">
          {doc.description}
        </div>
      </section>

      {/* Metadata */}
      <section>
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold">Metadata</p>
        <dl className="mt-3 grid gap-3 rounded-xl border border-hairline/25 bg-elevated/30 p-6 font-mono text-xs md:grid-cols-2">
          <MetaRow k="Request ID" v={String(doc._id)} />
          <MetaRow k="Received" v={new Date(doc.createdAt).toISOString()} />
          <MetaRow k="IP" v={doc.ip || "—"} />
          <MetaRow k="User agent" v={doc.userAgent || "—"} />
        </dl>
      </section>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-hairline/25 bg-elevated/40 p-4">
      <dt className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle">{label}</dt>
      <dd className="mt-2 text-sm text-ink">{value}</dd>
    </div>
  );
}

function MetaRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-28 flex-shrink-0 text-ink-subtle">{k}</span>
      <span className="break-all text-ink-muted">{v}</span>
    </div>
  );
}
