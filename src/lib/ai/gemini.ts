import "server-only";
import { GoogleGenAI, Type } from "@google/genai";
import { requireEnv, isProd } from "@/lib/utils/env";

/**
 * Gemini client + structured Project Intelligence analysis.
 * The API key is loaded here and NEVER exposed to the client.
 */

let cached: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (cached) return cached;
  const apiKey = requireEnv("GEMINI_API_KEY");
  if (!apiKey) {
    // requireEnv already threw in prod. In dev, return a client that will fail on use.
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  cached = new GoogleGenAI({ apiKey });
  return cached;
}

export const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
export const DEFAULT_GROQ_MODEL = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";

export type ProjectAnalysis = {
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

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    projectType: {
      type: Type.STRING,
      description: "Concise product category, e.g. 'E-commerce Platform', 'SaaS Analytics App', 'AI Agent Product'.",
    },
    summary: {
      type: Type.STRING,
      description: "One or two sentence paraphrase of what the client wants to build.",
    },
    recommendedArchitecture: {
      type: Type.STRING,
      description:
        "High-level architecture recommendation. Concrete and short — e.g. 'Next.js App Router + PostgreSQL + Redis + Vercel'.",
    },
    keyFeatures: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3–6 core features implied by the brief.",
    },
    aiLayer: {
      type: Type.STRING,
      description:
        "How AI would be integrated — concrete pattern (RAG, agentic, embedding search, classification, etc.) or 'None' if not applicable.",
    },
    complexity: {
      type: Type.STRING,
      enum: ["Low", "Medium", "High", "Very High"],
      description: "Overall engineering complexity signal.",
    },
    suggestedEngagement: {
      type: Type.STRING,
      description:
        "Which engagement model fits best: 'Focused Build (Basic tier)', 'Application Build (Standard tier)', 'Product Engineering (Premium tier)', or 'Custom Quote Required'.",
    },
    suggestedTechnologies: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "5–10 specific technologies that would fit this project.",
    },
    potentialIntegrations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Third-party services / APIs likely to be required.",
    },
    risksToConsider: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3–5 engineering, product, or delivery risks worth flagging early.",
    },
    nextStep: {
      type: Type.STRING,
      description: "One concrete next action for the client — e.g. 'Book a scoping call to formalise the architecture'.",
    },
  },
  required: [
    "projectType",
    "summary",
    "recommendedArchitecture",
    "keyFeatures",
    "aiLayer",
    "complexity",
    "suggestedEngagement",
    "suggestedTechnologies",
    "potentialIntegrations",
    "risksToConsider",
    "nextStep",
  ],
  propertyOrdering: [
    "projectType",
    "summary",
    "recommendedArchitecture",
    "keyFeatures",
    "aiLayer",
    "complexity",
    "suggestedEngagement",
    "suggestedTechnologies",
    "potentialIntegrations",
    "risksToConsider",
    "nextStep",
  ],
};

const SYSTEM_INSTRUCTION = `You are an experienced full-stack and AI engineer helping a prospective client understand how their project would be built.

You represent Gautam Goyal, a Digital Architect with 8 years of experience across full-stack engineering, AI, generative AI, agentic AI, cloud, DevOps, e-commerce and automation.

Guidelines:
- Be concrete, useful and honest. No marketing fluff.
- Never promise exact costs, exact timelines or exact delivery dates. If pressed, direct the client to a scoping call.
- Never invent client references, past projects, testimonials or metrics.
- If the request is unclear, harmful, out of scope, or not a software project, still return the JSON structure but note the issue in 'summary' and set 'nextStep' to 'Discuss This Project'.
- Prefer battle-tested technology over novelty. Suggest AI only when it earns its place.
- Keep every field concise. Feature and risk lists are short arrays of tight phrases, not paragraphs.`;

const TIMEOUT_MS = 25_000;
const PUBLIC_CHAT_TIMEOUT_MS = 18_000;

/**
 * Generate structured analysis. Throws on failure — caller handles.
 */
export async function analyzeProject(brief: string): Promise<ProjectAnalysis> {
  const client = getClient();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await client.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Project brief from a prospective client:\n\n"""${brief.trim()}"""\n\nProduce the structured analysis.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.35,
        maxOutputTokens: 1500,
        abortSignal: controller.signal,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");

    const parsed = JSON.parse(text) as ProjectAnalysis;
    return parsed;
  } catch (err) {
    if (!isProd) {
      // eslint-disable-next-line no-console
      console.error("[gemini] analysis failed", err);
    }
    throw new Error("Analysis engine unavailable");
  } finally {
    clearTimeout(timer);
  }
}

const PUBLIC_CHAT_SYSTEM_INSTRUCTION = `You are the public website assistant for Gautam Goyal (Digital Architect).

Goals:
- Help visitors quickly understand services, engagement scope, and next steps.
- Keep replies short, practical, and friendly.
- Focus on software, AI, automation, web, mobile, e-commerce, and DevOps topics.

Rules:
- Never reveal secrets, environment variables, or internal implementation details.
- If asked unrelated or unsafe topics, politely decline and redirect to software/business support.
- Never invent exact prices or exact delivery timelines.
- Encourage visitors to use "Start a Project" for detailed scoping.
- Keep responses under 120 words where possible.
- Always end with a complete sentence (never cut off mid-thought).
- Use plain text only (no markdown tables or code blocks).`;

function isLikelyIncompleteReply(text: string): boolean {
  const t = text.trim();
  if (!t) return true;
  // Clear truncation markers.
  if (/[,:;]\s*$/.test(t)) return true;
  if (/\b(and|or|but|because|since|with|for|to|of|in|on|at|through|from)\s*$/i.test(t)) return true;
  // If missing punctuation AND already long, it's likely clipped.
  if (!/[.!?]"?$/.test(t) && t.length > 80) return true;
  return false;
}

function finalizeReply(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) {
    return "I can help with services, pricing, timelines, and project planning. Share your goal and I will suggest the best next step.";
  }

  if (/[.!?]"?$/.test(cleaned)) return cleaned;

  const lastSentenceEnd = Math.max(cleaned.lastIndexOf("."), cleaned.lastIndexOf("!"), cleaned.lastIndexOf("?"));
  if (lastSentenceEnd >= 0) return cleaned.slice(0, lastSentenceEnd + 1).trim();

  // If content is meaningful but lacks punctuation, normalize softly.
  if (cleaned.length >= 30) return `${cleaned}.`;

  return "I can help with services, pricing, timelines, and project planning. Share your goal and I will suggest the best next step.";
}

type PublicChatConfig = { systemInstruction: string; temperature: number; maxOutputTokens: number };

async function generatePublicChatText(
  client: GoogleGenAI,
  contents: string,
  configBase: PublicChatConfig,
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PUBLIC_CHAT_TIMEOUT_MS);
  try {
    const response = await client.models.generateContent({
      model: DEFAULT_MODEL,
      contents,
      config: { ...configBase, abortSignal: controller.signal },
    });
    return response.text?.trim() || "";
  } finally {
    clearTimeout(timer);
  }
}

type GroqChatMessage = { role: "system" | "user" | "assistant"; content: string };

function getGroqApiKey(): string | null {
  const key = process.env.GROQ_API_KEY?.trim();
  return key ? key : null;
}

function isGroqLimitError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const status = (err as { status?: unknown }).status;
  if (status === 429) return true;
  const message = String((err as { message?: unknown }).message || "").toLowerCase();
  return /(quota|rate limit|limit exceeded|too many requests|insufficient_quota|resource exhausted)/.test(message);
}

async function generatePublicChatTextViaGroq(
  contents: string,
  configBase: PublicChatConfig,
): Promise<string> {
  const apiKey = getGroqApiKey();
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured.");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PUBLIC_CHAT_TIMEOUT_MS);
  try {
    const messages: GroqChatMessage[] = [
      { role: "system", content: configBase.systemInstruction },
      { role: "user", content: contents },
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEFAULT_GROQ_MODEL,
        messages,
        temperature: configBase.temperature,
        max_tokens: configBase.maxOutputTokens,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    const raw = await response.text();
    let json: unknown = null;
    try {
      json = raw ? JSON.parse(raw) : null;
    } catch {
      // keep raw path for error details
    }

    if (!response.ok) {
      const message =
        (json as { error?: { message?: string } } | null)?.error?.message ||
        `Groq request failed with status ${response.status}`;
      const err = new Error(message) as Error & { status?: number };
      err.status = response.status;
      throw err;
    }

    const content = (json as { choices?: Array<{ message?: { content?: string } }> } | null)?.choices?.[0]?.message
      ?.content;
    return typeof content === "string" ? content.trim() : "";
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Public chatbot helper for unauthenticated visitors.
 */
export async function answerPublicChat(
  message: string,
  history: Array<{ role: "user" | "assistant"; content: string }> = [],
): Promise<string> {
  try {
    const configBase = {
      systemInstruction: PUBLIC_CHAT_SYSTEM_INSTRUCTION,
      temperature: 0.25,
      maxOutputTokens: 520,
    } as const;

    const historyText =
      history.length > 0
        ? history
            .slice(-8)
            .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
            .join("\n")
        : "No prior context.";

    const promptForModel = `Conversation so far:
${historyText}

Latest visitor question:
"${message.trim()}"

Respond as the website assistant.`;

    const hasGroq = !!getGroqApiKey();
    const geminiClient = hasGroq ? null : getClient();
    let groqLimited = false;
    const generate = async (contents: string) => {
      if (hasGroq && !groqLimited) {
        try {
          return await generatePublicChatTextViaGroq(contents, configBase);
        } catch (err) {
          if (!isGroqLimitError(err)) throw err;
          groqLimited = true;
        }
      }
      const fallbackClient = geminiClient ?? getClient();
      return await generatePublicChatText(fallbackClient, contents, configBase);
    };

    const firstText = await generate(promptForModel);

    if (!firstText) throw new Error("Empty response from Gemini");
    if (!isLikelyIncompleteReply(firstText)) return finalizeReply(firstText);

    // One self-healing retry for partial/truncated responses.
    const retryText = await generate(
      `Rewrite the answer to be complete and concise.

Visitor question:
"${message.trim()}"

Draft answer:
"${firstText}"

Return a complete answer in 2-4 sentences.`,
    );
    if (retryText && !isLikelyIncompleteReply(retryText)) return finalizeReply(retryText);

    // Final repair pass: force a clean, complete answer.
    const repairSource = retryText || firstText;
    const repairText = await generate(
      `Write exactly 2 complete sentences for this visitor question.
Do not leave any sentence unfinished.

Visitor question:
"${message.trim()}"

Draft:
"${repairSource}"`,
    );
    if (repairText) return finalizeReply(repairText);
    return finalizeReply(repairSource);
  } catch (err) {
    if (!isProd) {
      // eslint-disable-next-line no-console
      console.error("[gemini] public chat failed", err);
    }
    throw new Error("Chat assistant unavailable");
  }
}
