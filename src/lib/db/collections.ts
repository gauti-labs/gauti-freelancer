import type { Collection, Document, ObjectId } from "mongodb";
import { getDb } from "./mongodb";

export const Collections = {
  Users: "users",
  Accounts: "accounts",
  Sessions: "sessions",
  VerificationTokens: "verification_tokens",
  ProjectRequests: "project_requests",
  Projects: "projects",
  Testimonials: "testimonials",
  AiRequests: "ai_requests",
} as const;

export async function collection<T extends Document = Document>(name: string): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}

export type ProjectRequestDoc = {
  _id?: ObjectId;
  name: string;
  email: string;
  company?: string;
  projectType: string;
  description: string;
  budget?: string;
  timeline?: string;
  existingWebsite?: string;
  preferredContact?: string;
  status: "new" | "reviewing" | "contacted" | "in_progress" | "completed" | "archived";
  createdAt: Date;
  ip?: string;
  userAgent?: string;
};

export type AiRequestDoc = {
  _id?: ObjectId;
  userEmail: string;
  userId?: string;
  brief: string;
  result: unknown; // ProjectAnalysis JSON
  model: string;
  createdAt: Date;
  durationMs?: number;
};
