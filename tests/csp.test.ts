import { describe, it, expect } from "vitest";
import { buildCsp, newNonce } from "@/lib/security/csp";

describe("newNonce", () => {
  it("returns a unique base64url string", () => {
    const a = newNonce();
    const b = newNonce();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThanOrEqual(20);
    expect(a).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});

describe("buildCsp", () => {
  const nonce = "TEST_NONCE_123";

  it("includes the nonce in production script-src and style-src", () => {
    const prod = buildCsp(nonce, false);
    expect(prod).toContain(`'nonce-${nonce}'`);
  });

  it("uses strict-dynamic in production script-src", () => {
    const prod = buildCsp(nonce, false);
    expect(prod).toContain("'strict-dynamic'");
    expect(prod).not.toContain("'unsafe-eval'");
    expect(prod).not.toMatch(/script-src[^;]*'unsafe-inline'/);
  });

  it("allows unsafe-eval only in development", () => {
    const dev = buildCsp(nonce, true);
    expect(dev).toContain("'unsafe-eval'");
    expect(dev).not.toContain(`'nonce-${nonce}'`);
  });

  it("locks frame-ancestors to none", () => {
    expect(buildCsp(nonce, false)).toContain("frame-ancestors 'none'");
  });

  it("only permits generativelanguage.googleapis.com for connect-src (Gemini)", () => {
    const prod = buildCsp(nonce, false);
    expect(prod).toContain("generativelanguage.googleapis.com");
    // No wildcard fetches
    expect(prod).not.toMatch(/connect-src[^;]*\*/);
  });

  it("locks object-src to none (Flash / plugin defence)", () => {
    expect(buildCsp(nonce, false)).toContain("object-src 'none'");
  });
});
