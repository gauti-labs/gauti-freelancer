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
