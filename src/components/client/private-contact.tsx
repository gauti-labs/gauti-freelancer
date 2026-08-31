"use client";

import { useState } from "react";
import { Loader2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrivateContact() {
  const [phone, setPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function reveal() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/private/contact", { method: "GET", cache: "no-store" });
      const data = (await res.json()) as { phone?: string; error?: string };
      if (!res.ok || !data.phone) {
        setError(data.error || "Unable to reveal contact.");
        return;
      }
      setPhone(data.phone);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  if (phone) {
    return (
      <a
        href={`tel:${phone}`}
        className="inline-flex items-center gap-2 rounded-md border border-gold/50 bg-gold/10 px-4 py-2 font-mono text-sm text-gold"
      >
        <Phone className="h-4 w-4" />
        {phone}
      </a>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" variant="secondary" size="sm" onClick={reveal} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4" />}
        Reveal phone
      </Button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
