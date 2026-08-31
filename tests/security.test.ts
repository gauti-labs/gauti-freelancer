import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { rateCheck } from "@/lib/ai/rate-limit";
import { isAvailable, requireEnv } from "@/lib/utils/env";

describe("rateCheck", () => {
  it("allows up to the limit within the window", () => {
    const key = `test:${Date.now()}:a`;
    for (let i = 0; i < 3; i++) {
      const r = rateCheck({ key, limit: 3, windowMs: 60_000 });
      expect(r.ok).toBe(true);
    }
    const r4 = rateCheck({ key, limit: 3, windowMs: 60_000 });
    expect(r4.ok).toBe(false);
    expect(r4.resetIn).toBeGreaterThan(0);
  });

  it("keys are isolated", () => {
    const kA = `test:${Date.now()}:x`;
    const kB = `test:${Date.now()}:y`;
    rateCheck({ key: kA, limit: 1, windowMs: 60_000 });
    const r = rateCheck({ key: kB, limit: 1, windowMs: 60_000 });
    expect(r.ok).toBe(true);
  });
});

describe("isAvailable", () => {
  const orig = process.env.__TEST_VAR;
  beforeEach(() => {
    delete process.env.__TEST_VAR;
  });
  afterEach(() => {
    if (orig === undefined) delete process.env.__TEST_VAR;
    else process.env.__TEST_VAR = orig;
  });

  it("returns false when var is missing", () => {
    expect(isAvailable("__TEST_VAR")).toBe(false);
  });

  it("returns false for empty/whitespace", () => {
    process.env.__TEST_VAR = "   ";
    expect(isAvailable("__TEST_VAR")).toBe(false);
  });

  it("returns true when populated", () => {
    process.env.__TEST_VAR = "value";
    expect(isAvailable("__TEST_VAR")).toBe(true);
  });
});

describe("requireEnv", () => {
  it("in development returns empty string when missing (not fatal)", () => {
    // NODE_ENV is 'test' in vitest which behaves like non-production
    delete process.env.__TEST_MISSING;
    expect(requireEnv("__TEST_MISSING")).toBe("");
  });

  it("returns trimmed value when present", () => {
    process.env.__TEST_PRESENT = "  hello  ";
    expect(requireEnv("__TEST_PRESENT")).toBe("hello");
    delete process.env.__TEST_PRESENT;
  });
});
