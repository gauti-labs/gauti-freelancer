import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getAdminEmails, isAdminEmail } from "@/lib/auth/admin";

const ORIGINAL = process.env.ADMIN_EMAILS;

describe("admin allowlist", () => {
  beforeEach(() => {
    delete process.env.ADMIN_EMAILS;
  });
  afterEach(() => {
    process.env.ADMIN_EMAILS = ORIGINAL;
  });

  it("returns an empty list when env is unset (fail-closed)", () => {
    expect(getAdminEmails()).toEqual([]);
    expect(isAdminEmail("anyone@example.com")).toBe(false);
  });

  it("parses comma-separated emails and lowercases them", () => {
    process.env.ADMIN_EMAILS = "One@Example.com, two@example.com ,Three@Example.com";
    expect(getAdminEmails()).toEqual(["one@example.com", "two@example.com", "three@example.com"]);
  });

  it("isAdminEmail is case-insensitive", () => {
    process.env.ADMIN_EMAILS = "admin@example.com";
    expect(isAdminEmail("ADMIN@example.com")).toBe(true);
    expect(isAdminEmail("Admin@Example.COM")).toBe(true);
    expect(isAdminEmail("user@example.com")).toBe(false);
  });

  it("returns false for empty or null input even when allowlist is populated", () => {
    process.env.ADMIN_EMAILS = "admin@example.com";
    expect(isAdminEmail("")).toBe(false);
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
  });

  it("ignores empty tokens in the list", () => {
    process.env.ADMIN_EMAILS = "a@x.com,,,b@x.com,";
    expect(getAdminEmails()).toEqual(["a@x.com", "b@x.com"]);
  });
});
