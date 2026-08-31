import { describe, it, expect } from "vitest";
import { projectRequestSchema } from "@/lib/validation/project-request";
import { projectBriefSchema } from "@/lib/validation/project-brief";

describe("projectRequestSchema", () => {
  const valid = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    projectType: "Full-Stack Web Application",
    description: "Please build me a small analytics dashboard with authentication.",
  };

  it("accepts a well-formed request", () => {
    const r = projectRequestSchema.safeParse(valid);
    expect(r.success).toBe(true);
  });

  it("normalises email to lowercase", () => {
    const r = projectRequestSchema.safeParse({ ...valid, email: "Ada@Example.COM" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe("ada@example.com");
  });

  it("rejects short descriptions", () => {
    const r = projectRequestSchema.safeParse({ ...valid, description: "too short" });
    expect(r.success).toBe(false);
  });

  it("rejects bad emails", () => {
    const r = projectRequestSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(r.success).toBe(false);
  });

  it("rejects unknown projectType", () => {
    const r = projectRequestSchema.safeParse({ ...valid, projectType: "Blockchain NFT thing" });
    expect(r.success).toBe(false);
  });

  it("rejects honeypot fill", () => {
    const r = projectRequestSchema.safeParse({ ...valid, website_hp: "spam" });
    expect(r.success).toBe(false);
  });

  it("allows empty optional fields", () => {
    const r = projectRequestSchema.safeParse({ ...valid, company: "", existingWebsite: "" });
    expect(r.success).toBe(true);
  });

  it("caps description length", () => {
    const r = projectRequestSchema.safeParse({ ...valid, description: "x".repeat(5000) });
    expect(r.success).toBe(false);
  });
});

describe("projectBriefSchema", () => {
  it("accepts a substantive brief", () => {
    const r = projectBriefSchema.safeParse({ brief: "Build a mobile app with camera + AI recognition." });
    expect(r.success).toBe(true);
  });

  it("rejects briefs shorter than 20 chars", () => {
    const r = projectBriefSchema.safeParse({ brief: "too short" });
    expect(r.success).toBe(false);
  });

  it("rejects briefs longer than 2000 chars", () => {
    const r = projectBriefSchema.safeParse({ brief: "a".repeat(2100) });
    expect(r.success).toBe(false);
  });

  it("trims whitespace", () => {
    const r = projectBriefSchema.safeParse({ brief: "   Build a durable analytics pipeline.   " });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.brief.startsWith(" ")).toBe(false);
  });
});
