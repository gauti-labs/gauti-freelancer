import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "./auth.config";
import { buildCsp, newNonce } from "./lib/security/csp";

const { auth: authMiddleware } = NextAuth(authConfig);

const isDev = process.env.NODE_ENV !== "production";

export default authMiddleware(async (req) => {
  const nonce = isDev ? undefined : newNonce();
  const csp = buildCsp(nonce, isDev);

  // Pass the nonce into the app via a request header so RSC can read it.
  const requestHeaders = new Headers(req.headers);
  if (nonce) {
    requestHeaders.set("x-nonce", nonce);
  } else {
    requestHeaders.delete("x-nonce");
  }
  requestHeaders.set("content-security-policy", csp);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  // Set CSP on the outgoing response too so <link>, <img>, fetch etc are governed.
  res.headers.set("content-security-policy", csp);
  return res;
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon|icon|apple-icon|manifest|opengraph-image|robots.txt|sitemap.xml|logo.*\\.svg).*)",
  ],
};

// re-export type of req for type inference — not used at runtime
export type _MiddlewareReq = NextRequest;
