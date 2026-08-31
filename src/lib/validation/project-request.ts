import { z } from "zod";

export const projectTypes = [
  "Full-Stack Web Application",
  "AI / GenAI Application",
  "Agentic AI System",
  "AI Automation",
  "E-commerce Platform",
  "Mobile Application",
  "SaaS Product",
  "API / Backend",
  "DevOps / Cloud",
  "Other",
] as const;

export const budgetRanges = [
  "Under ₹50,000",
  "₹50,000 – ₹2,00,000",
  "₹2,00,000 – ₹10,00,000",
  "₹10,00,000 +",
  "Not sure yet",
] as const;

export const timelines = ["ASAP", "Within 1 month", "1–3 months", "3–6 months", "Flexible"] as const;

export const contactMethods = ["Email", "Phone", "WhatsApp", "Video call"] as const;

export const projectRequestSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(200),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  projectType: z.enum(projectTypes),
  description: z.string().trim().min(20, "Please describe the project (min 20 characters)").max(4000),
  budget: z.enum(budgetRanges).optional(),
  timeline: z.enum(timelines).optional(),
  existingWebsite: z.string().trim().max(500).optional().or(z.literal("")),
  preferredContact: z.enum(contactMethods).optional(),
  // Honeypot — must be empty for humans.
  website_hp: z.string().max(0).optional(),
});

export type ProjectRequestInput = z.infer<typeof projectRequestSchema>;
