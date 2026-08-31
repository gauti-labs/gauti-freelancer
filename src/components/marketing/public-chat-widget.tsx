"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const WELCOME_MESSAGE =
  "Hi, I am Gautam's assistant. Ask me about services, timelines, tech stack, or what to start with.";

const QUICK_ACTIONS = [
  { type: "ask" as const, label: "Services", prompt: "What services do you offer and who are they best for?" },
  { type: "ask" as const, label: "Pricing", prompt: "Can you explain the pricing tiers and what is included?" },
  { type: "link" as const, label: "Start a Project", href: "/start-a-project" },
];

export function PublicChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: WELCOME_MESSAGE },
  ]);

  const canSend = useMemo(() => input.trim().length >= 2 && !loading, [input, loading]);

  function updateScrollState() {
    const el = messagesRef.current;
    if (!el) return;
    const overflow = el.scrollHeight > el.clientHeight + 2;
    const top = el.scrollTop <= 4;
    const bottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
    setHasOverflow(overflow);
    setAtTop(top);
    setAtBottom(bottom);
  }

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    updateScrollState();
  }, [messages, loading, error]);

  useEffect(() => {
    if (!open) return;
    const onResize = () => updateScrollState();
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  async function sendMessage(rawText: string) {
    const text = rawText.trim();
    if (text.length < 2 || loading) return;

    setError(null);
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const res = await fetch("/api/public-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
        keepalive: true,
      });
      const data = (await res.json()) as { ok?: boolean; reply?: string; error?: string };
      if (!res.ok || !data.ok || !data.reply) {
        setError(data.error || "Assistant is unavailable right now.");
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply! }]);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function send() {
    const text = input.trim();
    if (text.length < 2 || loading) return;
    setInput("");
    await sendMessage(text);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] sm:bottom-6 sm:right-6">
      {open ? (
        <div
          className="w-[calc(100vw-1rem)] max-w-sm overflow-hidden rounded-xl border border-hairline/25 bg-base/95 shadow-2xl backdrop-blur-xl overscroll-contain sm:w-[calc(100vw-2rem)]"
          onWheelCapture={(e) => e.stopPropagation()}
          onTouchMoveCapture={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-hairline/20 px-4 py-3">
            <div>
              <p className="font-display text-lg text-ink">Ask Gautam&apos;s AI</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle">Public assistant</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-hairline/30 text-ink-muted hover:border-gold/50 hover:text-gold"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative">
            <div
              ref={messagesRef}
              onScroll={updateScrollState}
              className="max-h-[min(62vh,22rem)] space-y-3 overflow-y-auto px-4 py-4 overscroll-contain"
            >
              {messages.length === 1 && !loading && (
                <div className="flex flex-wrap gap-2">
                  {QUICK_ACTIONS.map((action) =>
                    action.type === "ask" ? (
                      <button
                        key={action.label}
                        type="button"
                        onClick={() => void sendMessage(action.prompt)}
                        disabled={loading}
                        className="rounded-full border border-hairline/30 bg-elevated/40 px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-gold/50 hover:text-gold"
                      >
                        {action.label}
                      </button>
                    ) : (
                      <a
                        key={action.label}
                        href={action.href}
                        onClick={() => setOpen(false)}
                        className="rounded-full border border-hairline/30 bg-elevated/40 px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-gold/50 hover:text-gold"
                      >
                        {action.label}
                      </a>
                    ),
                  )}
                </div>
              )}

              {messages.map((m, idx) => (
                <div
                  key={`${m.role}-${idx}`}
                  className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                    m.role === "assistant"
                      ? "border border-hairline/25 bg-elevated/50 text-ink"
                      : "ml-auto bg-gold-gradient text-[hsl(var(--bg-base))]",
                  )}
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="inline-flex items-center gap-2 rounded-lg border border-hairline/25 bg-elevated/50 px-3 py-2 text-sm text-ink-muted">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Thinking...
                </div>
              )}
              {error && (
                <p className="rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-400">{error}</p>
              )}
            </div>

            {hasOverflow && !atTop && (
              <div className="pointer-events-none absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-base/95 to-transparent" />
            )}
            {hasOverflow && !atBottom && (
              <>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-base/95 to-transparent" />
                <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
                  Scroll for more
                </p>
              </>
            )}
          </div>

          <div className="border-t border-hairline/20 p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                placeholder="Ask about services or your project idea..."
                className="min-h-[44px] max-h-28 w-full resize-y rounded-md border border-hairline/30 bg-elevated/40 px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30"
              />
              <Button type="button" size="sm" onClick={() => void send()} disabled={!canSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open chat assistant"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-base/90 text-sm text-ink shadow-[0_12px_30px_-18px_hsl(var(--gold-primary)/0.8)] backdrop-blur-md transition-colors hover:border-gold/70 hover:text-gold sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-2.5"
        >
          <MessageCircle className="h-4 w-4 text-gold" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      )}
    </div>
  );
}
